# 3D Animation Repository Migration Design

## Goal

Separate the existing Blender/Remotion/React Three Fiber character-production work from `rajalarata/ios` and reconstruct it as an independent 3D animation repository without losing the later Library-only rigging and skin-repair work.

## Repository boundary

This repository owns 3D character references, editable Blender source, Blender automation, rigging/skinning validation, GLB/glTF exports, deterministic Remotion/React Three Fiber animation code, film compositions, and QA assets.

It does not own ProofLedger/iOS application code. It also does not automatically absorb unrelated VR, photogrammetry, image-only creative experiments, or future 3D projects until they share this production pipeline.

The current GitHub container is `Mikujalarata/Mikujalarata` because the connector cannot create or rename repositories. After migration verification it should be renamed to `3d-animation` in GitHub.

## Source lineage

The migration must preserve and document these source lines:

1. `rajalarata/ios` branch `blender-rat-step1` / closed PR #7: original Blender build, refine, render, manifest validation, and video workflows.
2. `rajalarata/ios` branch `blender-rat-sculpt-v3-clean` / draft PR #8: current sculpt-v3 and metric diagnostic work.
3. ChatGPT Library `remotion-rat-dog-film-v3.zip`: newest coherent Rat + Dog Remotion/React Three Fiber film source.
4. ChatGPT Library `rat-skin-repair-stage.zip`: newest Blender-source skin repair, semantic validator, editable `.blend`, repaired `.glb`, and deformation QA.
5. ChatGPT Library production rig artifacts: `ProductionRatGLB.tsx`, `rat-production-rigged.glb`, and `rat-production-rigged.manifest.json`.
6. ChatGPT Library Rat + Dog turnaround/reference artwork and prototype GLBs.

## Target structure

```text
characters/
  rat/
    reference/
    blender/
    rigging/
    validation/
    qa/
    exports/
  dog/
    reference/
    exports/
films/
  rat-dog/
    src/
    public/models/
    scripts/
pipeline/
  blender/
  validation/
docs/
  lineage/
  superpowers/
.github/workflows/
```

## Asset policy

- Editable `.blend` files are authoritative source assets.
- Validated GLBs may be committed while the migration is being verified so no accepted state is lost; generated exports should later move to releases/LFS when normal Git tooling is available.
- QA renders that prove deformation or visual gates may be committed because they are review evidence.
- Rendered MP4 previews and disposable workflow artifacts are not committed; the workflows regenerate them.
- Python bytecode, caches, temporary Blender downloads, and generated build directories are ignored.

## Workflow security

Every workflow must:

- use read-only repository permissions unless a documented job needs more;
- pin third-party GitHub Actions to immutable commit SHAs;
- set `persist-credentials: false` on checkout;
- avoid secrets unless genuinely required;
- verify downloaded Blender archives against a documented SHA-256 before extraction;
- avoid hard-coded historical Actions run IDs as durable dependencies;
- upload generated outputs only as short-retention workflow artifacts unless explicitly accepted as source/QA evidence.

## Pipeline

```text
Reference / prototype
  -> editable Blender source
  -> sculpt/material refinement
  -> sculpt metric gate + multi-view QA
  -> rig / skin repair
  -> deformation QA + semantic skinning gate
  -> validated GLB
  -> Remotion / React Three Fiber bone-driven animation
  -> film render
```

## Migration safety

The iOS Blender branches and PR #8 remain untouched until the new repository contains the reconstructed sources and its verification checks pass. PR #8 may then be closed as superseded. Branch deletion is a final cleanup action, not part of the initial migration.

## Current known quality state

The last GitHub sculpt-v3 run generated the candidate but failed its final gate for insufficient muzzle projection and insufficient shoulder-to-waist taper. The later Library skin-repair stage reports that the repaired GLB passes the anatomical body/hoodie/trouser gate and that the earlier shoulder/armpit tearing is no longer present in the accepted hybrid weighting pass. The editable Blender repair still needs an authoritative Blender-side execution and deformation render verification.
