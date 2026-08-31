# Rat + Dog 3D Remotion Film Architecture

## Composition

`RatDogFilm3D` is a 15-second, 1920×1080, 30fps Remotion composition.

The video is driven by `useCurrentFrame()` and `useVideoConfig()` in `src/RatDogFilm3D.tsx`. The 3D scene is rendered through `@remotion/three`'s `ThreeCanvas`.

## Deterministic performance system

`src/performance.mjs` owns all frame-to-pose math. It has five story sections:

1. 0–2s: entrance and settle
2. 2–5s: rat solo
3. 5–8s: dog solo
4. 8–12.3s: synchronized duet
5. 12.3–15s: jump, landing, and held hero finale

Each character receives explicit channels for root motion, pelvis/chest, neck, both arms, both legs, tail, ears, eyes, brows, blink, smile, and jaw.

## Character hierarchy

The upgraded characters are not single rigid meshes. They use nested React Three Fiber groups as animation pivots:

- root
  - pelvis
    - left/right hip → knee → ankle → shoe
    - chest
      - left/right shoulder → elbow → wrist → hand/fingers
      - neck → head
        - eyes / pupils
        - brows
        - jaw / mouth
        - ears
      - clothing and pendant
  - tail

This is an articulated transform rig. It is deliberately separated from the older prototype components so future premium GLB/SkinnedMesh assets can replace the procedural geometry without replacing choreography or camera logic.

## Camera

`performanceCamera()` defines shot language rather than one continuous zoom. It moves from entrance wide → rat solo close → dog solo close → duet wide/close → finale hero shot. `CinematicCamera.tsx` applies the frame-derived camera position, look-at, FOV, and roll.

## Lighting

`lightingCue()` changes accent intensity by story section. `FilmStage3D.tsx` uses directional, spot, rim and floor lighting plus subtle visible light cones. Rat and dog solos receive separate accent emphasis.

## Rendering constraints

`remotion.config.ts` uses Chromium's ANGLE OpenGL renderer, matching Remotion's current recommendation for Three.js rendering.

No R3F `useFrame()` animation loop is used. The animation remains tied to Remotion's frame timeline for scrubbing and deterministic rendering.
