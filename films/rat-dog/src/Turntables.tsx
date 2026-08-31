import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Rat3D} from './components/Rat3D';
import {Dog3D} from './components/Dog3D';

const neutralPose = {
  jump: 0,
  sway: 0,
  armSwing: 0.12,
  legSwing: 0,
  bodyTilt: 0,
  headBob: 0,
  headTurn: 0,
  shoulderBounce: 0,
  tailSwing: 0.2,
  mouthOpen: 0.15,
  blink: 0,
};

const Studio: React.FC<{kind: 'rat' | 'dog'}> = ({kind}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const rotation = (frame / 180) * Math.PI * 2;

  return (
    <AbsoluteFill style={{backgroundColor: '#0b0d13'}}>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 31, position: [0, 1.5, 8.2]}}>
        <color attach="background" args={['#0b0d13']} />
        <ambientLight intensity={0.36} />
        <hemisphereLight args={['#dce6ff', '#2a1b22', 1.15]} />
        <directionalLight position={[4, 6, 5]} intensity={2.5} castShadow />
        <spotLight position={[-4, 5, 4]} color={'#8fc7ff'} intensity={70} distance={16} angle={0.42} penumbra={0.9} />
        <spotLight position={[4, 4, 2]} color={'#ff9ab6'} intensity={45} distance={14} angle={0.45} penumbra={0.92} />
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[4.2, 96]} />
          <meshPhysicalMaterial color={'#1b1e27'} roughness={0.28} metalness={0.18} clearcoat={0.25} />
        </mesh>
        <group rotation={[0, rotation, 0]} position={[0, -0.12, 0]}>
          {kind === 'rat' ? <Rat3D pose={neutralPose} /> : <Dog3D pose={neutralPose} />}
        </group>
      </ThreeCanvas>
      <AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(circle at 50% 45%, transparent 42%, rgba(0,0,0,.52) 100%)'}} />
    </AbsoluteFill>
  );
};

export const RatTurntable3D: React.FC = () => <Studio kind="rat" />;
export const DogTurntable3D: React.FC = () => <Studio kind="dog" />;
