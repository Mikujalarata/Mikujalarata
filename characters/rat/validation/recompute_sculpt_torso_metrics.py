import json
import struct
import sys
from pathlib import Path

import numpy as np


DT = {5121: np.uint8, 5123: np.uint16, 5125: np.uint32, 5126: np.float32}
N = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}
TRUNK_BONES = {'hips', 'spine', 'chest', 'neck'}
MIN_TRUNK_WEIGHT = 0.50
SHOULDER_HEIGHT = (2.16, 2.42)
WAIST_HEIGHT = (1.62, 1.82)


def load_glb(path: Path):
    raw = path.read_bytes()
    magic, version, total_length = struct.unpack_from('<III', raw, 0)
    if magic != 0x46546C67 or version != 2 or total_length != len(raw):
        raise ValueError('invalid GLB 2.0 header')

    offset = 12
    gltf = None
    binary = None
    while offset < total_length:
        chunk_length, chunk_type = struct.unpack_from('<II', raw, offset)
        offset += 8
        chunk = raw[offset:offset + chunk_length]
        offset += chunk_length
        if chunk_type == 0x4E4F534A:
            gltf = json.loads(chunk.rstrip(b'\x00 ').decode('utf-8'))
        elif chunk_type == 0x004E4942:
            binary = chunk
    if gltf is None or binary is None:
        raise ValueError('GLB is missing JSON or BIN chunk')
    return gltf, binary


def read_accessor(gltf, binary, accessor_index):
    accessor = gltf['accessors'][accessor_index]
    view = gltf['bufferViews'][accessor['bufferView']]
    dtype = DT[accessor['componentType']]
    components = N[accessor['type']]
    offset = view.get('byteOffset', 0) + accessor.get('byteOffset', 0)
    count = accessor['count']
    item_size = np.dtype(dtype).itemsize * components
    stride = view.get('byteStride', item_size)
    if stride == item_size:
        return np.frombuffer(
            binary,
            dtype=dtype,
            count=count * components,
            offset=offset,
        ).reshape(count, components).copy()
    return np.ndarray(
        (count, components),
        dtype=dtype,
        buffer=binary,
        offset=offset,
        strides=(stride, np.dtype(dtype).itemsize),
    ).copy()


def body_arrays(gltf, binary):
    nodes = gltf['nodes']
    node = next((n for n in nodes if n.get('name') == 'Rat_Body_Skinned'), None)
    if node is None:
        raise ValueError('Rat_Body_Skinned node not found')
    primitive = gltf['meshes'][node['mesh']]['primitives'][0]
    attrs = primitive['attributes']
    positions = read_accessor(gltf, binary, attrs['POSITION']).astype(float)
    joints = read_accessor(gltf, binary, attrs['JOINTS_0']).astype(int)
    weights = read_accessor(gltf, binary, attrs['WEIGHTS_0']).astype(float)

    skin = gltf['skins'][node['skin']]
    node_names = [n.get('name', str(i)) for i, n in enumerate(nodes)]
    joint_names = [node_names[i] for i in skin['joints']]
    joint_index = {name: i for i, name in enumerate(joint_names)}
    missing = sorted(TRUNK_BONES - joint_index.keys())
    if missing:
        raise ValueError(f'missing trunk bones: {missing}')
    trunk_indices = [joint_index[name] for name in sorted(TRUNK_BONES)]
    return positions, joints, weights, trunk_indices


def trunk_width(positions, joints, weights, trunk_indices, height_range):
    trunk_weight = (np.isin(joints, trunk_indices) * weights).sum(axis=1)
    low, high = height_range
    mask = (
        (positions[:, 1] >= low)
        & (positions[:, 1] <= high)
        & (trunk_weight >= MIN_TRUNK_WEIGHT)
    )
    selected = positions[mask]
    if len(selected) < 100:
        raise ValueError(
            f'too few torso vertices for {height_range}: {len(selected)}; '
            'skin semantics may be invalid'
        )
    width = float(selected[:, 0].max() - selected[:, 0].min())
    return round(width, 5), int(mask.sum())


def main():
    if len(sys.argv) != 3:
        raise SystemExit('usage: recompute_sculpt_torso_metrics.py MANIFEST GLB')
    manifest_path = Path(sys.argv[1])
    glb_path = Path(sys.argv[2])

    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
    gltf, binary = load_glb(glb_path)
    positions, joints, weights, trunk_indices = body_arrays(gltf, binary)

    shoulder_width, shoulder_count = trunk_width(
        positions, joints, weights, trunk_indices, SHOULDER_HEIGHT
    )
    waist_width, waist_count = trunk_width(
        positions, joints, weights, trunk_indices, WAIST_HEIGHT
    )

    metrics = manifest.setdefault('sculpt_metrics', {})
    metrics['shoulder_width'] = shoulder_width
    metrics['waist_width'] = waist_width
    metrics['shoulder_vertex_count'] = shoulder_count
    metrics['waist_vertex_count'] = waist_count
    metrics['torso_metric_source'] = 'repaired-glb-trunk-weighted'
    metrics['torso_metric_min_trunk_weight'] = MIN_TRUNK_WEIGHT

    manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    ratio = shoulder_width / waist_width if waist_width else 0.0
    print(json.dumps({
        'shoulder_width': shoulder_width,
        'waist_width': waist_width,
        'shoulder_to_waist_ratio': round(ratio, 5),
        'shoulder_vertex_count': shoulder_count,
        'waist_vertex_count': waist_count,
        'min_trunk_weight': MIN_TRUNK_WEIGHT,
    }, indent=2))


if __name__ == '__main__':
    main()
