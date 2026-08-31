import json,struct,sys
from pathlib import Path
import numpy as np
p=Path(sys.argv[1]);raw=p.read_bytes();jl=struct.unpack_from('<I',raw,12)[0];g=json.loads(raw[20:20+jl].decode().rstrip('\x00 '));binbuf=raw[20+jl+8:]
DT={5121:np.uint8,5123:np.uint16,5125:np.uint32,5126:np.float32};N={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
def r(ai):
 a=g['accessors'][ai];bv=g['bufferViews'][a['bufferView']];dt=DT[a['componentType']];n=N[a['type']];off=bv.get('byteOffset',0)+a.get('byteOffset',0);return np.frombuffer(binbuf,dtype=dt,count=a['count']*n,offset=off).reshape(a['count'],n)
names=[n.get('name',str(i)) for i,n in enumerate(g['nodes'])];skin=g['skins'][0];jn=[names[i] for i in skin['joints']];J={n:i for i,n in enumerate(jn)}
def mesh(name):
 n=next(n for n in g['nodes'] if n.get('name')==name);pr=g['meshes'][n['mesh']]['primitives'][0];return r(pr['attributes']['POSITION']).astype(float),r(pr['attributes']['JOINTS_0']).astype(int),r(pr['attributes']['WEIGHTS_0']).astype(float)
def score(j,w,mask,bones):
 if not np.any(mask): return 0.0
 return float(((np.isin(j[mask],[J[b] for b in bones]))*w[mask]).sum(1).mean())
fail=[]
# Body semantic regions.
P,j,w=mesh('Rat_Body_Skinned')
checks=[
 ('body_head',(P[:,1]>2.65)&(np.abs(P[:,0])<0.8),['neck','head'],0.80),
 ('body_chest',(P[:,1]>1.95)&(P[:,1]<2.35)&(np.abs(P[:,0])<0.45),['spine','chest','neck'],0.65),
 ('body_left_arm',(P[:,0]>0.55)&(P[:,1]>1.65)&(P[:,1]<2.55),['upper_arm.L','forearm.L','hand.L'],0.65),
 ('body_right_arm',(P[:,0]<-0.55)&(P[:,1]>1.65)&(P[:,1]<2.55),['upper_arm.R','forearm.R','hand.R'],0.65),
 ('body_left_leg',(P[:,0]>0.08)&(P[:,1]<1.45),['thigh.L','shin.L','foot.L'],0.70),
 ('body_right_leg',(P[:,0]<-0.08)&(P[:,1]<1.45),['thigh.R','shin.R','foot.R'],0.70),
]
for name,mask,bones,target in checks:
 s=score(j,w,mask,bones);print(f'{name:19s} {s:.3f} n={mask.sum()} target>={target:.2f}')
 if s<target:fail.append(name)
# Hoodie must be torso-driven centrally and arm-driven on sleeves.
P,j,w=mesh('Hoodie_Skinned')
hchecks=[
 ('hoodie_torso',np.abs(P[:,0])<0.45,['hips','spine','chest','neck'],0.80),
 ('hoodie_left_sleeve',P[:,0]>0.65,['chest','upper_arm.L','forearm.L','hand.L'],0.62),
 ('hoodie_right_sleeve',P[:,0]<-0.65,['chest','upper_arm.R','forearm.R','hand.R'],0.62),
]
for name,mask,bones,target in hchecks:
 s=score(j,w,mask,bones);print(f'{name:19s} {s:.3f} n={mask.sum()} target>={target:.2f}')
 if s<target:fail.append(name)
# Trousers: waist cannot be foot-driven; lower legs must follow the correct side.
P,j,w=mesh('Trousers_Skinned')
tchecks=[
 ('trousers_waist',P[:,1]>1.35,['hips','thigh.L','thigh.R'],0.75),
 ('trousers_left_leg',(P[:,0]>0.08)&(P[:,1]<1.30),['thigh.L','shin.L','foot.L'],0.72),
 ('trousers_right_leg',(P[:,0]<-0.08)&(P[:,1]<1.30),['thigh.R','shin.R','foot.R'],0.72),
]
for name,mask,bones,target in tchecks:
 s=score(j,w,mask,bones);print(f'{name:19s} {s:.3f} n={mask.sum()} target>={target:.2f}')
 if s<target:fail.append(name)
# All repaired skinned meshes must remain normalized.
for mn in ['Rat_Body_Skinned','Hoodie_Skinned','Trousers_Skinned','Rat_Tail_Skinned']:
 _,_,ww=mesh(mn);err=float(np.max(np.abs(ww.sum(1)-1)));print(f'{mn:19s} max_sum_error={err:.8f}')
 if err>1e-4:fail.append(mn+'_weight_sum')
if fail:
 print('SKIN SEMANTIC GATE: FAIL',','.join(fail));raise SystemExit(1)
print('SKIN SEMANTIC GATE: PASS')
