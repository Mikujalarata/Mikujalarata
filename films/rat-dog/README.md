# Rat + Dog — 3D Remotion Film v3

A programmable 3D cartoon short built with React, Remotion, React Three Fiber and `@remotion/three`.

## Main composition

- **ID:** `RatDogFilm3D`
- **Duration:** 15 seconds
- **FPS:** 30
- **Resolution:** 1920×1080
- **Frames:** 450

## What changed in v3

- Replaced the simple whole-body dance controls with an articulated joint hierarchy.
- Added explicit shoulder, elbow, wrist, hip, knee and ankle channels.
- Added independent neck, pelvis and chest controls.
- Added deterministic facial animation: blink, eye direction, brows, jaw and smile.
- Added character-specific solo choreography plus synchronized duet choreography.
- Added a five-section story arc and a held finale pose.
- Added shot-based camera design with position, target, FOV and subtle roll.
- Added section-aware stage lighting and accent cues.
- Added 18 automated tests covering animation math and Remotion architecture.
- Added a GitHub Actions workflow that can render the MP4 on demand.

## Files to start with

- `src/RatDogFilm3D.tsx` — main Remotion composition
- `src/performance.mjs` — all choreography, camera and lighting math
- `src/components/RiggedRat3D.tsx` — articulated rat
- `src/components/RiggedDog3D.tsx` — articulated dog
- `src/components/RigParts.tsx` — reusable arm/leg joint hierarchy
- `src/components/FilmStage3D.tsx` — cinematic stage and lighting
- `src/components/CinematicCamera.tsx` — applies frame-derived camera shots
- `docs/ARCHITECTURE.md` — full architecture notes

## Run

```bash
npm install
npm test
npm run dev
```

Open `RatDogFilm3D` in Remotion Studio.

## Render

```bash
npm run render:film
```

Output: `out/rat-dog-film-3d.mp4`

## Cloud render without a local computer

The included `.github/workflows/render-film.yml` workflow can be run manually in GitHub Actions. It installs the dependencies, runs all tests, renders `RatDogFilm3D`, and uploads the MP4 as a workflow artifact.

## Quality boundary

This v3 is a materially stronger **Remotion animation/rig/cinematography system**. The procedural meshes are still not feature-film character sculpts. The architecture is intentionally ready for a later asset swap to professionally sculpted, textured, groomed and SkinnedMesh-rigged GLB characters while keeping the same deterministic Remotion choreography and camera system.
