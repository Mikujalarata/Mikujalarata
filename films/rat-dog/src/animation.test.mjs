import test from 'node:test';
import assert from 'node:assert/strict';
import {beatPhase, blinkAmount, characterPose, scenePose} from './animation.mjs';

test('beat phase repeats every beat', () => {
  assert.equal(beatPhase(0, 30, 120), 0);
  assert.ok(Math.abs(beatPhase(15, 30, 120) - 0) < 1e-9);
  assert.ok(Math.abs(beatPhase(7.5, 30, 120) - 0.5) < 1e-9);
});

test('jump is highest halfway through the launch window', () => {
  const low = characterPose(0, {fps: 30, bpm: 120, phase: 0});
  const high = characterPose(3.75, {fps: 30, bpm: 120, phase: 0});
  assert.ok(high.jump > low.jump + 0.25);
});

test('rat and dog can mirror their lateral sway', () => {
  const rat = characterPose(5, {fps: 30, bpm: 120, phase: 0, mirror: 1});
  const dog = characterPose(5, {fps: 30, bpm: 120, phase: 0, mirror: -1});
  assert.ok(Math.abs(rat.sway + dog.sway) < 1e-9);
  assert.ok(Math.abs(rat.armSwing + dog.armSwing) < 1e-9);
});

test('blink amount closes eyes only inside a short window', () => {
  assert.equal(blinkAmount(0), 0);
  assert.ok(blinkAmount(0.02) > 0.5);
  assert.equal(blinkAmount(0.12), 0);
});

test('scene pose stays finite and within cinematic movement bounds', () => {
  for (const frame of [0, 60, 180, 359]) {
    const pose = scenePose(frame, 30);
    for (const value of Object.values(pose)) assert.ok(Number.isFinite(value));
    assert.ok(Math.abs(pose.yaw) < 0.2);
    assert.ok(pose.zoom > 0.9 && pose.zoom < 1.2);
  }
});

test('cinematic pose adds a controlled spin during the battle section', async () => {
  const {cinematicPose} = await import('./animation.mjs');
  const intro = cinematicPose(10, {fps: 24, role: 'rat'});
  const battle = cinematicPose(78, {fps: 24, role: 'rat'});
  assert.ok(Math.abs(intro.spin) < 0.3);
  assert.ok(Math.abs(battle.spin) > 0.45);
  assert.ok(battle.expression >= 0 && battle.expression <= 1);
});

test('cinematic camera changes shot scale without leaving safe bounds', async () => {
  const {cinematicCamera} = await import('./animation.mjs');
  const frames = [0, 35, 80, 118, 143];
  const shots = frames.map((frame) => cinematicCamera(frame, 24));
  for (const shot of shots) {
    assert.ok(shot.distance >= 6.2 && shot.distance <= 9.8);
    assert.ok(Math.abs(shot.x) <= 1.2);
    assert.ok(shot.targetY >= 0.3 && shot.targetY <= 1.5);
  }
  assert.notEqual(shots[0].distance, shots[2].distance);
});
