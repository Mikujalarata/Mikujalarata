import bpy, json, math, os, sys
from mathutils import Vector
from mathutils.kdtree import KDTree
import numpy as np

ARGS=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
OUT=os.path.abspath(ARGS[ARGS.index('--out')+1]) if '--out' in ARGS else os.path.abspath('out-skin-repair')
os.makedirs(OUT,exist_ok=True)
ARM=bpy.data.objects['RatProductionRig']
JOINTS=['root','hips','spine','chest','neck','head','jaw','ear.L','ear.R','eye.L','eye.R','brow.L','brow.R','upper_arm.L','forearm.L','hand.L','upper_arm.R','forearm.R','hand.R','thigh.L','shin.L','foot.L','thigh.R','shin.R','foot.R','tail.01','tail.02','tail.03','tail.04','tail.05','tail.06']
J={n:i for i,n in enumerate(JOINTS)}

def gltf_coord(v): return np.array([v.x,v.z,-v.y],dtype=float)
def world_point(obj,v): return obj.matrix_world @ v.co

def bone_seg(name):
    b=ARM.data.bones[name]
    return gltf_coord(ARM.matrix_world @ b.head_local), gltf_coord(ARM.matrix_world @ b.tail_local)
SEGS={n:bone_seg(n) for n in JOINTS if n in ARM.data.bones}

def dseg(P,A,B):
    AB=B-A; den=float(np.dot(AB,AB))
    if den<1e-12:return np.linalg.norm(P-A,axis=1)
    t=np.clip(((P-A)@AB)/den,0,1); return np.linalg.norm(P-(A+t[:,None]*AB),axis=1)
def fld(P,cands,sharp):
    D=np.column_stack([dseg(P,*SEGS[n]) for n in cands]); S=np.exp(-sharp*D*D)+1e-12; S/=S.sum(1,keepdims=True); return S
def sig(x):return 1/(1+np.exp(-x))
def sm(x):x=np.clip(x,0,1);return x*x*(3-2*x)
def assemble(P,parts):
    alln=[]
    for c,_,_ in parts:
        for n in c:
            if n not in alln:alln.append(n)
    S=np.zeros((len(P),len(alln)),float)
    for c,F,m in parts:
        mm=np.asarray(m).reshape(-1)
        for k,n in enumerate(c):S[:,alln.index(n)]+=F[:,k]*mm
    S/=np.maximum(S.sum(1,keepdims=True),1e-12); keep=np.argpartition(S,-4,axis=1)[:,-4:]
    names=[];weights=[]
    for r in range(len(P)):
        ids=keep[r];vals=S[r,ids];o=np.argsort(vals)[::-1];ids=ids[o];vals=vals[o];vals/=vals.sum();names.append([alln[i] for i in ids]);weights.append(vals.tolist())
    return names,weights

def body_field(P):
    x,y=P[:,0],P[:,1];tor=['hips','spine','chest','neck'];hd=['neck','head'];LA=['upper_arm.L','forearm.L','hand.L'];RA=['upper_arm.R','forearm.R','hand.R'];LL=['thigh.L','shin.L','foot.L'];RL=['thigh.R','shin.R','foot.R']
    aw=sig((y-1.48)*9)*sig((2.66-y)*9);am=sm((np.abs(x)-.40)/.68)*aw;hm=sm((y-2.46)/.42)*(1-sm((np.abs(x)-.65)/.45));lm=sm((1.68-y)/.50)*sm(np.abs(x)/.30);other=np.clip(np.maximum.reduce([am,hm,lm]),0,.96);tm=1-other;L=sig(x*12);R=1-L
    return assemble(P,[(tor,fld(P,tor,7),tm),(hd,fld(P,hd,8),hm),(LA,fld(P,LA,9),am*L),(RA,fld(P,RA,9),am*R),(LL,fld(P,LL,10),lm*L),(RL,fld(P,RL,10),lm*R)])
def trousers_field(P):
    x,y=P[:,0],P[:,1];hips=['hips'];LL=['thigh.L','shin.L','foot.L'];RL=['thigh.R','shin.R','foot.R'];lm=sm((1.68-y)/.50);L=sig(x*12);R=1-L
    return assemble(P,[(hips,fld(P,hips,8),1-lm),(LL,fld(P,LL,10),lm*L),(RL,fld(P,RL,10),lm*R)])

def points(obj): return np.array([gltf_coord(world_point(obj,v)) for v in obj.data.vertices],float)
def apply(obj,names,weights):
    ids=list(range(len(obj.data.vertices)))
    for n in JOINTS:
        vg=obj.vertex_groups.get(n)
        if vg:
            try: vg.remove(ids)
            except RuntimeError: pass
    for i,(ns,ws) in enumerate(zip(names,weights)):
        for n,w in zip(ns,ws):
            if w<=1e-8:continue
            vg=obj.vertex_groups.get(n) or obj.vertex_groups.new(name=n); vg.add([i],float(w),'REPLACE')

def transfer_from_body(body_obj, body_names, body_weights, garment_obj, k=6):
    b_world=[world_point(body_obj,v) for v in body_obj.data.vertices]; tree=KDTree(len(b_world))
    for i,p in enumerate(b_world):tree.insert(p,i)
    tree.balance(); outn=[];outw=[]
    for v in garment_obj.data.vertices:
        p=world_point(garment_obj,v); hits=tree.find_n(p,k);acc={}
        raw=[]
        for co,idx,dist in hits: raw.append((idx,1/max(float(dist),1e-5)**2))
        den=sum(a for _,a in raw)
        for idx,a in raw:
            a/=den
            for n,w in zip(body_names[idx],body_weights[idx]):acc[n]=acc.get(n,0.0)+a*w
        top=sorted(acc.items(),key=lambda kv:kv[1],reverse=True)[:4];tot=sum(v for _,v in top);outn.append([n for n,_ in top]);outw.append([v/tot for _,v in top])
    return outn,outw

def score(P,names,weights,mask,bones):
    vals=[]
    for i in np.where(mask)[0]: vals.append(sum(w for n,w in zip(names[i],weights[i]) if n in bones))
    return float(np.mean(vals)) if vals else 0.0

def semantic_report(bodyP,bn,bw,hoodP,hn,hw,trP,tn,tw):
    out={}
    checks={
      'body_head':(bodyP,bn,bw,(bodyP[:,1]>2.65)&(np.abs(bodyP[:,0])<.8),['neck','head'],.80),
      'body_chest':(bodyP,bn,bw,(bodyP[:,1]>1.95)&(bodyP[:,1]<2.35)&(np.abs(bodyP[:,0])<.45),['spine','chest','neck'],.65),
      'body_left_arm':(bodyP,bn,bw,(bodyP[:,0]>.55)&(bodyP[:,1]>1.65)&(bodyP[:,1]<2.55),['upper_arm.L','forearm.L','hand.L'],.65),
      'body_right_arm':(bodyP,bn,bw,(bodyP[:,0]<-.55)&(bodyP[:,1]>1.65)&(bodyP[:,1]<2.55),['upper_arm.R','forearm.R','hand.R'],.65),
      'body_left_leg':(bodyP,bn,bw,(bodyP[:,0]>.08)&(bodyP[:,1]<1.45),['thigh.L','shin.L','foot.L'],.70),
      'body_right_leg':(bodyP,bn,bw,(bodyP[:,0]<-.08)&(bodyP[:,1]<1.45),['thigh.R','shin.R','foot.R'],.70),
      'hoodie_torso':(hoodP,hn,hw,np.abs(hoodP[:,0])<.45,['hips','spine','chest','neck'],.80),
      'hoodie_left_sleeve':(hoodP,hn,hw,hoodP[:,0]>.65,['chest','upper_arm.L','forearm.L','hand.L'],.62),
      'hoodie_right_sleeve':(hoodP,hn,hw,hoodP[:,0]<-.65,['chest','upper_arm.R','forearm.R','hand.R'],.62),
      'trousers_waist':(trP,tn,tw,trP[:,1]>1.35,['hips','thigh.L','thigh.R'],.75),
      'trousers_left_leg':(trP,tn,tw,(trP[:,0]>.08)&(trP[:,1]<1.30),['thigh.L','shin.L','foot.L'],.72),
      'trousers_right_leg':(trP,tn,tw,(trP[:,0]<-.08)&(trP[:,1]<1.30),['thigh.R','shin.R','foot.R'],.72),
    }
    fails=[]
    for k,(P,n,w,m,b,t) in checks.items():
        s=score(P,n,w,m,b);out[k]={'score':s,'target':t,'vertices':int(m.sum()),'pass':s>=t}
        if s<t:fails.append(k)
    out['pass']=not fails;out['failures']=fails;return out

def reset_pose():
    for pb in ARM.pose.bones:
        pb.rotation_mode='XYZ';pb.rotation_euler=(0,0,0);pb.location=(0,0,0);pb.scale=(1,1,1)
def pose(vals):
    reset_pose()
    for n,deg in vals.items():
        pb=ARM.pose.bones[n];pb.rotation_euler=tuple(math.radians(v) for v in deg)
    bpy.context.view_layer.update()
def look_at(cam,target):cam.rotation_euler=(Vector(target)-cam.location).to_track_quat('-Z','Y').to_euler()
def render(name,vals):
    pose(vals);sc=bpy.context.scene;sc.render.engine='BLENDER_EEVEE_NEXT';sc.render.resolution_x=640;sc.render.resolution_y=640;sc.render.resolution_percentage=100;sc.render.image_settings.file_format='PNG';cam=sc.camera;cam.location=(4.7,-6.6,3.1);cam.data.lens=62;look_at(cam,(0,0,1.85));sc.render.filepath=os.path.join(OUT,name+'.png');bpy.ops.render.render(write_still=True)

body=bpy.data.objects['Rat_Body_Skinned'];hood=bpy.data.objects['Hoodie_Skinned'];tr=bpy.data.objects['Trousers_Skinned']
BP=points(body);BN,BW=body_field(BP);apply(body,BN,BW)
HP=points(hood);HN,HW=transfer_from_body(body,BN,BW,hood,6);apply(hood,HN,HW)
TP=points(tr);TN,TW=trousers_field(TP);apply(tr,TN,TW)
report=semantic_report(BP,BN,BW,HP,HN,HW,TP,TN,TW)
with open(os.path.join(OUT,'skin-repair-report.json'),'w') as f:json.dump(report,f,indent=2)
if not report['pass']:raise RuntimeError('semantic skin gate failed: '+','.join(report['failures']))
render('skin-qa-neutral',{})
render('skin-qa-spine-head',{'chest':(8,0,13),'neck':(-6,0,-18),'head':(4,0,22)})
render('skin-qa-arms',{'upper_arm.L':(0,0,42),'forearm.L':(0,0,-58),'upper_arm.R':(0,0,-28),'forearm.R':(0,0,44),'chest':(0,0,-7),'head':(0,0,8)})
render('skin-qa-legs',{'hips':(0,0,7),'thigh.L':(18,0,12),'shin.L':(-38,0,-6),'thigh.R':(-16,0,-10),'shin.R':(34,0,5),'chest':(0,0,-5)})
reset_pose();bpy.context.view_layer.update()
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'rat-production-v3-skin-repaired.blend'))
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'rat-production-v3-skin-repaired.glb'),export_format='GLB',export_skins=True,export_animations=False,export_morph=True,export_yup=True,export_apply=False,export_lights=False,export_cameras=False)
print('SKIN REPAIR COMPLETE');print(json.dumps(report,indent=2))
