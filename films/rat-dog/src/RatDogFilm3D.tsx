import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {RiggedRat3D} from './components/RiggedRat3D';
import {RiggedDog3D} from './components/RiggedDog3D';
import {FilmStage3D} from './components/FilmStage3D';
import {CinematicCamera} from './components/CinematicCamera';
import {lightingCue, performanceCamera, performancePose} from './performance.mjs';

export const RatDogFilm3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const ratPose = performancePose(frame, {fps, role: 'rat'});
  const dogPose = performancePose(frame, {fps, role: 'dog'});
  const shot = performanceCamera(frame, fps);
  const cue = lightingCue(frame, fps);

  return (
    <AbsoluteFill style={{backgroundColor: '#050812'}}>
      <ThreeCanvas
        width={width}
        height={height}
        orthographic={false}
        shadows
        camera={{fov: shot.fov, position: shot.position, near: 0.1, far: 100}}
        style={{backgroundColor: '#050812'}}
      >
        <CinematicCamera shot={shot} />
        <FilmStage3D cue={cue} frame={frame} />
        <RiggedRat3D pose={ratPose} />
        <RiggedDog3D pose={dogPose} />
      </ThreeCanvas>

      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 45%, transparent 37%, rgba(0,0,0,0.12) 66%, rgba(0,0,0,0.63) 100%)',
          boxShadow: 'inset 0 0 180px rgba(0,0,0,0.44)',
        }}
      />
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 34, background: 'rgba(0,0,0,0.72)'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 34, background: 'rgba(0,0,0,0.72)'}} />
    </AbsoluteFill>
  );
};
