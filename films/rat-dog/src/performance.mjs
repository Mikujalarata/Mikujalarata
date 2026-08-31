const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a || 1));
  return t * t * (3 - 2 * t);
};
const bell = (a, b, c, x) => smooth(a, b, x) * (1 - smooth(b, c, x));
const pulse = (t, hz, phase = 0) => Math.sin((t * hz + phase) * TAU);
const absPulse = (t, hz, phase = 0) => Math.abs(pulse(t, hz, phase));

export const sectionForTime = (t) => {
  if (t < 2) return 'entrance';
  if (t < 5) return 'rat-solo';
  if (t < 8) return 'dog-solo';
  if (t < 12.3) return 'duet';
  return 'finale';
};

const basePose = (role, t) => {
  const side = role === 'rat' ? -1 : 1;
  const phase = role === 'rat' ? 0 : 0.5;
  const groove = pulse(t, 1.95, phase);
  const half = pulse(t, 0.975, phase);
  const bounce = absPulse(t, 1.95, phase);
  return {
    root: {x: side * 1.42 + groove * 0.08, y: bounce * 0.055, z: 0, yaw: half * 0.035, roll: groove * 0.035, scaleY: 1 - bounce * 0.018},
    spine: {pelvisYaw: groove * 0.055, pelvisRoll: groove * 0.045, chestYaw: -groove * 0.075, chestPitch: bounce * -0.028, chestRoll: groove * 0.07},
    neck: {yaw: -half * 0.12, pitch: bounce * -0.05, roll: groove * 0.025},
    arms: {
      left: {shoulderX: 0.08, shoulderY: 0, shoulderZ: 0.32 + groove * 0.19, elbow: -0.22 - bounce * 0.12, wrist: groove * 0.08},
      right: {shoulderX: 0.08, shoulderY: 0, shoulderZ: -0.32 - groove * 0.19, elbow: 0.22 + bounce * 0.12, wrist: -groove * 0.08},
    },
    legs: {
      left: {hipX: groove * 0.18, hipY: 0, hipZ: 0.04, knee: -0.12 - Math.max(0, groove) * 0.12, ankle: 0.04},
      right: {hipX: -groove * 0.18, hipY: 0, hipZ: -0.04, knee: -0.12 - Math.max(0, -groove) * 0.12, ankle: -0.04},
    },
    tail: {yaw: pulse(t, 1.05, phase + 0.15) * 0.28, curl: pulse(t, 0.52, phase) * 0.08},
    ears: {left: groove * 0.03, right: -groove * 0.03},
    face: {
      blink: 0,
      jawOpen: 0.12 + Math.max(0, pulse(t, 0.95, phase + 0.12)) * 0.14,
      smile: role === 'dog' ? 0.66 : 0.58,
      brow: 0.16,
      eyeX: half * 0.06,
      eyeY: 0,
    },
  };
};

const add = (pose, path, amount) => {
  const parts = path.split('.');
  let ref = pose;
  for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
  ref[parts.at(-1)] += amount;
};
const set = (pose, path, value) => {
  const parts = path.split('.');
  let ref = pose;
  for (let i = 0; i < parts.length - 1; i++) ref = ref[parts[i]];
  ref[parts.at(-1)] = value;
};

const applyEntrance = (pose, role, t) => {
  const side = role === 'rat' ? -1 : 1;
  const enter = smooth(0.05, 1.35, t);
  pose.root.x += side * (1 - enter) * 2.5;
  pose.root.y += Math.sin(enter * Math.PI) * 0.17;
  pose.root.yaw += side * (1 - enter) * 0.16;
  pose.face.smile = lerp(0.24, pose.face.smile, enter);
  const settle = bell(1.0, 1.42, 1.95, t);
  add(pose, 'spine.chestPitch', settle * -0.12);
  add(pose, 'arms.left.shoulderZ', side * settle * 0.22);
};

const applySolo = (pose, role, t, activeRole, start, end) => {
  const local = t - start;
  const active = role === activeRole;
  const w = smooth(start, start + 0.22, t) * (1 - smooth(end - 0.28, end, t));
  const spin = bell(start + 0.55, start + 1.18, start + 1.78, t);
  const hit = bell(start + 1.65, start + 1.92, start + 2.28, t);
  const groove = pulse(local, 2.35, activeRole === 'rat' ? 0.06 : 0.56);
  if (active) {
    add(pose, 'root.y', Math.max(0, pulse(local, 1.17, 0.1)) * 0.24 * w);
    add(pose, 'root.yaw', spin * (activeRole === 'rat' ? 1.18 : -1.08));
    add(pose, 'spine.pelvisYaw', groove * 0.22 * w);
    add(pose, 'spine.chestYaw', -groove * 0.31 * w);
    add(pose, 'spine.chestRoll', groove * 0.17 * w);
    add(pose, 'neck.roll', -groove * 0.10 * w);
    add(pose, 'arms.left.shoulderZ', (0.52 + groove * 0.38) * w);
    add(pose, 'arms.right.shoulderZ', (-0.46 + groove * 0.31) * w);
    add(pose, 'arms.left.shoulderX', -0.25 * hit);
    add(pose, 'arms.right.shoulderX', -0.17 * hit);
    add(pose, 'legs.left.hipX', groove * 0.42 * w);
    add(pose, 'legs.right.hipX', -groove * 0.46 * w);
    add(pose, 'legs.left.knee', -Math.max(0, -groove) * 0.36 * w);
    add(pose, 'legs.right.knee', -Math.max(0, groove) * 0.36 * w);
    add(pose, 'tail.yaw', groove * 0.36 * w);
    set(pose, 'face.smile', 0.82);
    add(pose, 'face.jawOpen', hit * 0.32);
    add(pose, 'face.brow', 0.28 * w);
  } else {
    const react = bell(start + 1.5, start + 1.92, start + 2.45, t);
    pose.root.y *= 0.35;
    add(pose, 'neck.yaw', (activeRole === 'rat' ? -1 : 1) * 0.18 * w);
    add(pose, 'arms.left.shoulderZ', 0.08 * groove * w);
    add(pose, 'arms.right.shoulderZ', -0.08 * groove * w);
    add(pose, 'face.brow', react * 0.42);
    add(pose, 'face.jawOpen', react * 0.19);
  }
};

const applyDuet = (pose, role, t) => {
  const side = role === 'rat' ? -1 : 1;
  const local = t - 8;
  const w = smooth(8.0, 8.35, t) * (1 - smooth(12.0, 12.3, t));
  const beat = pulse(local, 2.0, role === 'rat' ? 0 : 0.5);
  const mirrorBeat = pulse(local, 2.0, 0);
  const shared = pulse(local, 1.0, 0.125);
  const jump = Math.max(0, pulse(local, 1.0, 0.02));
  const cross = bell(9.1, 9.7, 10.3, t);
  const kick = bell(10.45, 10.78, 11.2, t);
  add(pose, 'root.x', side * -0.20 * cross);
  add(pose, 'root.y', jump * 0.30 * w);
  add(pose, 'root.yaw', side * shared * 0.10 * w);
  add(pose, 'spine.pelvisRoll', side * beat * 0.12 * w);
  pose.spine.chestRoll = pose.spine.chestRoll * (1 - w) + side * mirrorBeat * 0.24 * w;
  add(pose, 'spine.chestYaw', side * -shared * 0.17 * w);
  add(pose, 'neck.roll', side * -beat * 0.08 * w);
  add(pose, 'arms.left.shoulderZ', side * (0.40 + beat * 0.30) * w);
  add(pose, 'arms.right.shoulderZ', side * (-0.40 + beat * 0.30) * w);
  add(pose, 'legs.left.hipX', (beat * 0.32 - kick * 0.70) * w);
  add(pose, 'legs.right.hipX', (-beat * 0.32 + kick * 0.70) * w);
  add(pose, 'legs.left.knee', -kick * 0.42 * w);
  add(pose, 'legs.right.knee', -kick * 0.42 * w);
  add(pose, 'tail.yaw', side * shared * 0.42 * w);
  pose.face.smile = role === 'rat' ? 0.84 : 0.90;
  add(pose, 'face.jawOpen', jump * 0.12);
};

const applyFinale = (pose, role, t) => {
  const side = role === 'rat' ? -1 : 1;
  const prep = bell(12.3, 12.72, 13.15, t);
  const land = smooth(13.15, 13.72, t);
  const hold = smooth(13.55, 14.1, t);
  add(pose, 'root.y', prep * 0.34);
  add(pose, 'root.x', side * -0.18 * land);
  pose.root.yaw = lerp(pose.root.yaw, side * -0.045, hold);
  pose.root.roll = lerp(pose.root.roll, side * -0.055, hold);
  pose.spine.chestRoll = lerp(pose.spine.chestRoll, side * -0.10, hold);
  pose.spine.chestYaw = lerp(pose.spine.chestYaw, side * 0.08, hold);
  pose.neck.yaw = lerp(pose.neck.yaw, side * -0.12, hold);
  pose.arms.left.shoulderZ = lerp(pose.arms.left.shoulderZ, role === 'rat' ? 1.05 : 0.72, hold);
  pose.arms.right.shoulderZ = lerp(pose.arms.right.shoulderZ, role === 'rat' ? -0.58 : -1.02, hold);
  pose.arms.left.shoulderX = lerp(pose.arms.left.shoulderX, -0.28, hold);
  pose.arms.right.shoulderX = lerp(pose.arms.right.shoulderX, -0.22, hold);
  pose.legs.left.hipX = lerp(pose.legs.left.hipX, 0.10, hold);
  pose.legs.right.hipX = lerp(pose.legs.right.hipX, -0.10, hold);
  pose.legs.left.hipZ = lerp(pose.legs.left.hipZ, -0.12 * side, hold);
  pose.legs.right.hipZ = lerp(pose.legs.right.hipZ, 0.12 * side, hold);
  pose.face.smile = lerp(pose.face.smile, 0.96, hold);
  pose.face.brow = lerp(pose.face.brow, 0.34, hold);
  pose.face.jawOpen = lerp(pose.face.jawOpen, role === 'rat' ? 0.34 : 0.28, hold);
};

const applyBlink = (pose, role, t) => {
  const offsets = role === 'rat' ? [1.62, 4.42, 7.9, 11.55, 14.62] : [1.35, 4.82, 7.25, 10.95, 14.35];
  let blink = 0;
  for (const c of offsets) blink = Math.max(blink, bell(c - 0.08, c, c + 0.11, t));
  pose.face.blink = clamp(blink);
};

export const performancePose = (frame, {fps = 30, role = 'rat'} = {}) => {
  const t = frame / fps;
  const pose = basePose(role, t);
  applyEntrance(pose, role, t);
  applySolo(pose, role, t, 'rat', 2, 5);
  applySolo(pose, role, t, 'dog', 5, 8);
  applyDuet(pose, role, t);
  applyFinale(pose, role, t);
  applyBlink(pose, role, t);
  return pose;
};

const shot = (a, b, x) => {
  const t = smooth(0, 1, x);
  return {
    position: [lerp(a.position[0], b.position[0], t), lerp(a.position[1], b.position[1], t), lerp(a.position[2], b.position[2], t)],
    lookAt: [lerp(a.lookAt[0], b.lookAt[0], t), lerp(a.lookAt[1], b.lookAt[1], t), lerp(a.lookAt[2], b.lookAt[2], t)],
    fov: lerp(a.fov, b.fov, t),
    roll: lerp(a.roll ?? 0, b.roll ?? 0, t),
  };
};

export const performanceCamera = (frame, fps = 30) => {
  const t = frame / fps;
  const entrance = {position: [0, 1.25, 9.6], lookAt: [0, 0.8, 0], fov: 38, roll: 0};
  const rat = {position: [-2.25, 1.45, 7.2], lookAt: [-1.05, 0.95, 0], fov: 34, roll: -0.018};
  const dog = {position: [2.25, 1.38, 7.0], lookAt: [1.02, 0.94, 0], fov: 33, roll: 0.018};
  const duetWide = {position: [0, 1.15, 8.15], lookAt: [0, 0.84, 0], fov: 36, roll: 0};
  const duetClose = {position: [0.18, 1.55, 6.15], lookAt: [0, 1.02, 0], fov: 30, roll: 0.01};
  const finale = {position: [0, 1.05, 7.65], lookAt: [0, 0.78, 0], fov: 28, roll: 0};

  let c;
  if (t < 1.55) c = shot(entrance, entrance, 0);
  else if (t < 2.15) c = shot(entrance, rat, (t - 1.55) / 0.6);
  else if (t < 4.72) c = shot(rat, rat, 0);
  else if (t < 5.28) c = shot(rat, dog, (t - 4.72) / 0.56);
  else if (t < 7.72) c = shot(dog, dog, 0);
  else if (t < 8.28) c = shot(dog, duetWide, (t - 7.72) / 0.56);
  else if (t < 10.35) c = shot(duetWide, duetClose, (t - 8.28) / 2.07);
  else if (t < 12.22) c = shot(duetClose, duetWide, (t - 10.35) / 1.87);
  else if (t < 13.55) c = shot(duetWide, finale, (t - 12.22) / 1.33);
  else c = shot(finale, finale, 0);

  const micro = Math.sin(t * 0.82) * 0.018;
  c.position[0] += micro;
  c.position[1] += Math.sin(t * 0.61 + 0.8) * 0.012;
  return c;
};

export const lightingCue = (frame, fps = 30) => {
  const t = frame / fps;
  const section = sectionForTime(t);
  const beat = absPulse(t, 1.95);
  return {
    section,
    key: 1.25 + beat * 0.25,
    rim: 0.85 + beat * 0.30,
    floorGlow: 0.36 + beat * 0.20,
    ratAccent: section === 'rat-solo' ? 1.25 : section === 'finale' ? 1.05 : 0.78,
    dogAccent: section === 'dog-solo' ? 1.25 : section === 'finale' ? 1.05 : 0.78,
  };
};
