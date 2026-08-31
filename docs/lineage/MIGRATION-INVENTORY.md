# Migration inventory

This document records the authoritative sources used to reconstruct the standalone 3D animation workspace.

## GitHub sources

### `rajalarata/ios` PR #7 — Blender production rat asset

- State: closed, not merged, superseded by PR #8
- Branch: `blender-rat-step1`
- Head SHA: `e724aa973438d63055c18b26784ca1f9bc9aab87`
- Purpose: prove the Blender production pipeline and create the validated pass-2 asset.
- Important source files:
  - `build_rat.py`
  - `refine_rat.py`
  - `render_rat_video.py`
  - `render_rat_video_workbench.py`
  - `validate_manifest.py`
  - initial `refine_rat_v3.py` / `validate_sculpt_v3.py`
- Successful source artifact run: `33322128755`

### `rajalarata/ios` PR #8 — Blender rat sculpt v3 quality gate

- State: open, draft, not merged
- Branch: `blender-rat-sculpt-v3-clean`
- Head SHA: `94756e2da1d694cef738fd7f643f2bf67b797b59`
- Candidate workflow run: `33328424989`
- Candidate artifact: `9736989984` (`blender-rat-sculpt-v3-candidate`)
- Candidate `.blend` SHA-256: `69aad297b69d6db1621e9fbe5cd975b530968b605424ab627e3c7a19b654ea3d`
- Candidate `.glb` SHA-256: `da6ed76cd9f4c189bd416975b7bf442de433ddaca9acebbf65cd5dd469d4d549`
- Final sculpt gate state: failed for insufficient muzzle projection and insufficient shoulder-to-waist taper. The validator must not be weakened to make this pass.
- Important source files:
  - `diagnose_rat_metric_space.py`
  - `refine_rat_v3.py`
  - `refine_rat_v3_world.py`
  - `validate_sculpt_v3.py`

## Library sources

### Rat + Dog film v3

Artifact: `remotion-rat-dog-film-v3.zip`

Contains the newest coherent Remotion/React Three Fiber film source, including deterministic performance math, articulated Rat and Dog React rigs, cinematic camera, stage/lighting, tests and render configuration.

Verification on 31 August 2026: `node --test src/animation.test.mjs src/performance.test.mjs src/remotion-contract.test.mjs` passed all 18 tests.

### Rat skin repair stage

Artifact: `rat-skin-repair-stage.zip`

Contains:

- `rat-production-v3-input.blend`
- `repair_skin_weights_blender.py`
- `validate_skin_semantics_v3.py`
- `rat-production-v3-skin-repair.glb`
- four deformation QA renders
- `STATUS.md`
- `SHA256SUMS.txt`

The Library input `.blend` SHA-256 is `69aad297b69d6db1621e9fbe5cd975b530968b605424ab627e3c7a19b654ea3d`, exactly identical to the PR #8 candidate `.blend`. This proves that the authoritative editable source is recoverable from the GitHub production lineage rather than existing only in Library state.

The repaired GLB was revalidated locally on 31 August 2026. All anatomical body/head/chest/arms/legs, hoodie torso/sleeves and trouser waist/legs thresholds passed; all four skinned meshes had effectively zero weight-sum error.

### Production Rat runtime contract

- `ProductionRatGLB.tsx`
- `rat-production-rigged.manifest.json`
- earlier `rat-production-rigged.glb`

The manifest defines a 31-bone production rig with body, hoodie, trousers and six-bone tail skinning plus facial, eye, brow and ear controls. `ProductionRatGLB.tsx` is the runtime bridge that maps Remotion performance poses to named GLB bones.

### Rat + Dog visual reference

- `Rat and Dog Character Turnaround Sheet.png`

Contains Rat and Dog character identity, palette, expressions and front/three-quarter/side/back turnaround references.

## Generated outputs intentionally not treated as source

Rendered MP4 previews, temporary Blender downloads and disposable workflow artifacts remain reproducible outputs rather than repository source. Accepted QA images are evidence and may be versioned when practical.

## Connector limitation during migration

The connected GitHub write API accepts UTF-8 files and explicit blob content but does not accept a local container file reference for large binary assets. Therefore large `.blend`/`.glb` files must not be falsely represented as migrated until a binary-capable path is used. The exact source hashes and GitHub artifact provenance above ensure the state can be recovered without ambiguity.
