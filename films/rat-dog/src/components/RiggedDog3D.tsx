import React from 'react';
import {Box, Capsule, SoftSphere, Torus} from './Primitives';
import {ArmRig, ChainPendant, LegRig} from './RigParts';
import type {PerformancePose} from '../performance-types';

const C = {
  brown: '#9c5926', brownDark: '#582d18', brownLight: '#bd7842', cream: '#f0dfc5', white: '#fffaf1', black: '#151318',
  jacket: '#174f80', jacketDark: '#0d3152', jacketLight: '#2b6fa3', shorts: '#173a5e', gold: '#d6aa44', sole: '#f2eee6', eye: '#704920',
};

const DogTail: React.FC<{yaw: number; curl: number}> = ({yaw, curl}) => (
  <group position={[0.25, -0.32, -0.22]} rotation={[0.18, -0.74, yaw]}>
    {Array.from({length: 8}).map((_, i) => {
      const t = i / 7;
      return <Capsule key={i} color={t > 0.68 ? C.cream : C.brown} radius={0.115 - t * 0.045} length={0.25}
        position={[0.19 + t * 0.22, 0.035 + Math.sin(t * Math.PI) * (0.10 + curl * 0.04), 0]}
        rotation={[0, 0, -0.84 + t * (0.34 + curl * 0.22)]} roughness={0.92} />;
    })}
  </group>
);

const DogEye: React.FC<{x: number; pose: PerformancePose['face']}> = ({x, pose}) => (
  <group position={[x, 0.11, 0.56]} scale={[1, Math.max(0.09, 1 - pose.blink * 0.92), 1]}>
    <SoftSphere color={C.white} radius={0.175} scale={[0.83, 1.12, 0.51]} roughness={0.28} />
    <SoftSphere color={C.eye} radius={0.097} position={[pose.eyeX * 0.10, pose.eyeY * 0.08, 0.116]} scale={[0.91, 1, 0.50]} roughness={0.24} />
    <SoftSphere color={C.black} radius={0.054} position={[pose.eyeX * 0.10, pose.eyeY * 0.08, 0.166]} roughness={0.18} />
    <SoftSphere color={'#ffffff'} radius={0.024} position={[-0.03, 0.045, 0.20]} roughness={0.12} />
  </group>
);

const DogHead: React.FC<{pose: PerformancePose}> = ({pose}) => {
  const f = pose.face;
  return (
    <group rotation={[pose.neck.pitch, pose.neck.yaw, pose.neck.roll]}>
      <SoftSphere color={C.brown} radius={0.69} scale={[1.03, 0.96, 0.92]} roughness={0.92} />
      <SoftSphere color={C.cream} radius={0.41} position={[0, -0.13, 0.60]} scale={[1.27, 0.83, 0.84]} roughness={0.91} />
      <SoftSphere color={C.black} radius={0.145} position={[0, -0.035, 0.88]} scale={[1.12, 0.80, 0.72]} roughness={0.34} />
      <Box color={C.cream} size={[0.13, 0.92, 0.05]} position={[0, 0.18, 0.62]} roughness={0.90} />

      <group position={[-0.55, 0.24, -0.04]} rotation={[0.05, 0.18, 0.52 + pose.ears.left]}>
        <Capsule color={C.brownDark} radius={0.205} length={0.59} scale={[1, 1, 0.48]} roughness={0.94} />
        <Capsule color={C.brownLight} radius={0.135} length={0.43} position={[0.02, -0.03, 0.06]} scale={[1, 1, 0.38]} roughness={0.90} />
      </group>
      <group position={[0.55, 0.24, -0.04]} rotation={[0.05, -0.18, -0.52 + pose.ears.right]}>
        <Capsule color={C.brownDark} radius={0.205} length={0.59} scale={[1, 1, 0.48]} roughness={0.94} />
        <Capsule color={C.brownLight} radius={0.135} length={0.43} position={[-0.02, -0.03, 0.06]} scale={[1, 1, 0.38]} roughness={0.90} />
      </group>

      <DogEye x={-0.235} pose={f} /><DogEye x={0.235} pose={f} />
      <Box color={C.brownDark} size={[0.27, 0.055, 0.05]} position={[-0.24, 0.36 + f.brow * 0.026, 0.62]} rotation={[0, 0, 0.11 + f.brow * 0.14]} roughness={0.88} />
      <Box color={C.brownDark} size={[0.27, 0.055, 0.05]} position={[0.24, 0.36 + f.brow * 0.026, 0.62]} rotation={[0, 0, -0.11 - f.brow * 0.14]} roughness={0.88} />

      <group position={[0, -0.25, 0.68]} rotation={[f.jawOpen * 0.66, 0, 0]}>
        <SoftSphere color={'#392022'} radius={0.205} scale={[1.18 + f.smile * 0.08, 0.50, 0.58]} roughness={0.75} />
        <SoftSphere color={'#f07d83'} radius={0.112} position={[0, -0.075, 0.145]} scale={[1.16, 0.48, 0.54]} roughness={0.54} />
        <Box color={C.white} size={[0.14, 0.08, 0.045]} position={[-0.10, 0.06, 0.16]} roughness={0.40} />
        <Box color={C.white} size={[0.14, 0.08, 0.045]} position={[0.10, 0.06, 0.16]} roughness={0.40} />
      </group>
      <Torus color={C.brownDark} radius={0.205 + f.smile * 0.022} tube={0.018} position={[0, -0.145, 0.805]} rotation={[Math.PI / 2, 0, Math.PI]} scale={[1.18, 0.65, 1]} roughness={0.75} metalness={0} />

      <group position={[0, 0.59, -0.03]}>
        <SoftSphere color={C.jacket} radius={0.54} scale={[1, 0.20, 1]} roughness={0.52} />
        <Box color={C.jacketDark} size={[0.70, 0.08, 0.38]} position={[0.08, -0.01, 0.42]} rotation={[0.06, 0.04, 0]} roughness={0.50} />
      </group>

      <Capsule color={C.brownLight} radius={0.05} length={0.22} position={[0.02, 0.59, -0.03]} rotation={[0, 0, -0.08]} roughness={0.96} />
      <Capsule color={C.brownLight} radius={0.042} length={0.16} position={[-0.13, 0.55, 0.02]} rotation={[0, 0, 0.25]} roughness={0.96} />
      <Capsule color={C.brownLight} radius={0.042} length={0.16} position={[0.15, 0.55, 0.02]} rotation={[0, 0, -0.24]} roughness={0.96} />
    </group>
  );
};

export const RiggedDog3D: React.FC<{pose: PerformancePose}> = ({pose}) => (
  <group position={[pose.root.x, -0.03 + pose.root.y, pose.root.z]} rotation={[0, pose.root.yaw, pose.root.roll]} scale={[1.05, 1.05 * pose.root.scaleY, 1.05]}>
    <DogTail yaw={pose.tail.yaw} curl={pose.tail.curl} />
    <group rotation={[0, pose.spine.pelvisYaw, pose.spine.pelvisRoll]}>
      <SoftSphere color={C.shorts} radius={0.51} position={[0, -0.12, 0]} scale={[1.15, 0.70, 0.88]} roughness={0.76} />
      <Box color={C.shorts} size={[0.88, 0.38, 0.52]} position={[0, -0.16, 0.02]} roughness={0.78} />
      <Box color={C.jacketDark} size={[0.24, 0.19, 0.055]} position={[-0.36, -0.14, 0.30]} rotation={[0, 0, -0.07]} roughness={0.70} />
      <Box color={C.jacketDark} size={[0.24, 0.19, 0.055]} position={[0.36, -0.14, 0.30]} rotation={[0, 0, 0.07]} roughness={0.70} />
      <LegRig side={-1} pose={pose.legs.left} hip={[-0.30, -0.20, 0]} upperColor={C.shorts} lowerColor={C.brown} shoePrimary={C.jacket} shoeSecondary={C.sole} />
      <LegRig side={1} pose={pose.legs.right} hip={[0.30, -0.20, 0]} upperColor={C.shorts} lowerColor={C.brown} shoePrimary={C.jacket} shoeSecondary={C.sole} />

      <group position={[0, 0.47, 0]} rotation={[pose.spine.chestPitch, pose.spine.chestYaw, pose.spine.chestRoll]}>
        <Capsule color={C.brown} radius={0.58} length={0.62} scale={[1.04, 1, 0.86]} roughness={0.92} />
        <SoftSphere color={C.cream} radius={0.38} position={[0, 0.03, 0.52]} scale={[0.93, 1.15, 0.36]} roughness={0.91} />
        <SoftSphere color={C.jacket} radius={0.62} position={[0, 0.12, 0.02]} scale={[1.04, 1.05, 0.86]} roughness={0.54} />
        <Box color={C.jacketDark} size={[1.05, 0.08, 0.10]} position={[0, 0.48, 0.48]} roughness={0.50} />
        <Box color={'#d8c9b3'} size={[0.46, 0.72, 0.06]} position={[0, 0.04, 0.62]} roughness={0.82} />
        <Box color={'#d9dee5'} size={[0.035, 0.64, 0.035]} position={[0, 0.04, 0.68]} roughness={0.42} />
        <ChainPendant metal={C.gold} accent={C.gold} symbol="paw" />

        <ArmRig side={-1} pose={pose.arms.left} shoulder={[-0.63, 0.35, 0]} upperColor={C.jacket} lowerColor={C.brown} handColor={C.cream} handScale={[0.95, 0.84, 0.93]} />
        <ArmRig side={1} pose={pose.arms.right} shoulder={[0.63, 0.35, 0]} upperColor={C.jacket} lowerColor={C.brown} handColor={C.cream} handScale={[0.95, 0.84, 0.93]} />

        <group position={[0, 0.90, 0.02]}><DogHead pose={pose} /></group>
      </group>
    </group>
  </group>
);
