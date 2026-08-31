export type Joint3 = {
  shoulderX: number;
  shoulderY: number;
  shoulderZ: number;
  elbow: number;
  wrist: number;
};

export type LegJoint = {
  hipX: number;
  hipY: number;
  hipZ: number;
  knee: number;
  ankle: number;
};

export type PerformancePose = {
  root: {x: number; y: number; z: number; yaw: number; roll: number; scaleY: number};
  spine: {pelvisYaw: number; pelvisRoll: number; chestYaw: number; chestPitch: number; chestRoll: number};
  neck: {yaw: number; pitch: number; roll: number};
  arms: {left: Joint3; right: Joint3};
  legs: {left: LegJoint; right: LegJoint};
  tail: {yaw: number; curl: number};
  ears: {left: number; right: number};
  face: {blink: number; jawOpen: number; smile: number; brow: number; eyeX: number; eyeY: number};
};

export type PerformanceCamera = {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
  roll: number;
};
