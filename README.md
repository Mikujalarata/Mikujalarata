# 3D Animation

Standalone 3D character-production and animation workspace for the Mikujalarata organization.

> Migration note: the GitHub connector cannot create or rename repositories, so this work is staged in `Mikujalarata/Mikujalarata`. After verification, rename this repository to `3d-animation` in GitHub.

## Scope

This repository owns:

- Rat and Dog character development and references
- Blender modelling, sculpting, materials, rigging and skin-weight repair
- automated sculpt, rig and deformation validation
- GLB/glTF production contracts
- React Three Fiber / Remotion deterministic character animation
- Rat + Dog film compositions, camera and lighting systems
- QA evidence and reproducible rendering workflows

It does **not** own ProofLedger/iOS application code. Unrelated VR/photogrammetry experiments and image-only concepts remain separate until they genuinely share this pipeline.

## Architecture

```text
characters/
  rat/
    blender/       # editable/source-oriented Blender automation
    rigging/       # skin/weight repair tooling
    validation/    # metric and anatomical quality gates
    runtime/       # production GLB integration contract
    qa/            # accepted review evidence
  dog/             # dog production character work as it matures
films/
  rat-dog/         # Remotion + React Three Fiber film runtime
pipeline/          # reusable 3D pipeline tooling
docs/
  lineage/         # migration provenance and source history
.github/workflows/ # standalone CI/render/Blender validation
```

## Verified migration state

As of 31 August 2026:

- all 18 Rat + Dog v3 animation/performance/Remotion architecture tests pass locally;
- all recovered Python helper and skin-repair scripts compile;
- the repaired Rat GLB passes the complete anatomical body/hoodie/trouser skinning gate;
- the editable `rat-production-v3-input.blend` in the Library is SHA-256 `69aad297b69d6db1621e9fbe5cd975b530968b605424ab627e3c7a19b654ea3d`, exactly identical to the `.blend` produced by GitHub Actions run `33328424989` / artifact `9736989984` on iOS PR #8;
- PR #8 remains open/draft in `rajalarata/ios` until the standalone migration is fully verified.

## Source lineage

The reconstruction combines:

- `rajalarata/ios` closed PR #7 / `blender-rat-step1`
- `rajalarata/ios` draft PR #8 / `blender-rat-sculpt-v3-clean`
- Library `remotion-rat-dog-film-v3.zip`
- Library `rat-skin-repair-stage.zip`
- Library `ProductionRatGLB.tsx` and rig manifest
- Rat + Dog reference/turnaround artwork

See `docs/lineage/MIGRATION-INVENTORY.md` and `docs/PIPELINE.md` for exact details.
