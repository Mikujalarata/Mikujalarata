import React from 'react';
import {Box, Capsule, SoftSphere, Torus} from './Primitives';
import {ArmRig, ChainPendant, LegRig} from './RigParts';
import type {PerformancePose} from '../performance-types';

const C = {
  fur: '#4d4b52', furLight: '#75727a', furDark: '#302e33', skin: '#ef9b8c', skinDark: '#cf786f',
  hoodie: '#b01f26', hoodieDark: '#711117', hoodieLight: '#cf3439', white: '#fff8ee', black: '#121015',
  gold: '#d9aa40', sole: '#f3ece5', trouser: '#242329', eye: '#6c461f',
};

const RatTail: React.FC<{yaw: number; curl: number}> = ({yaw, curl}) => (
  <group position={[0.05, -0.34, -0.25]} rotation={[0.25, -0.68, yaw]}>
    {Array.from({length: 13}).map((_, i) => {
      const t = i / 12;
      return <Capsule key={i} color={C.skin} radius={0.052 - t * 0.027} length={0.20}
        position={[0.15 + t * 0.19, Math.sin(t * Math.PI) * 0.055 + t * 0.02, -t * 0.018]}
        rotation={[0, 0, -0.98 + t * (0.20 + curl)]} roughness={0.78} />;
    })}
  </group>
);

const RatEye: React.FC<{x: number; pose: PerformancePose['face']}> = ({x, pose}) => (
  <group position={[x, 0.13, 0.545]} scale={[1, Math.max(0.08, 1 - pose.blink * 0.93), 1]}>
    <SoftSphere color={C.white} radius={0.165} scale={[0.82, 1.10, 0.50]} roughness={0.28} />
    <SoftSphere color={C.eye} radius={0.09} position={[pose.eyeX * 0.10, pose.eyeY * 0.08, 0.115]} scale={[0.90, 1, 0.50]} roughness={0.24} />
    <SoftSphere color={C.black} radius={0.052} position={[pose.eyeX * 0.10, pose.eyeY * 0.08, 0.16]} scale={[0.9, 1, 0.48]} roughness={0.18} />
    <SoftSphere color={'#ffffff'} radius={0.024} position={[-0.03, 0.045, 0.195]} roughness={0.12} />
  </group>
);

const RatHead: React.FC<{pose: PerformancePose}> = ({pose}) => {
  const f = pose.face;
  return (
    <group rotation={[pose.neck.pitch, pose.neck.yaw, pose.neck.roll]}>
      <SoftSphere color={C.fur} radius={0.66} scale={[1.02, 0.98, 0.94]} roughness={0.92} />
      <SoftSphere color={C.furLight} radius={0.39} position={[0, -0.10, 0.52]} scale={[1.30, 0.75, 0.58]} roughness={0.92} />
      <SoftSphere color={C.skin} radius={0.145} position={[0, -0.03, 0.86]} scale={[1.05, 0.82, 0.78]} roughness={0.48} />
      <SoftSphere color={C.skinDark} radius={0.065} position={[0, -0.02, 0.92]} scale={[1.0, 0.62, 0.52]} roughness={0.42} />

      <group position={[-0.52, 0.34, 0.0]} rotation={[0, -0.10, 0.10 + pose.ears.left]}>
        <SoftSphere color={C.furDark} radius={0.35} scale={[0.83, 1.08, 0.34]} roughness={0.94} />
        <SoftSphere color={C.skin} radius={0.275} position={[0, 0, 0.055]} scale={[0.80, 1.06, 0.24]} roughness={0.74} />
        <SoftSphere color={'#f4b1a4'} radius={0.17} position={[0.01, 0, 0.087]} scale={[0.78, 1.06, 0.18]} roughness={0.78} />
      </group>
      <group position={[0.52, 0.34, 0.0]} rotation={[0, 0.10, -0.10 + pose.ears.right]}>
        <SoftSphere color={C.furDark} radius={0.35} scale={[0.83, 1.08, 0.34]} roughness={0.94} />
        <SoftSphere color={C.skin} radius={0.275} position={[0, 0, 0.055]} scale={[0.80, 1.06, 0.24]} roughness={0.74} />
        <SoftSphere color={'#f4b1a4'} radius={0.17} position={[-0.01, 0, 0.087]} scale={[0.78, 1.06, 0.18]} roughness={0.78} />
      </group>

      <RatEye x={-0.235} pose={f} /><RatEye x={0.235} pose={f} />
      <Box color={C.furDark} size={[0.25, 0.055, 0.045]} position={[-0.24, 0.36 + f.brow * 0.025, 0.61]} rotation={[0, 0, 0.11 + f.brow * 0.15]} roughness={0.88} />
      <Box color={C.furDark} size={[0.25, 0.055, 0.045]} position={[0.24, 0.36 + f.brow * 0.025, 0.61]} rotation={[0, 0, -0.11 - f.brow * 0.15]} roughness={0.88} />

      {[-1, 1].flatMap((side) => [-0.10, -0.035, 0.035, 0.10].map((dy, i) => (
        <Box key={`${side}-${i}`} color={'#f7f2ec'} size={[0.48, 0.011, 0.011]} position={[0.47 * side, -0.07 + dy, 0.78]}
          rotation={[0, 0, side * (dy * 0.42 + 0.02)]} roughness={0.65} />
      )))}

      <group position={[0, -0.20, 0.69]} rotation={[f.jawOpen * 0.72, 0, 0]}>
        <SoftSphere color={'#4d2027'} radius={0.19} scale={[1.15 + f.smile * 0.08, 0.46, 0.56]} roughness={0.72} />
        <Box color={C.white} size={[0.115, 0.15, 0.05]} position={[-0.07, 0.055, 0.16]} roughness={0.44} />
        <Box color={C.white} size={[0.115, 0.15, 0.05]} position={[0.07, 0.055, 0.16]} roughness={0.44} />
        <SoftSphere color={'#f07b82'} radius={0.10} position={[0, -0.06, 0.14]} scale={[1.20, 0.42, 0.52]} roughness={0.54} />
      </group>
      <Torus color={C.furDark} radius={0.19 + f.smile * 0.025} tube={0.018} position={[0, -0.12, 0.81]} rotation={[Math.PI / 2, 0, Math.PI]} scale={[1.15, 0.64, 1]} roughness={0.7} metalness={0} />

      <group position={[0, 0.58, -0.04]}>
        <SoftSphere color={C.hoodie} radius={0.54} scale={[1.0, 0.20, 1.0]} roughness={0.56} />
        <Box color={C.hoodieDark} size={[0.72, 0.09, 0.42]} position={[0.10, -0.02, 0.43]} rotation={[0.07, -0.04, 0]} roughness={0.55} />
      </group>

      {[-0.22, -0.11, 0, 0.11, 0.22].map((x, i) => (
        <Capsule key={x} color={i % 2 ? C.furDark : C.furLight} radius={0.025} length={0.18 + Math.abs(x) * 0.12}
          position={[x, 0.55 + Math.abs(x) * 0.18, -0.02]} rotation={[0, 0, x * -0.9]} roughness={0.96} />
      ))}
    </group>
  );
};

export const RiggedRat3D: React.FC<{pose: PerformancePose}> = ({pose}) => (
  <group position={[pose.root.x, -0.08 + pose.root.y, pose.root.z]} rotation={[0, pose.root.yaw, pose.root.roll]} scale={[1, pose.root.scaleY, 1]}>
    <RatTail yaw={pose.tail.yaw} curl={pose.tail.curl} />
    <group rotation={[0, pose.spine.pelvisYaw, pose.spine.pelvisRoll]}>
      <SoftSphere color={C.trouser} radius={0.50} position={[0, -0.12, 0]} scale={[1.12, 0.70, 0.86]} roughness={0.82} />
      <Box color={C.trouser} size={[0.84, 0.36, 0.50]} position={[0, -0.16, 0.02]} roughness={0.84} />
      <LegRig side={-1} pose={pose.legs.left} hip={[-0.29, -0.20, 0]} upperColor={C.trouser} lowerColor={C.fur} shoePrimary={C.hoodie} shoeSecondary={C.sole} />
      <LegRig side={1} pose={pose.legs.right} hip={[0.29, -0.20, 0]} upperColor={C.trouser} lowerColor={C.fur} shoePrimary={C.hoodie} shoeSecondary={C.sole} />

      <group position={[0, 0.46, 0]} rotation={[pose.spine.chestPitch, pose.spine.chestYaw, pose.spine.chestRoll]}>
        <Capsule color={C.hoodieDark} radius={0.57} length={0.58} scale={[1.03, 1, 0.82]} roughness={0.60} />
        <SoftSphere color={C.hoodie} radius={0.61} position={[0, 0.08, 0.03]} scale={[1.03, 1.08, 0.83]} roughness={0.58} />
        <SoftSphere color={C.hoodieLight} radius={0.06} position={[-0.52, 0.10, 0.18]} roughness={0.42} />
        <SoftSphere color={C.hoodieLight} radius={0.06} position={[0.52, 0.10, 0.18]} roughness={0.42} />
        <Box color={C.hoodieDark} size={[0.58, 0.23, 0.055]} position={[0, -0.18, 0.67]} roughness={0.62} />
        <Box color={'#e7d7cc'} size={[0.025, 0.34, 0.025]} position={[-0.1, 0.31, 0.66]} roughness={0.72} />
        <Box color={'#e7d7cc'} size={[0.025, 0.34, 0.025]} position={[0.1, 0.31, 0.66]} roughness={0.72} />
        <ChainPendant metal={C.gold} accent={C.gold} symbol="R" />

        <ArmRig side={-1} pose={pose.arms.left} shoulder={[-0.60, 0.34, 0]} upperColor={C.hoodie} lowerColor={C.fur} handColor={C.skin} handScale={[0.84, 1.0, 0.82]} />
        <ArmRig side={1} pose={pose.arms.right} shoulder={[0.60, 0.34, 0]} upperColor={C.hoodie} lowerColor={C.fur} handColor={C.skin} handScale={[0.84, 1.0, 0.82]} />

        <group position={[0, 0.87, 0.02]}><RatHead pose={pose} /></group>
      </group>
    </group>
  </group>
);
