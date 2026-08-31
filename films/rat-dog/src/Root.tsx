import React from 'react';
import {Composition} from 'remotion';
import {RatDogDance3D} from './RatDogDance3D';
import {DogTurntable3D, RatTurntable3D} from './Turntables';
import {RatDogFilm3D} from './RatDogFilm3D';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="RatTurntable3D"
      component={RatTurntable3D}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="DogTurntable3D"
      component={DogTurntable3D}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />

    <Composition
      id="RatDogFilm3D"
      component={RatDogFilm3D}
      durationInFrames={450}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="RatDogDance3D"
      component={RatDogDance3D}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
    />
  </>
);
