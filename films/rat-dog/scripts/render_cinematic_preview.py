from __future__ import annotations
import math
from pathlib import Path
import numpy as np
import trimesh
import vtk
from vtk.util.numpy_support import numpy_to_vtk, numpy_to_vtkIdTypeArray, vtk_to_numpy
import imageio.v2 as imageio

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'out'
OUT.mkdir(exist_ok=True)
VIDEO = OUT / 'rat-dog-cinematic-v2.mp4'
STILL = OUT / 'rat-dog-cinematic-v2.png'
W, H, FPS, DURATION = 720, 406, 20, 6.0
FRAMES = int(FPS * DURATION)

# ---------- matrices ----------
def T(x=0,y=0,z=0):
    m=np.eye(4); m[:3,3]=[x,y,z]; return m

def Rx(a):
    c,s=math.cos(a),math.sin(a); return np.array([[1,0,0,0],[0,c,-s,0],[0,s,c,0],[0,0,0,1]],float)

def Ry(a):
    c,s=math.cos(a),math.sin(a); return np.array([[c,0,s,0],[0,1,0,0],[-s,0,c,0],[0,0,0,1]],float)

def Rz(a):
    c,s=math.cos(a),math.sin(a); return np.array([[c,-s,0,0],[s,c,0,0],[0,0,1,0],[0,0,0,1]],float)

def S(x=1,y=1,z=1):
    return np.diag([x,y,z,1.0])

def around(pivot, mat):
    x,y,z=pivot; return T(x,y,z) @ mat @ T(-x,-y,-z)

def vtk_matrix(m):
    vm=vtk.vtkMatrix4x4()
    for r in range(4):
        for c in range(4): vm.SetElement(r,c,float(m[r,c]))
    return vm

# ---------- animation matching src/animation.mjs ----------
def smoothstep(a,b,x):
    q=max(0,min(1,(x-a)/(b-a if b != a else 1)))
    return q*q*(3-2*q)

def beat_phase(frame,fps,bpm):
    bf=fps*60/bpm
    return (frame%bf)/bf

def character_pose(frame, role):
    bpm=118; mirror=-1 if role=='dog' else 1; phase=.5 if role=='dog' else 0; energy=.98 if role=='dog' else 1.05
    bf=FPS*60/bpm; shifted=frame+phase*bf
    p=beat_phase(shifted,FPS,bpm); bar=beat_phase(shifted,FPS,bpm/4)
    ba=p*math.tau; bara=bar*math.tau
    jump=math.sin((p/.5)*math.pi)*.58*energy if p<.5 else 0
    base={
        'jump':jump,'sway':math.sin(ba)*.17*mirror*energy,
        'arm':math.sin(ba+math.pi/2)*.72*mirror*energy,
        'leg':math.sin(ba+math.pi)*.48*mirror*energy,
        'tilt':math.sin(ba)*.09*mirror,
        'headBob':abs(math.sin(ba))*.075*energy,
        'headTurn':math.sin(bara)*.18*mirror,
        'shoulder':abs(math.sin(ba))*.08*energy,
        'tail':math.sin(ba*.5+math.pi/3)*.42*mirror,
        'mouth':.16+max(0,math.sin(ba-math.pi/4))*.26,
    }
    t=frame/FPS
    battle=smoothstep(2.25,2.85,t)*(1-smoothstep(4.15,4.7,t))
    finale=smoothstep(4.6,5.55,t)
    intro=1-smoothstep(.55,1.35,t)
    sd=-1 if role=='dog' else 1
    base.update({
        'spin':math.sin(max(0,t-2.35)*math.pi*1.8)*.92*battle*sd,
        'crouch':max(0,math.sin((t-1.45)*math.pi*1.35))*(1-battle)*.16,
        'reach':math.sin(t*math.pi*1.15+phase*math.pi)*.22+battle*.28*mirror,
        'expression':max(0,min(1,.42+battle*.38+finale*.2-intro*.16)),
        'finale':finale,
    })
    return base

def camera_pose(frame):
    t=frame/FPS
    section=0 if t<1.7 else 1 if t<3.2 else 2 if t<4.55 else 3
    vals=[(9.1,-.38,.82,-.055),(7.6,.42,.98,.07),(6.75,-.18,1.08,-.04),(8.35,0,.86,0)]
    d,x,ty,yaw=vals[section]
    return d+math.sin(t*.72)*.15, x+math.sin(t*.43)*.06, ty+math.sin(t*.51)*.025, yaw+math.sin(t*.32)*.015

# ---------- VTK geometry ----------
def mesh_actor(mesh: trimesh.Trimesh, name: str):
    poly=vtk.vtkPolyData()
    pts=vtk.vtkPoints(); pts.SetData(numpy_to_vtk(np.asarray(mesh.vertices, dtype=np.float32), deep=True)); poly.SetPoints(pts)
    faces=np.asarray(mesh.faces, dtype=np.int64)
    cells=np.empty((len(faces),4),dtype=np.int64); cells[:,0]=3; cells[:,1:]=faces
    ca=vtk.vtkCellArray(); ca.SetCells(len(faces), numpy_to_vtkIdTypeArray(cells.ravel(), deep=True)); poly.SetPolys(ca)
    normals=vtk.vtkPolyDataNormals(); normals.SetInputData(poly); normals.SplittingOff(); normals.ConsistencyOn(); normals.AutoOrientNormalsOn(); normals.Update()
    mapper=vtk.vtkPolyDataMapper(); mapper.SetInputConnection(normals.GetOutputPort())
    actor=vtk.vtkActor(); actor.SetMapper(mapper)
    colors=np.asarray(mesh.visual.face_colors)
    rgb=(colors[0,:3]/255.0) if colors.size else np.array([.7,.7,.7])
    prop=actor.GetProperty(); prop.SetColor(*[float(x) for x in rgb]); prop.SetInterpolationToPBR()
    is_gold=any(k in name for k in ('medallion','string_tip','chain'))
    is_eye=any(k in name for k in ('eye_','glint','nose'))
    is_cloth=any(k in name for k in ('hoodie','jacket','cap','pocket'))
    prop.SetMetallic(.72 if is_gold else .02)
    prop.SetRoughness(.22 if is_gold else .3 if is_eye else .58 if is_cloth else .78)
    return actor

def load_character(path):
    scene=trimesh.load(path, force='scene')
    actors={}
    for name,geom in scene.geometry.items():
        actors[name]=mesh_actor(geom,name)
    return actors

# ---------- scene ----------
rw=vtk.vtkRenderWindow(); rw.SetOffScreenRendering(1); rw.SetSize(W,H); rw.SetMultiSamples(0)
ren=vtk.vtkRenderer(); rw.AddRenderer(ren); ren.SetBackground(.012,.015,.035); ren.SetBackground2(.055,.015,.075); ren.GradientBackgroundOn(); ren.UseFXAAOn()

rat=load_character(ROOT/'public/models/rat-character.glb')
dog=load_character(ROOT/'public/models/dog-character.glb')
for a in [*rat.values(),*dog.values()]: ren.AddActor(a)

# Floor.
plane=vtk.vtkPlaneSource(); plane.SetOrigin(-7,-1.20,-4); plane.SetPoint1(7,-1.20,-4); plane.SetPoint2(-7,-1.20,6); plane.SetResolution(1,1)
pm=vtk.vtkPolyDataMapper(); pm.SetInputConnection(plane.GetOutputPort())
pa=vtk.vtkActor(); pa.SetMapper(pm); pa.GetProperty().SetInterpolationToPBR(); pa.GetProperty().SetColor(.055,.065,.11); pa.GetProperty().SetMetallic(.35); pa.GetProperty().SetRoughness(.24); ren.AddActor(pa)

# Back wall and luminous columns.
def cube_actor(center, size, color, emissive=False):
    c=vtk.vtkCubeSource(); c.SetXLength(size[0]); c.SetYLength(size[1]); c.SetZLength(size[2]); c.SetCenter(*center)
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(c.GetOutputPort()); a=vtk.vtkActor(); a.SetMapper(m); a.GetProperty().SetColor(*color)
    if emissive:
        a.GetProperty().SetAmbient(1); a.GetProperty().SetDiffuse(.25)
    else:
        a.GetProperty().SetInterpolationToPBR(); a.GetProperty().SetRoughness(.48)
    ren.AddActor(a); return a

cube_actor((0,2.05,-3.8),(14,6.6,.18),(.025,.03,.07))
for x,col in [(-5.2,(.1,.42,1)),(-4.65,(.2,.62,1)),(4.65,(1,.12,.42)),(5.2,(1,.28,.55))]:
    cube_actor((x,.75,-3.45),(.13,4.0,.13),col,True)
    for y in np.linspace(-.65,2.15,6):
        sph=vtk.vtkSphereSource(); sph.SetRadius(.085); sph.SetCenter(x,float(y),-3.33); sph.SetThetaResolution(16); sph.SetPhiResolution(12)
        sm=vtk.vtkPolyDataMapper(); sm.SetInputConnection(sph.GetOutputPort()); sa=vtk.vtkActor(); sa.SetMapper(sm); sa.GetProperty().SetColor(*col); sa.GetProperty().SetAmbient(1); sa.GetProperty().SetDiffuse(.1); ren.AddActor(sa)

# Fake soft contact shadows.
shadows=[]
for x in (-1.45,1.45):
    ds=vtk.vtkDiskSource(); ds.SetInnerRadius(0); ds.SetOuterRadius(.75); ds.SetCircumferentialResolution(64)
    dm=vtk.vtkPolyDataMapper(); dm.SetInputConnection(ds.GetOutputPort()); da=vtk.vtkActor(); da.SetMapper(dm); da.SetPosition(x,-1.185,.08); da.SetOrientation(90,0,0); da.GetProperty().SetColor(0,0,0); da.GetProperty().SetOpacity(.34); ren.AddActor(da); shadows.append(da)

# Lighting.
ren.AutomaticLightCreationOff()
def light(pos, focal, color, intensity, positional=True, cone=28):
    l=vtk.vtkLight(); l.SetLightTypeToSceneLight(); l.SetPosition(*pos); l.SetFocalPoint(*focal); l.SetColor(*color); l.SetIntensity(intensity); l.SetPositional(positional)
    if positional: l.SetConeAngle(cone); l.SetExponent(1.3)
    ren.AddLight(l); return l
key=light((0,5.8,5.4),(0,.6,0),(1,.83,.72),1.15,False)
blue=light((-5.4,5.2,3.5),(-1,.7,0),(.28,.55,1),1.25,True,34)
pink=light((5.2,5.1,3.0),(1,.8,0),(1,.22,.52),1.15,True,34)
rim=light((0,4.0,-3),(0,1,0),(.58,.34,1),.9,True,42)

cam=ren.GetActiveCamera(); cam.SetViewAngle(30); cam.SetViewUp(0,1,0)

HEAD_KEYS=('head','muzzle','nose','ear_','eye_','mouth','tongue','tooth','cap','brow','cheek','whisker','face_stripe')

def part_matrix(name, pose, role):
    isdog=role=='dog'; pre='dog' if isdog else 'rat'
    m=np.eye(4)
    # Head turns/bobs as a unit.
    if any(k in name for k in HEAD_KEYS):
        pivot=(0,1.58 if isdog else 1.52,0)
        ang=(-pose['headTurn'] if isdog else pose['headTurn'])*.82
        m=around(pivot, Ry(ang) @ Rz((-1 if isdog else 1)*pose['tilt']*.3)) @ m
        m=T(0,pose['headBob'],0) @ m
    # Arms.
    for side in (-1,1):
        if any(token in name for token in (f'upper_arm_{side}',f'forearm_{side}',f'hand_{side}',f'finger_{side}',f'toe_{side}')) and 'toe_' not in name:
            px=.65*side if isdog else .62*side; py=.70 if isdog else .67
            base=(.36 if isdog else .35)*(-side)
            swing=(-pose['arm'] if isdog else pose['arm'])*(-side*.9)
            reach=pose['reach']*(-side)
            finale=pose['finale']*(-side)*.75
            m=around((px,py,0), Rz(base+swing+reach+finale)) @ m
    # Legs.
    for side in (-1,1):
        if any(token in name for token in (f'leg_{side}',f'shoe_{side}',f'shoe_top_{side}',f'sole_{side}')):
            px=.31*side if isdog else .30*side; py=-.40
            a=pose['leg']*(side if isdog else -side)*.72
            m=around((px,py,0), Rx(a)) @ m
    # Tail.
    if 'tail_' in name:
        m=around((.28 if isdog else .15,-.48,-.18), Rz(pose['tail']*.65)) @ m
    # Blink with eye compression.
    if 'eye_' in name or 'glint' in name:
        side=-1 if '-1' in name or '-0.24' in name else 1
        center=(.24*side,1.73 if isdog else 1.68,.62)
        sy=max(.12,1-pose.get('blink',0)*.85)
        m=around(center,S(1,sy,1)) @ m
    # Mouth opens downward subtly.
    if any(k in name for k in ('mouth','tongue')):
        pivot=(0,1.48 if isdog else 1.43,.72)
        m=around(pivot,Rx(-pose['mouth']*.32)) @ m
    return m

def update_character(actors, pose, role):
    isdog=role=='dog'; base_x=1.38 if isdog else -1.38
    root=T(base_x+pose['sway'], (-.03 if isdog else -.12)+pose['jump']-pose['crouch'], 0)
    root=root @ Ry(pose['spin']) @ Rz((-1 if isdog else 1)*(-pose['tilt']))
    if isdog: root=root @ S(1.04,1.04,1.04)
    for name,a in actors.items():
        a.SetUserMatrix(vtk_matrix(root @ part_matrix(name,pose,role)))

writer=imageio.get_writer(VIDEO, fps=FPS, codec='libx264', quality=8, macro_block_size=None, ffmpeg_log_level='error')
mid_frame=None
for f in range(FRAMES):
    rp=character_pose(f,'rat'); dp=character_pose(f,'dog')
    update_character(rat,rp,'rat'); update_character(dog,dp,'dog')
    shadows[0].SetPosition(-1.38+rp['sway'],-1.182,.08); shadows[0].SetScale(1-.22*min(1,rp['jump']),1-.22*min(1,rp['jump']),1)
    shadows[1].SetPosition(1.38+dp['sway'],-1.182,.08); shadows[1].SetScale(1-.22*min(1,dp['jump']),1-.22*min(1,dp['jump']),1)
    # Camera shot choreography.
    dist,x,targetY,yaw=camera_pose(f)
    camx=x+math.sin(yaw)*dist*.32; camz=math.cos(yaw)*dist
    cam.SetPosition(camx,1.52+0.08*math.sin(f/FPS*.55),camz)
    cam.SetFocalPoint(0,targetY,0)
    # Breathing stage light pulse.
    pulse=.5+.5*math.sin(f/FPS*math.pi*2*.55)
    blue.SetIntensity(1.0+.55*pulse); pink.SetIntensity(1.0+.48*(1-pulse)); rim.SetIntensity(.72+.28*pulse)
    rw.Render()
    w2i=vtk.vtkWindowToImageFilter(); w2i.SetInput(rw); w2i.SetInputBufferTypeToRGB(); w2i.ReadFrontBufferOff(); w2i.Update()
    img=w2i.GetOutput(); arr=vtk_to_numpy(img.GetPointData().GetScalars()).reshape(H,W,3)[::-1]
    writer.append_data(arr)
    if f==int(FRAMES*.56): mid_frame=arr.copy()
    if f % 20 == 0: print(f'frame {f}/{FRAMES}', flush=True)
writer.close()
if mid_frame is not None: imageio.imwrite(STILL,mid_frame)
print(VIDEO)
print(STILL)
