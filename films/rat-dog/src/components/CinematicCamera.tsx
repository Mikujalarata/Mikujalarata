import {useLayoutEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {PerspectiveCamera} from 'three';
import type {PerformanceCamera} from '../performance-types';

export const CinematicCamera: React.FC<{shot: PerformanceCamera}> = ({shot}) => {
  const camera = useThree((state) => state.camera);
  useLayoutEffect(() => {
    camera.position.set(...shot.position);
    camera.lookAt(...shot.lookAt);
    camera.rotateZ(shot.roll);
    if (camera instanceof PerspectiveCamera) {
      camera.fov = shot.fov;
      camera.updateProjectionMatrix();
    }
    camera.updateMatrixWorld();
  }, [camera, shot.position[0], shot.position[1], shot.position[2], shot.lookAt[0], shot.lookAt[1], shot.lookAt[2], shot.roll, shot.fov]);
  return null;
};
