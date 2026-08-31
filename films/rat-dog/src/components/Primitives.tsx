import React from 'react';

type Vec3 = [number, number, number];

type MeshProps = {
  position?: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
};

export const SoftSphere: React.FC<MeshProps & {radius?: number}> = ({
  position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1],
  color, radius = 1, roughness = 0.72, metalness = 0,
  emissive = '#000000', emissiveIntensity = 0,
}) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
    <sphereGeometry args={[radius, 48, 32]} />
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      clearcoat={0.12}
      clearcoatRoughness={0.72}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
    />
  </mesh>
);

export const Capsule: React.FC<MeshProps & {radius?: number; length?: number}> = ({
  position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1],
  color, radius = 0.25, length = 0.8, roughness = 0.72, metalness = 0,
}) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
    <capsuleGeometry args={[radius, length, 12, 28]} />
    <meshPhysicalMaterial color={color} roughness={roughness} metalness={metalness} clearcoat={0.1} />
  </mesh>
);

export const Box: React.FC<MeshProps & {size?: Vec3}> = ({
  position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1],
  color, size = [1, 1, 1], roughness = 0.7, metalness = 0,
}) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshPhysicalMaterial color={color} roughness={roughness} metalness={metalness} clearcoat={0.08} />
  </mesh>
);

export const Torus: React.FC<MeshProps & {radius?: number; tube?: number}> = ({
  position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1],
  color, radius = 0.5, tube = 0.05, roughness = 0.45, metalness = 0.65,
}) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow>
    <torusGeometry args={[radius, tube, 20, 64]} />
    <meshPhysicalMaterial color={color} roughness={roughness} metalness={metalness} clearcoat={0.25} />
  </mesh>
);

export const Cone: React.FC<MeshProps & {radius?: number; height?: number; opacity?: number}> = ({
  position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color,
  radius = 0.5, height = 1, roughness = 0.6, metalness = 0, opacity = 1,
  emissive = '#000000', emissiveIntensity = 0,
}) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow={opacity >= 0.95}>
    <coneGeometry args={[radius, height, 48, 1, true]} />
    <meshPhysicalMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      transparent={opacity < 1}
      opacity={opacity}
      depthWrite={opacity >= 0.95}
      side={2}
    />
  </mesh>
);
