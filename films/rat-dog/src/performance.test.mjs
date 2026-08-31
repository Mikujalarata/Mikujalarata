import test from 'node:test';
import assert from 'node:assert/strict';
import {performancePose, performanceCamera, sectionForTime} from './performance.mjs';

const finiteTree = (value) => {
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(finiteTree);
  if (value && typeof value === 'object') return Object.values(value).every(finiteTree);
  return true;
};

test('section timing follows the 15 second story arc', () => {
  assert.equal(sectionForTime(0.2), 'entrance');
  assert.equal(sectionForTime(2.7), 'rat-solo');
  assert.equal(sectionForTime(6.2), 'dog-solo');
  assert.equal(sectionForTime(9.7), 'duet');
  assert.equal(sectionForTime(13.7), 'finale');
});

test('performance pose exposes finite articulated channels throughout the film', () => {
  for (const role of ['rat', 'dog']) {
    for (const frame of [0, 45, 90, 165, 240, 330, 449]) {
      const pose = performancePose(frame, {fps: 30, role});
      assert.equal(finiteTree(pose), true);
      assert.ok(pose.face.blink >= 0 && pose.face.blink <= 1);
      assert.ok(pose.face.jawOpen >= 0 && pose.face.jawOpen <= 1);
      assert.ok(Math.abs(pose.root.y) < 2.5);
      assert.ok(Math.abs(pose.spine.chestRoll) < 1.2);
    }
  }
});

test('rat leads the rat solo while dog stays comparatively restrained', () => {
  const frame = Math.round(3.6 * 30);
  const rat = performancePose(frame, {fps: 30, role: 'rat'});
  const dog = performancePose(frame, {fps: 30, role: 'dog'});
  const ratEnergy = Math.abs(rat.arms.left.shoulderZ) + Math.abs(rat.legs.right.hipX) + rat.root.y;
  const dogEnergy = Math.abs(dog.arms.left.shoulderZ) + Math.abs(dog.legs.right.hipX) + dog.root.y;
  assert.ok(ratEnergy > dogEnergy + 0.25);
});

test('dog leads the dog solo while rat stays comparatively restrained', () => {
  const frame = Math.round(6.6 * 30);
  const rat = performancePose(frame, {fps: 30, role: 'rat'});
  const dog = performancePose(frame, {fps: 30, role: 'dog'});
  const ratEnergy = Math.abs(rat.arms.right.shoulderZ) + Math.abs(rat.legs.left.hipX) + rat.root.y;
  const dogEnergy = Math.abs(dog.arms.right.shoulderZ) + Math.abs(dog.legs.left.hipX) + dog.root.y;
  assert.ok(dogEnergy > ratEnergy + 0.25);
});

test('duet section mirrors the two dancers without making them identical', () => {
  const frame = Math.round(10.1 * 30);
  const rat = performancePose(frame, {fps: 30, role: 'rat'});
  const dog = performancePose(frame, {fps: 30, role: 'dog'});
  assert.ok(Math.abs(rat.root.x + dog.root.x) < 0.5);
  assert.ok(Math.sign(rat.spine.chestRoll) === -Math.sign(dog.spine.chestRoll));
  assert.notEqual(rat.face.smile, dog.face.smile);
});

test('finale gives both characters a strong planted hero pose', () => {
  const frame = Math.round(14.4 * 30);
  for (const role of ['rat', 'dog']) {
    const pose = performancePose(frame, {fps: 30, role});
    assert.ok(Math.abs(pose.arms.left.shoulderZ) > 0.55 || Math.abs(pose.arms.right.shoulderZ) > 0.55);
    assert.ok(pose.face.smile > 0.65);
    assert.ok(Math.abs(pose.root.y) < 0.25);
  }
});

test('camera uses bounded cinematic shots and changes focal strategy across sections', () => {
  const samples = [0.5, 3.2, 6.3, 9.4, 12.2, 14.6].map((t) => performanceCamera(Math.round(t * 30), 30));
  for (const camera of samples) {
    assert.equal(finiteTree(camera), true);
    assert.ok(camera.fov >= 24 && camera.fov <= 46);
    assert.ok(camera.position[2] >= 5.4 && camera.position[2] <= 10.5);
    assert.ok(Math.abs(camera.position[0]) <= 3.5);
    assert.ok(camera.lookAt[1] >= 0.35 && camera.lookAt[1] <= 1.8);
  }
  assert.notDeepEqual(samples[0].position, samples[3].position);
  assert.notEqual(samples[1].fov, samples[4].fov);
});
