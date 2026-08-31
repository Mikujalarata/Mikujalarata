from __future__ import annotations
import math
from pathlib import Path
import numpy as np
import trimesh

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'models'
OUT.mkdir(parents=True, exist_ok=True)


def rgba(hex_color: str):
    h = hex_color.lstrip('#')
    if len(h) == 6:
        h += 'ff'
    return [int(h[i:i+2], 16) for i in (0,2,4,6)]


def set_color(mesh: trimesh.Trimesh, color: str):
    mesh.visual.face_colors = rgba(color)
    return mesh


def transform(mesh: trimesh.Trimesh, position=(0,0,0), scale=(1,1,1), rotation=(0,0,0)):
    mesh = mesh.copy()
    mesh.apply_scale(scale)
    rx, ry, rz = rotation
    if rx:
        mesh.apply_transform(trimesh.transformations.rotation_matrix(rx, [1,0,0]))
    if ry:
        mesh.apply_transform(trimesh.transformations.rotation_matrix(ry, [0,1,0]))
    if rz:
        mesh.apply_transform(trimesh.transformations.rotation_matrix(rz, [0,0,1]))
    mesh.apply_translation(position)
    return mesh


def sphere(radius=1, **kwargs):
    return transform(trimesh.creation.icosphere(subdivisions=3, radius=radius), **kwargs)


def capsule(radius=.2, height=.8, **kwargs):
    # trimesh capsule height includes cylinder section length.
    return transform(trimesh.creation.capsule(height=height, radius=radius, count=[24,24]), **kwargs)


def box(extents=(1,1,1), **kwargs):
    return transform(trimesh.creation.box(extents=extents), **kwargs)


def add(scene, name, mesh, color):
    scene.add_geometry(set_color(mesh, color), node_name=name, geom_name=name)


def make_rat():
    s = trimesh.Scene()
    fur='#4b4a50'; light='#77727a'; skin='#ef9a8a'; red='#a61f24'; red2='#6f1117'; white='#fff8ee'; black='#120f12'; gold='#d8a83c'
    add(s,'rat_body', capsule(.57,.62, position=(0,.35,0), scale=(1.05,1,.82)), red2)
    add(s,'rat_hoodie_shell', sphere(.62, position=(0,.43,.03), scale=(1.02,1.08,.83)), red)
    add(s,'rat_belly', sphere(.34, position=(0,.43,.54), scale=(1,1.15,.4)), light)
    add(s,'rat_head', sphere(.68, position=(0,1.55,.02), scale=(1.02,.98,.94)), fur)
    add(s,'rat_muzzle', sphere(.30, position=(0,1.47,.64), scale=(1.25,.78,.9)), skin)
    add(s,'rat_nose', sphere(.13, position=(0,1.57,.89), scale=(1.05,.82,.78)), '#dc776e')
    for x in (-.53,.53):
        add(s,f'rat_ear_outer_{x:+.2f}', sphere(.35, position=(x,1.89,.02), scale=(.82,1.08,.35)), fur)
        add(s,f'rat_ear_inner_{x:+.2f}', sphere(.27, position=(x,1.89,.075), scale=(.82,1.06,.25)), skin)
    for x in (-.24,.24):
        add(s,f'rat_eye_white_{x:+.2f}', sphere(.17, position=(x,1.68,.55), scale=(.82,1.08,.52)), white)
        add(s,f'rat_eye_pupil_{x:+.2f}', sphere(.085, position=(x*.92,1.67,.68), scale=(.88,1,.5)), black)
    add(s,'rat_mouth', sphere(.18, position=(0,1.35,.75), scale=(1.1,.46,.55)), '#54262b')
    add(s,'rat_tooth_l', box((.12,.14,.05), position=(-.075,1.39,.91)), white)
    add(s,'rat_tooth_r', box((.12,.14,.05), position=(.075,1.39,.91)), white)
    add(s,'rat_cap', sphere(.55, position=(0,2.11,.02), scale=(1,.22,1.02)), '#c3292e')
    add(s,'rat_cap_brim', box((.72,.09,.42), position=(.1,2.07,.46), rotation=(.08,-.04,0)), '#b91f25')
    for side in (-1,1):
        x=.62*side
        add(s,f'rat_upper_arm_{side}', capsule(.18,.62, position=(x,.35,0), rotation=(0,0,-.25*side)), red)
        add(s,f'rat_forearm_{side}', capsule(.14,.38, position=(x*1.08,-.22,0), rotation=(0,0,-.08*side)), fur)
        add(s,f'rat_hand_{side}', sphere(.18, position=(x*1.12,-.52,0), scale=(.82,1,.82)), skin)
        lx=.3*side
        add(s,f'rat_leg_{side}', capsule(.21,.56, position=(lx,-.57,0), rotation=(0,0,-.04*side)), fur)
        add(s,f'rat_shoe_{side}', sphere(.25, position=(lx,-1.0,.18), scale=(1.1,.48,1.55)), white)
        add(s,f'rat_shoe_top_{side}', sphere(.22, position=(lx,-.96,.26), scale=(1,.45,1.35)), '#b51f25')
    # Tail as connected capsules.
    for i in range(10):
        t=i/9
        add(s,f'rat_tail_{i}', capsule(.055-t*.025,.22, position=(.2+t*.19,-.5-t*.02,-.22), rotation=(0,0,-1+t*.2)), skin)
    add(s,'rat_chain_medallion', sphere(.13, position=(0,.53,.68), scale=(1,.95,.35)), gold)
    return s


def make_dog():
    s = trimesh.Scene()
    brown='#9a551f'; dark='#5c2c16'; cream='#f4e4ca'; white='#fffaf0'; black='#151318'; blue='#174b78'; blue2='#0d2f50'; gold='#d7aa42'
    add(s,'dog_body', capsule(.58,.68, position=(0,.35,0), scale=(1.04,1,.86)), brown)
    add(s,'dog_jacket', sphere(.62, position=(0,.47,.02), scale=(1.04,1.05,.86)), blue)
    add(s,'dog_belly', sphere(.38, position=(0,.38,.52), scale=(.92,1.15,.36)), cream)
    add(s,'dog_head', sphere(.69, position=(0,1.63,.02), scale=(1.03,.96,.92)), brown)
    add(s,'dog_muzzle', sphere(.4, position=(0,1.51,.62), scale=(1.25,.82,.82)), cream)
    add(s,'dog_nose', sphere(.14, position=(0,1.60,.90), scale=(1.12,.8,.72)), black)
    add(s,'dog_face_stripe', box((.12,.9,.05), position=(0,1.81,.64)), cream)
    for side in (-1,1):
        x=.54*side
        add(s,f'dog_ear_{side}', capsule(.20,.58, position=(x,1.86,0), rotation=(.05,-.18*side,-.52*side), scale=(1,1,.48)), dark)
        ex=.24*side
        add(s,f'dog_eye_white_{side}', sphere(.18, position=(ex,1.73,.57), scale=(.82,1.12,.52)), white)
        add(s,f'dog_eye_pupil_{side}', sphere(.095, position=(ex*.92,1.72,.69), scale=(.9,1,.52)), '#35261e')
    add(s,'dog_mouth', sphere(.2, position=(0,1.38,.74), scale=(1.18,.5,.58)), '#3b2020')
    add(s,'dog_tongue', sphere(.11, position=(0,1.31,.88), scale=(1.15,.48,.55)), '#f07980')
    add(s,'dog_cap', sphere(.54, position=(0,2.21,0), scale=(1,.2,1)), blue)
    add(s,'dog_cap_brim', box((.70,.08,.38), position=(.08,2.18,.43), rotation=(.06,.04,0)), blue2)
    for side in (-1,1):
        x=.65*side
        add(s,f'dog_upper_arm_{side}', capsule(.19,.64, position=(x,.37,0), rotation=(0,0,-.25*side)), blue)
        add(s,f'dog_forearm_{side}', capsule(.15,.36, position=(x*1.07,-.23,0), rotation=(0,0,-.08*side)), brown)
        add(s,f'dog_hand_{side}', sphere(.19, position=(x*1.10,-.50,0), scale=(.94,.82,.92)), cream)
        lx=.31*side
        add(s,f'dog_leg_{side}', capsule(.22,.60, position=(lx,-.58,0), rotation=(0,0,-.04*side)), brown)
        add(s,f'dog_shoe_{side}', sphere(.27, position=(lx,-1.03,.18), scale=(1.12,.5,1.58)), white)
        add(s,f'dog_shoe_top_{side}', sphere(.23, position=(lx,-.98,.26), scale=(1.02,.42,1.35)), blue)
    for i in range(6):
        t=i/5
        add(s,f'dog_tail_{i}', capsule(.12-t*.025,.30, position=(.3+t*.22,-.48+math.sin(t*math.pi)*.1,-.18), rotation=(0,0,-.85+t*.34)), cream if i>3 else brown)
    add(s,'dog_medallion', sphere(.13, position=(0,.53,.67), scale=(1,.95,.35)), gold)
    return s



def enhance_rat(scene):
    # Facial definition and wardrobe details for the cinematic pass.
    dark='#221a20'; white='#fffdf6'; skin='#ef9a8a'; light='#8e878d'; red='#a61f24'; red2='#6f1117'; sole='#2b2024'
    for side in (-1, 1):
        x=.24*side
        add(scene,f'rat_brow_{side}', box((.25,.055,.045), position=(x,1.87,.72), rotation=(0,0,-.16*side)), dark)
        add(scene,f'rat_eye_glint_{side}', sphere(.03, position=(x*.92-.035*side,1.71,.745), scale=(1,.9,.42)), white)
        add(scene,f'rat_cheek_{side}', sphere(.16, position=(.31*side,1.43,.64), scale=(1.25,.7,.32)), light)
        # Three whiskers per side.
        for j,dy in enumerate((-.05,.02,.09)):
            add(scene,f'rat_whisker_{side}_{j}', box((.48,.012,.012), position=(.47*side,1.49+dy,.81), rotation=(0,-.03*side,.08*side*(j-1))), white)
        # Three tiny fingers on each hand.
        for j in range(3):
            add(scene,f'rat_finger_{side}_{j}', sphere(.055, position=(side*(.73+j*.035),-.53+j*.015,.03), scale=(.65,1.25,.55)), skin)
        # Dark sole under each sneaker.
        add(scene,f'rat_sole_{side}', sphere(.22, position=(.3*side,-1.11,.24), scale=(1.12,.25,1.48)), sole)
    add(scene,'rat_hoodie_pocket', box((.56,.24,.055), position=(0,.17,.66)), red2)
    for side in (-1,1):
        add(scene,f'rat_hoodie_string_{side}', box((.025,.34,.025), position=(.105*side,.64,.66), rotation=(0,0,.04*side)), '#e8d4c5')
        add(scene,f'rat_string_tip_{side}', sphere(.038, position=(.105*side,.46,.66), scale=(.8,1.2,.8)), '#d8a83c')
    return scene

def enhance_dog(scene):
    dark='#3f2418'; white='#ffffff'; cream='#f4e4ca'; blue='#174b78'; blue2='#0d2f50'; sole='#18202b'
    for side in (-1,1):
        x=.24*side
        add(scene,f'dog_brow_{side}', box((.27,.06,.05), position=(x,1.92,.74), rotation=(0,0,-.15*side)), dark)
        add(scene,f'dog_eye_glint_{side}', sphere(.032, position=(x*.92-.033*side,1.77,.755), scale=(1,.9,.42)), white)
        add(scene,f'dog_cheek_{side}', sphere(.18, position=(.33*side,1.48,.65), scale=(1.22,.72,.34)), cream)
        for j in range(3):
            add(scene,f'dog_toe_{side}_{j}', sphere(.065, position=(side*(.66+j*.042),-.50+j*.012,.035), scale=(.8,1.15,.65)), cream)
        add(scene,f'dog_sole_{side}', sphere(.24, position=(.31*side,-1.14,.24), scale=(1.14,.25,1.5)), sole)
    add(scene,'dog_jacket_zipper', box((.035,.64,.035), position=(0,.38,.68)), '#d9dee5')
    add(scene,'dog_jacket_pocket_l', box((.30,.16,.045), position=(-.31,.22,.66), rotation=(0,0,-.08)), blue2)
    add(scene,'dog_jacket_pocket_r', box((.30,.16,.045), position=(.31,.22,.66), rotation=(0,0,.08)), blue2)
    for side in (-1,1):
        add(scene,f'dog_hoodie_string_{side}', box((.025,.34,.025), position=(.105*side,.67,.66), rotation=(0,0,.04*side)), '#d9dee5')
        add(scene,f'dog_string_tip_{side}', sphere(.038, position=(.105*side,.49,.66), scale=(.8,1.2,.8)), '#d7aa42')
    return scene

for name, scene in [('rat-character.glb', enhance_rat(make_rat())), ('dog-character.glb', enhance_dog(make_dog()))]:
    path=OUT/name
    path.write_bytes(scene.export(file_type='glb'))
    loaded=trimesh.load(path, force='scene')
    print(name, 'geometries=', len(loaded.geometry), 'bounds=', np.round(loaded.bounds, 3).tolist(), 'bytes=', path.stat().st_size)
