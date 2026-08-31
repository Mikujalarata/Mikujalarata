import React from 'react';
import {Capsule, SoftSphere, Box, Torus} from './Primitives';

const fur = '#4b4a50';
const furLight = '#77727a';
const skin = '#ef9a8a';
const hoodie = '#a61f24';
const hoodieDark = '#6f1117';
const white = '#fff8ee';
const black = '#120f12';
const gold = '#d8a83c';

type Pose = {
  jump: number; sway: number; armSwing: number; legSwing: number;
  bodyTilt: number; headBob: number; headTurn: number; shoulderBounce: number;
  tailSwing: number; mouthOpen: number; blink: number;
  spin?: number; crouch?: number; reach?: number; expression?: number; finale?: number;
};

const Tail: React.FC<{swing: number}> = ({swing}) => (
  <group position={[0.1, -0.55, -0.2]} rotation={[0.2, -0.7, swing]}>
    {Array.from({length: 10}).map((_, i) => {
      const t = i / 9;
      return (
        <Capsule
          key={i}
          color={skin}
          radius={0.055 - t * 0.025}
          length={0.22}
          position={[0.18 + t * 0.22, -t * 0.035, -t * 0.03]}
          rotation={[0, 0, -1.0 + t * 0.22]}
          roughness={0.82}
        />
      );
    })}
  </group>
);

const RatEye: React.FC<{x: number; blink: number}> = ({x, blink}) => (
  <group position={[x, 0.13, 0.53]} scale={[1, Math.max(0.1, 1 - blink * 0.9), 1]}>
    <SoftSphere color={white} radius={0.17} scale={[0.82, 1.08, 0.52]} />
    <SoftSphere color={black} radius={0.085} position={[x > 0 ? -0.025 : 0.025, -0.01, 0.115]} scale={[0.88, 1.0, 0.5]} roughness={0.3} />
    <SoftSphere color={'#ffffff'} radius={0.025} position={[x > 0 ? -0.045 : 0.045, 0.045, 0.16]} roughness={0.2} />
  </group>
);

export const Rat3D: React.FC<{pose: Pose}> = ({pose}) => (
  <group
    position={[-1.35 + pose.sway, -0.15 + pose.jump - (pose.crouch ?? 0), 0]}
    rotation={[0, pose.headTurn * 0.16 + (pose.spin ?? 0), pose.bodyTilt]}
  >
    <Tail swing={pose.tailSwing} />

    <group position={[0, 0.35, 0]}>
      <Capsule color={hoodieDark} radius={0.57} length={0.62} scale={[1.05, 1, 0.82]} />
      <SoftSphere color={hoodie} radius={0.62} position={[0, 0.08, 0.03]} scale={[1.02, 1.08, 0.83]} />
      <SoftSphere color={furLight} radius={0.34} position={[0, 0.08, 0.54]} scale={[1.0, 1.15, 0.4]} roughness={0.88} />
      <Torus color={gold} radius={0.32} tube={0.026} position={[0, 0.42, 0.52]} rotation={[Math.PI / 2, 0, 0]} />
      <Box color={gold} size={[0.16, 0.2, 0.05]} position={[0, 0.18, 0.68]} roughness={0.3} metalness={0.75} />
      <Box color={hoodieDark} size={[0.56, 0.23, 0.055]} position={[0, -0.18, 0.67]} roughness={0.6} />
      <Box color={'#e7d7cc'} size={[0.025, 0.34, 0.025]} position={[-0.1, 0.31, 0.66]} />
      <Box color={'#e7d7cc'} size={[0.025, 0.34, 0.025]} position={[0.1, 0.31, 0.66]} />
    </group>

    <group position={[0, 1.2 + pose.headBob, 0.02]} rotation={[0, pose.headTurn, -pose.bodyTilt * 0.4]}>
      <SoftSphere color={fur} radius={0.68} scale={[1.02, 0.98, 0.94]} roughness={0.9} />
      <SoftSphere color={skin} radius={0.3} position={[0, -0.08, 0.62]} scale={[1.25, 0.78, 0.9]} roughness={0.78} />
      <SoftSphere color={'#dc776e'} radius={0.13} position={[0, 0.02, 0.87]} scale={[1.05, 0.82, 0.78]} roughness={0.52} />

      <group position={[-0.53, 0.34, 0]} rotation={[0, -0.12, 0.08]}>
        <SoftSphere color={fur} radius={0.35} scale={[0.82, 1.08, 0.35]} />
        <SoftSphere color={skin} radius={0.27} position={[0, 0, 0.055]} scale={[0.82, 1.06, 0.25]} />
      </group>
      <group position={[0.53, 0.34, 0]} rotation={[0, 0.12, -0.08]}>
        <SoftSphere color={fur} radius={0.35} scale={[0.82, 1.08, 0.35]} />
        <SoftSphere color={skin} radius={0.27} position={[0, 0, 0.055]} scale={[0.82, 1.06, 0.25]} />
      </group>

      <RatEye x={-0.24} blink={pose.blink} />
      <RatEye x={0.24} blink={pose.blink} />
      <Box color={'#2a2025'} size={[0.25, 0.05, 0.045]} position={[-0.24, 0.35, 0.61]} rotation={[0, 0, 0.12 + (pose.expression ?? 0) * 0.08]} />
      <Box color={'#2a2025'} size={[0.25, 0.05, 0.045]} position={[0.24, 0.35, 0.61]} rotation={[0, 0, -0.12 - (pose.expression ?? 0) * 0.08]} />
      {[-1, 1].flatMap((side) => [-0.08, 0, 0.08].map((dy, i) => (
        <Box key={`${side}-${i}`} color={'#f5efe9'} size={[0.46, 0.012, 0.012]} position={[0.46 * side, -0.05 + dy, 0.76]} rotation={[0, 0, side * dy * 0.45]} />
      )))}

      <group position={[0, -0.2, 0.7]} rotation={[pose.mouthOpen, 0, 0]}>
        <SoftSphere color={'#54262b'} radius={0.18} scale={[1.1, 0.46, 0.55]} />
        <Box color={white} size={[0.12, 0.14, 0.05]} position={[-0.075, 0.04, 0.16]} />
        <Box color={white} size={[0.12, 0.14, 0.05]} position={[0.075, 0.04, 0.16]} />
        <SoftSphere color={'#f06f78'} radius={0.1} position={[0, -0.05, 0.13]} scale={[1.15, 0.42, 0.5]} />
      </group>

      <group position={[0, 0.56, 0]}>
        <SoftSphere color={'#c3292e'} radius={0.55} scale={[1.0, 0.22, 1.02]} roughness={0.56} />
        <Box color={'#b91f25'} size={[0.72, 0.09, 0.42]} position={[0.1, -0.02, 0.44]} rotation={[0.08, -0.04, 0]} />
        <Box color={'#262229'} size={[0.52, 0.08, 0.2]} position={[0, 0.1, -0.47]} />
      </group>
    </group>

    <group position={[-0.62, 0.65 + pose.shoulderBounce, 0]} rotation={[0, 0, 0.35 + pose.armSwing - (pose.reach ?? 0) - (pose.finale ?? 0) * 0.72]}>
      <Capsule color={hoodie} radius={0.18} length={0.62} position={[0, -0.3, 0]} />
      <group position={[0, -0.72, 0]} rotation={[0, 0, -0.24 - pose.armSwing * 0.25]}>
        <Capsule color={fur} radius={0.14} length={0.38} position={[0, -0.18, 0]} />
        <SoftSphere color={skin} radius={0.18} position={[0, -0.46, 0]} scale={[0.82, 1.0, 0.82]} />
      </group>
    </group>
    <group position={[0.62, 0.65 + pose.shoulderBounce, 0]} rotation={[0, 0, -0.35 - pose.armSwing + (pose.reach ?? 0) + (pose.finale ?? 0) * 0.72]}>
      <Capsule color={hoodie} radius={0.18} length={0.62} position={[0, -0.3, 0]} />
      <group position={[0, -0.72, 0]} rotation={[0, 0, 0.24 + pose.armSwing * 0.25]}>
        <Capsule color={fur} radius={0.14} length={0.38} position={[0, -0.18, 0]} />
        <SoftSphere color={skin} radius={0.18} position={[0, -0.46, 0]} scale={[0.82, 1.0, 0.82]} />
      </group>
    </group>

    <group position={[-0.3, -0.45, 0]} rotation={[pose.legSwing, 0, 0.06]}>
      <Capsule color={fur} radius={0.21} length={0.56} position={[0, -0.3, 0]} />
      <group position={[0, -0.72, 0.16]}>
        <SoftSphere color={'#f8f1e8'} radius={0.25} scale={[1.1, 0.48, 1.55]} />
        <SoftSphere color={'#b51f25'} radius={0.22} position={[0, 0.04, 0.08]} scale={[1.0, 0.45, 1.35]} roughness={0.48} />
      </group>
    </group>
    <group position={[0.3, -0.45, 0]} rotation={[-pose.legSwing, 0, -0.06]}>
      <Capsule color={fur} radius={0.21} length={0.56} position={[0, -0.3, 0]} />
      <group position={[0, -0.72, 0.16]}>
        <SoftSphere color={'#f8f1e8'} radius={0.25} scale={[1.1, 0.48, 1.55]} />
        <SoftSphere color={'#b51f25'} radius={0.22} position={[0, 0.04, 0.08]} scale={[1.0, 0.45, 1.35]} roughness={0.48} />
      </group>
    </group>
  </group>
);
