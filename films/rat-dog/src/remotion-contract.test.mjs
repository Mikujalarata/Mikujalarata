import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read = (p) => readFile(new URL(p, import.meta.url), 'utf8');

test('film composition is registered as a 15 second 1080p Remotion composition', async () => {
  const root = await read('./Root.tsx');
  assert.match(root, /id="RatDogFilm3D"/);
  assert.match(root, /durationInFrames=\{450\}/);
  assert.match(root, /fps=\{30\}/);
  assert.match(root, /width=\{1920\}/);
  assert.match(root, /height=\{1080\}/);
});

test('film uses @remotion/three and Remotion frame hooks, never an R3F useFrame loop', async () => {
  const files = await Promise.all([
    read('./RatDogFilm3D.tsx'),
    read('./components/RiggedRat3D.tsx'),
    read('./components/RiggedDog3D.tsx'),
    read('./components/FilmStage3D.tsx'),
    read('./components/CinematicCamera.tsx'),
  ]);
  const source = files.join('\n');
  assert.match(source, /ThreeCanvas/);
  assert.match(source, /useCurrentFrame/);
  assert.doesNotMatch(source, /\buseFrame\s*\(/);
});

test('server render configuration uses ANGLE for Three.js rendering', async () => {
  const config = await read('../remotion.config.ts');
  assert.match(config, /setChromiumOpenGlRenderer\('angle'\)/);
});

test('characters expose hierarchical arm and leg joints', async () => {
  const rig = await read('./components/RigParts.tsx');
  assert.match(rig, /pose\.shoulderX/);
  assert.match(rig, /pose\.elbow/);
  assert.match(rig, /pose\.wrist/);
  assert.match(rig, /pose\.hipX/);
  assert.match(rig, /pose\.knee/);
  assert.match(rig, /pose\.ankle/);
});
