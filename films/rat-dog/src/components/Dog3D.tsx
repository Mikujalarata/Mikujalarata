import React from 'react';
import {Capsule, SoftSphere, Box, Torus} from './Primitives';

const brown = '#9a551f';
const brownDark = '#5c2c16';
const cream = '#f4e4ca';
const white = '#fffaf0';
const black = '#151318';
const jacket = '#174b78';
const jacketDark = '#0d2f50';
const gold = '#d7aa42';

type Pose = {
  jump: number; sway: number; armSwing: number; legSwing: number;
  bodyTilt: number; headBob: number; headTurn: number; shoulderBounce: number;
  tailSwing: number; mouthOpen: number; blink: number;
  spin?: number; crouch?: number; reach?: number; expression?: number; finale?: number;
};

const DogEye: React.FC<{x: number; blink: number}> = ({x, blink}) => (
  <group position={[x, 0.1, 0.55]} scale={[1, Math.max(0.12, 1 - blink * 0.88), 1]}>
    <SoftSphere color={white} radius={0.18} scale={[0.82, 1.12, 0.52]} />
    <SoftSphere color={'#35261e'} radius={0.095} position={[x > 0 ? -0.02 : 0.02, -0.01, 0.115]} scale={[0.9, 1.0, 0.52]} roughness={0.28} />
    <SoftSphere color={black} radius={0.052} position={[x > 0 ? -0.02 : 0.02, -0.01, 0.165]} roughness={0.2} />
    <SoftSphere color={'#ffffff'} radius={0.024} position={[x > 0 ? -0.045 : 0.045, 0.04, 0.20]} />
  </group>
);

const Tail: React.FC<{swing: number}> = ({swing}) => (
  <group position={[0.28, -0.45, -0.15]} rotation={[0.15, -0.72, swing]}>
    {Array.from({length: 6}).map((_, i) => {
      const t = i / 5;
      return (
        <Capsule key={i} color={i > 3 ? cream : brown} radius={0.12 - t * 0.025} length={0.3}
          position={[0.22 + t * 0.23, 0.03 + Math.sin(t * Math.PI) * 0.11, 0]}
          rotation={[0, 0, -0.85 + t * 0.34]} roughness={0.9} />
      );
    })}
  </group>
);

export const Dog3D: React.FC<{pose: Pose}> = ({pose}) => (
  <group
    position={[1.35 + pose.sway, -0.05 + pose.jump - (pose.crouch ?? 0), 0]}
    rotation={[0, -pose.headTurn * 0.12 + (pose.spin ?? 0), -pose.bodyTilt]}
    scale={[1.06, 1.06, 1.06]}
  >
    <Tail swing={pose.tailSwing} />

    <group position={[0, 0.34, 0]}>
      <Capsule color={brown} radius={0.58} length={0.68} scale={[1.04, 1.0, 0.86]} roughness={0.9} />
      <SoftSphere color={cream} radius={0.38} position={[0, 0.03, 0.52]} scale={[0.92, 1.15, 0.36]} roughness={0.9} />
      <SoftSphere color={jacket} radius={0.62} position={[0, 0.12, 0.02]} scale={[1.04, 1.05, 0.86]} roughness={0.55} />
      <Box color={jacketDark} size={[1.05, 0.08, 0.1]} position={[0, 0.48, 0.48]} />
      <Box color={'#d8c9b3'} size={[0.46, 0.72, 0.06]} position={[0, 0.04, 0.62]} roughness={0.8} />
      <Torus color={gold} radius={0.31} tube={0.025} position={[0, 0.43, 0.54]} rotation={[Math.PI / 2, 0, 0]} />
      <SoftSphere color={gold} radius={0.13} position={[0, 0.18, 0.67]} scale={[1.0, 0.95, 0.35]} roughness={0.3} metalness={0.78} />
      <Box color={'#d9dee5'} size={[0.035, 0.64, 0.035]} position={[0, 0.04, 0.68]} />
      <Box color={jacketDark} size={[0.30, 0.16, 0.045]} position={[-0.31, -0.12, 0.66]} rotation={[0, 0, -0.08]} />
      <Box color={jacketDark} size={[0.30, 0.16, 0.045]} position={[0.31, -0.12, 0.66]} rotation={[0, 0, 0.08]} />
    </group>

    <group position={[0, 1.28 + pose.headBob, 0.02]} rotation={[0, -pose.headTurn, pose.bodyTilt * 0.3]}>
      <SoftSphere color={brown} radius={0.69} scale={[1.03, 0.96, 0.92]} roughness={0.9} />
      <SoftSphere color={cream} radius={0.4} position={[0, -0.12, 0.6]} scale={[1.25, 0.82, 0.82]} roughness={0.9} />
      <SoftSphere color={black} radius={0.14} position={[0, -0.03, 0.88]} scale={[1.12, 0.8, 0.72]} roughness={0.38} />
      <Box color={cream} size={[0.12, 0.9, 0.05]} position={[0, 0.18, 0.62]} roughness={0.88} />

      <group position={[-0.54, 0.23, -0.02]} rotation={[0.05, 0.18, 0.52]}>
        <Capsule color={brownDark} radius={0.2} length={0.58} scale={[1.0, 1.0, 0.48]} roughness={0.92} />
      </group>
      <group position={[0.54, 0.23, -0.02]} rotation={[0.05, -0.18, -0.52]}>
        <Capsule color={brownDark} radius={0.2} length={0.58} scale={[1.0, 1.0, 0.48]} roughness={0.92} />
      </group>

      <DogEye x={-0.24} blink={pose.blink} />
      <DogEye x={0.24} blink={pose.blink} />
      <Box color={'#4a2c20'} size={[0.27, 0.055, 0.05]} position={[-0.24, 0.36, 0.62]} rotation={[0, 0, 0.12 + (pose.expression ?? 0) * 0.08]} />
      <Box color={'#4a2c20'} size={[0.27, 0.055, 0.05]} position={[0.24, 0.36, 0.62]} rotation={[0, 0, -0.12 - (pose.expression ?? 0) * 0.08]} />

      <group position={[0, -0.25, 0.67]} rotation={[pose.mouthOpen * 0.8, 0, 0]}>
        <SoftSphere color={'#3b2020'} radius={0.2} scale={[1.18, 0.5, 0.58]} roughness={0.8} />
        <SoftSphere color={'#f07980'} radius={0.11} position={[0, -0.07, 0.14]} scale={[1.15, 0.48, 0.55]} />
        <Box color={white} size={[0.14, 0.08, 0.045]} position={[-0.1, 0.06, 0.16]} />
        <Box color={white} size={[0.14, 0.08, 0.045]} position={[0.1, 0.06, 0.16]} />
      </group>

      <group position={[0, 0.58, -0.02]}>
        <SoftSphere color={jacket} radius={0.54} scale={[1.0, 0.2, 1.0]} roughness={0.5} />
        <Box color={jacketDark} size={[0.7, 0.08, 0.38]} position={[0.08, -0.01, 0.42]} rotation={[0.06, 0.04, 0]} />
      </group>
    </group>

    <group position={[-0.65, 0.68 + pose.shoulderBounce, 0]} rotation={[0, 0, 0.36 - pose.armSwing - (pose.reach ?? 0) - (pose.finale ?? 0) * 0.72]}>
      <Capsule color={jacket} radius={0.19} length={0.64} position={[0, -0.31, 0]} roughness={0.55} />
      <group position={[0, -0.74, 0]} rotation={[0, 0, -0.18 + pose.armSwing * 0.22]}>
        <Capsule color={brown} radius={0.15} length={0.36} position={[0, -0.17, 0]} roughness={0.9} />
        <SoftSphere color={cream} radius={0.19} position={[0, -0.44, 0]} scale={[0.94, 0.82, 0.92]} />
      </group>
    </group>
    <group position={[0.65, 0.68 + pose.shoulderBounce, 0]} rotation={[0, 0, -0.36 + pose.armSwing + (pose.reach ?? 0) + (pose.finale ?? 0) * 0.72]}>
      <Capsule color={jacket} radius={0.19} length={0.64} position={[0, -0.31, 0]} roughness={0.55} />
      <group position={[0, -0.74, 0]} rotation={[0, 0, 0.18 - pose.armSwing * 0.22]}>
        <Capsule color={brown} radius={0.15} length={0.36} position={[0, -0.17, 0]} roughness={0.9} />
        <SoftSphere color={cream} radius={0.19} position={[0, -0.44, 0]} scale={[0.94, 0.82, 0.92]} />
      </group>
    </group>

    <group position={[-0.31, -0.47, 0]} rotation={[-pose.legSwing, 0, 0.055]}>
      <Capsule color={brown} radius={0.22} length={0.6} position={[0, -0.31, 0]} roughness={0.9} />
      <group position={[0, -0.75, 0.18]}>
        <SoftSphere color={white} radius={0.27} scale={[1.12, 0.5, 1.58]} />
        <SoftSphere color={jacket} radius={0.23} position={[0, 0.05, 0.08]} scale={[1.02, 0.42, 1.35]} roughness={0.52} />
      </group>
    </group>
    <group position={[0.31, -0.47, 0]} rotation={[pose.legSwing, 0, -0.055]}>
      <Capsule color={brown} radius={0.22} length={0.6} position={[0, -0.31, 0]} roughness={0.9} />
      <group position={[0, -0.75, 0.18]}>
        <SoftSphere color={white} radius={0.27} scale={[1.12, 0.5, 1.58]} />
        <SoftSphere color={jacket} radius={0.23} position={[0, 0.05, 0.08]} scale={[1.02, 0.42, 1.35]} roughness={0.52} />
      </group>
    </group>
  </group>
);
