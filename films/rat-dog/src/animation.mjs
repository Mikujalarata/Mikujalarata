const TAU = Math.PI * 2;

export const beatPhase = (frame, fps, bpm) => {
  const beatFrames = (fps * 60) / bpm;
  const wrapped = ((frame % beatFrames) + beatFrames) % beatFrames;
  return wrapped / beatFrames;
};

export const blinkAmount = (phase) => {
  const p = ((phase % 1) + 1) % 1;
  if (p > 0.04) return 0;
  return Math.sin((p / 0.04) * Math.PI);
};

export const characterPose = (
  frame,
  {fps = 30, bpm = 120, phase = 0, mirror = 1, energy = 1} = {},
) => {
  const beatFrames = (fps * 60) / bpm;
  const shiftedFrame = frame + phase * beatFrames;
  const p = beatPhase(shiftedFrame, fps, bpm);
  const bar = beatPhase(shiftedFrame, fps, bpm / 4);
  const beatAngle = p * TAU;
  const barAngle = bar * TAU;

  const jump = p < 0.5 ? Math.sin((p / 0.5) * Math.PI) * 0.58 * energy : 0;
  const sway = Math.sin(beatAngle) * 0.17 * mirror * energy;
  const armSwing = Math.sin(beatAngle + Math.PI / 2) * 0.72 * mirror * energy;
  const legSwing = Math.sin(beatAngle + Math.PI) * 0.48 * mirror * energy;
  const bodyTilt = Math.sin(beatAngle) * 0.09 * mirror;
  const headBob = Math.abs(Math.sin(beatAngle)) * 0.075 * energy;
  const headTurn = Math.sin(barAngle) * 0.18 * mirror;
  const shoulderBounce = Math.abs(Math.sin(beatAngle)) * 0.08 * energy;
  const tailSwing = Math.sin(beatAngle * 0.5 + Math.PI / 3) * 0.42 * mirror;
  const mouthOpen = 0.16 + Math.max(0, Math.sin(beatAngle - Math.PI / 4)) * 0.26;
  const blinkPhase = beatPhase(shiftedFrame + beatFrames * 0.16, fps, bpm / 8);

  return {
    jump,
    sway,
    armSwing,
    legSwing,
    bodyTilt,
    headBob,
    headTurn,
    shoulderBounce,
    tailSwing,
    mouthOpen,
    blink: blinkAmount(blinkPhase),
  };
};

export const scenePose = (frame, fps = 30) => {
  const t = frame / fps;
  return {
    yaw: Math.sin(t * 0.55) * 0.075,
    pitch: Math.sin(t * 0.31 + 0.8) * 0.025,
    x: Math.sin(t * 0.42) * 0.18,
    y: Math.sin(t * 0.63 + 1.2) * 0.08,
    zoom: 1.04 + Math.sin(t * 0.37) * 0.035,
  };
};

const smoothstep = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a || 1)));
  return t * t * (3 - 2 * t);
};

export const cinematicPose = (
  frame,
  {fps = 24, role = 'rat'} = {},
) => {
  const t = frame / fps;
  const mirror = role === 'dog' ? -1 : 1;
  const phase = role === 'dog' ? 0.5 : 0;
  const base = characterPose(frame, {
    fps,
    bpm: 118,
    phase,
    mirror,
    energy: role === 'dog' ? 0.98 : 1.05,
  });

  const battleIn = smoothstep(2.25, 2.85, t);
  const battleOut = 1 - smoothstep(4.15, 4.7, t);
  const battle = battleIn * battleOut;
  const finale = smoothstep(4.6, 5.55, t);
  const intro = 1 - smoothstep(0.55, 1.35, t);
  const spinDirection = role === 'dog' ? -1 : 1;

  return {
    ...base,
    spin: Math.sin(Math.max(0, t - 2.35) * Math.PI * 1.8) * 0.92 * battle * spinDirection,
    crouch: Math.max(0, Math.sin((t - 1.45) * Math.PI * 1.35)) * (1 - battle) * 0.16,
    reach: Math.sin(t * Math.PI * 1.15 + phase * Math.PI) * 0.22 + battle * 0.28 * mirror,
    expression: Math.max(0, Math.min(1, 0.42 + battle * 0.38 + finale * 0.2 - intro * 0.16)),
    finale,
  };
};

export const cinematicCamera = (frame, fps = 24) => {
  const t = frame / fps;
  const section = t < 1.7 ? 0 : t < 3.2 ? 1 : t < 4.55 ? 2 : 3;
  const values = [
    {distance: 9.1, x: -0.38, targetY: 0.82, yaw: -0.055},
    {distance: 7.6, x: 0.42, targetY: 0.98, yaw: 0.07},
    {distance: 6.75, x: -0.18, targetY: 1.08, yaw: -0.04},
    {distance: 8.35, x: 0, targetY: 0.86, yaw: 0},
  ];
  const shot = values[section];
  return {
    distance: shot.distance + Math.sin(t * 0.72) * 0.15,
    x: shot.x + Math.sin(t * 0.43) * 0.06,
    targetY: shot.targetY + Math.sin(t * 0.51) * 0.025,
    yaw: shot.yaw + Math.sin(t * 0.32) * 0.015,
  };
};
