import React from 'react';
import {Capsule, SoftSphere, Box, Torus} from './Primitives';
import type {Joint3, LegJoint} from '../performance-types';

type Vec3 = [number, number, number];

export const ArmRig: React.FC<{
  side: -1 | 1;
  pose: Joint3;
  shoulder: Vec3;
  upperColor: string;
  lowerColor: string;
  handColor: string;
  handScale?: Vec3;
}> = ({side, pose, shoulder, upperColor, lowerColor, handColor, handScale = [1, 1, 1]}) => (
  <group position={shoulder} rotation={[pose.shoulderX, pose.shoulderY, pose.shoulderZ]}>
    <SoftSphere color={upperColor} radius={0.21} scale={[1.08, 0.95, 1]} roughness={0.62} />
    <Capsule color={upperColor} radius={0.17} length={0.50} position={[0, -0.31, 0]} roughness={0.62} />
    <group position={[0, -0.66, 0]} rotation={[0, 0, pose.elbow]}>
      <SoftSphere color={lowerColor} radius={0.155} scale={[1.02, 0.88, 1]} roughness={0.72} />
      <Capsule color={lowerColor} radius={0.135} length={0.39} position={[0, -0.25, 0]} roughness={0.76} />
      <group position={[0, -0.52, 0.02]} rotation={[0, 0, pose.wrist]}>
        <SoftSphere color={handColor} radius={0.18} scale={handScale} roughness={0.78} />
        {[0, 1, 2, 3].map((finger) => (
          <Capsule
            key={finger}
            color={handColor}
            radius={0.035}
            length={0.15 - finger * 0.012}
            position={[(finger - 1.5) * 0.065, -0.12, 0.07]}
            rotation={[0.05, 0, side * (finger - 1.5) * 0.035]}
            roughness={0.8}
          />
        ))}
      </group>
    </group>
  </group>
);

export const LegRig: React.FC<{
  side: -1 | 1;
  pose: LegJoint;
  hip: Vec3;
  upperColor: string;
  lowerColor: string;
  shoePrimary: string;
  shoeSecondary: string;
  footScale?: Vec3;
}> = ({side, pose, hip, upperColor, lowerColor, shoePrimary, shoeSecondary, footScale = [1.15, 0.48, 1.55]}) => (
  <group position={hip} rotation={[pose.hipX, pose.hipY, pose.hipZ]}>
    <SoftSphere color={upperColor} radius={0.23} scale={[1.05, 0.94, 1]} roughness={0.78} />
    <Capsule color={upperColor} radius={0.19} length={0.50} position={[0, -0.32, 0]} roughness={0.82} />
    <group position={[0, -0.66, 0]} rotation={[pose.knee, 0, 0]}>
      <SoftSphere color={lowerColor} radius={0.18} scale={[1, 0.85, 1]} roughness={0.82} />
      <Capsule color={lowerColor} radius={0.155} length={0.42} position={[0, -0.27, 0]} roughness={0.84} />
      <group position={[0, -0.56, 0.12]} rotation={[pose.ankle, 0, 0]}>
        <SoftSphere color={shoeSecondary} radius={0.245} scale={footScale} roughness={0.45} />
        <SoftSphere color={shoePrimary} radius={0.21} position={[0, 0.055, 0.09]} scale={[1.02, 0.42, 1.35]} roughness={0.46} />
        <Box color={shoeSecondary} size={[0.42, 0.055, 0.92]} position={[0, -0.095, 0.10]} roughness={0.5} />
        <Box color={shoePrimary} size={[0.045, 0.24, 0.52]} position={[side * 0.19, 0.03, 0.14]} rotation={[0, 0, side * 0.12]} roughness={0.48} />
      </group>
    </group>
  </group>
);

export const ChainPendant: React.FC<{metal: string; accent: string; symbol: 'R' | 'paw'}> = ({metal, accent, symbol}) => (
  <group>
    <Torus color={metal} radius={0.31} tube={0.025} position={[0, 0.39, 0.56]} rotation={[Math.PI / 2, 0, 0]} roughness={0.25} metalness={0.88} />
    {symbol === 'R' ? (
      <group position={[0, 0.13, 0.68]}>
        <Box color={accent} size={[0.12, 0.24, 0.055]} roughness={0.24} metalness={0.82} />
        <Box color={accent} size={[0.15, 0.06, 0.055]} position={[0.04, 0.09, 0]} roughness={0.24} metalness={0.82} />
        <Box color={accent} size={[0.13, 0.055, 0.055]} position={[0.045, 0.015, 0]} roughness={0.24} metalness={0.82} />
        <Box color={accent} size={[0.055, 0.14, 0.055]} position={[0.06, -0.06, 0]} rotation={[0, 0, -0.42]} roughness={0.24} metalness={0.82} />
      </group>
    ) : (
      <group position={[0, 0.14, 0.68]}>
        <SoftSphere color={accent} radius={0.11} scale={[1.05, 0.85, 0.42]} roughness={0.24} metalness={0.82} />
        {[-0.11, -0.038, 0.038, 0.11].map((x, i) => (
          <SoftSphere key={x} color={accent} radius={0.042} position={[x, 0.10 + Math.abs(i - 1.5) * 0.02, 0.01]} scale={[1, 1, 0.46]} roughness={0.24} metalness={0.82} />
        ))}
      </group>
    )}
  </group>
);
