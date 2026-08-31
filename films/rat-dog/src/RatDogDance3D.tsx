import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Rat3D} from './components/Rat3D';
import {Dog3D} from './components/Dog3D';
import {Stage3D} from './components/Stage3D';
import {cinematicCamera, cinematicPose} from './animation.mjs';

export const RatDogDance3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const ratPose = cinematicPose(frame, {fps, role: 'rat'});
  const dogPose = cinematicPose(frame, {fps, role: 'dog'});
  const camera = cinematicCamera(frame, fps);
  const shotScale = 8.25 / camera.distance;

  return (
    <AbsoluteFill style={{backgroundColor: '#050711'}}>
      <ThreeCanvas
        width={width}
        height={height}
        orthographic={false}
        shadows
        camera={{fov: 31, position: [0, 1.55, 8.25], near: 0.1, far: 100}}
        style={{backgroundColor: '#050711'}}
      >
        <group
          position={[-camera.x, 0.84 - camera.targetY, 0]}
          rotation={[0, camera.yaw, 0]}
          scale={[shotScale, shotScale, shotScale]}
        >
          <Stage3D frame={frame} />
          <Rat3D pose={ratPose} />
          <Dog3D pose={dogPose} />
        </group>
      </ThreeCanvas>

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 44%, transparent 34%, rgba(0,0,0,0.18) 68%, rgba(0,0,0,0.64) 100%)',
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.42)',
        }}
      />
    </AbsoluteFill>
  );
};
