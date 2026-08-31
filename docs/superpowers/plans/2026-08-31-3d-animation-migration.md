# 3D Animation Repository Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct the existing Rat + Dog 3D character, Blender, rigging, validation, Remotion and film work as a clean standalone repository while preserving the latest accepted state and keeping `rajalarata/ios` unchanged until verification succeeds.

**Architecture:** Treat characters, reusable 3D pipeline tooling, and film/runtime integration as separate boundaries. Preserve authoritative Blender source and accepted QA evidence, while generated videos remain reproducible outputs rather than repository source.

**Tech Stack:** Blender 4.5 LTS, Python 3, glTF/GLB, React, TypeScript, Three.js, `@react-three/fiber`, Remotion, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-31-3d-animation-migration-design.md`

## Global Constraints

- The current repository container is `Mikujalarata/Mikujalarata`; rename to `3d-animation` only after verification.
- Do not modify or close the iOS Blender PR/branches until the reconstructed repository is verified.
- Do not commit credentials or persistent GitHub checkout credentials.
- Pin all GitHub Actions to immutable SHAs.
- Keep generated MP4s and temporary build artifacts out of Git history.
- Preserve the newest Library-only Blender skin-repair stage and its QA evidence.

---

### Task 1: Establish repository boundaries and provenance

**Files:**
- Modify: `README.md`
- Create: `.gitignore`
- Create: `docs/lineage/MIGRATION-INVENTORY.md`
- Create: `docs/PIPELINE.md`

**Interfaces:**
- Consumes: approved migration design.
- Produces: authoritative directory map and source lineage for all later tasks.

- [ ] Replace the placeholder README with the repository purpose, scope boundaries, character/film/pipeline layout, and current migration status.
- [ ] Add ignore rules for Blender temp files, Python caches, node modules, build outputs, downloaded Blender runtimes and rendered videos.
- [ ] Record exact GitHub branch/PR SHAs and Library artifact names that contributed to the migration.
- [ ] Document the reference -> Blender -> sculpt -> rig -> validation -> GLB -> Remotion film pipeline.
- [ ] Verify the docs contain no iOS implementation material or secrets.
- [ ] Commit the repository-boundary documentation.

### Task 2: Import the latest Rat + Dog film runtime

**Files:**
- Create: `films/rat-dog/package.json`
- Create: `films/rat-dog/tsconfig.json`
- Create: `films/rat-dog/remotion.config.ts`
- Create: `films/rat-dog/src/**`
- Create: `films/rat-dog/scripts/**`
- Create: `films/rat-dog/public/models/{rat-character.glb,dog-character.glb}`
- Create: `films/rat-dog/README.md`
- Create: `films/rat-dog/docs/ARCHITECTURE.md`

**Interfaces:**
- Consumes: Library `remotion-rat-dog-film-v3.zip`.
- Produces: deterministic performance/camera/film runtime and prototype model contract.

- [ ] Import the v3 source tree without generated `out/` content.
- [ ] Preserve animation, performance and Remotion contract tests.
- [ ] Preserve the prototype Rat and Dog GLBs used by the film.
- [ ] Run `node --test src/*.test.mjs` from `films/rat-dog` and record the result.
- [ ] Compile the Python helper scripts with `python -m py_compile`.
- [ ] Commit the verified film runtime.

### Task 3: Import Blender Rat build and sculpt lineage

**Files:**
- Create: `characters/rat/blender/build_rat.py`
- Create: `characters/rat/blender/refine_rat.py`
- Create: `characters/rat/blender/refine_rat_v3.py`
- Create: `characters/rat/blender/refine_rat_v3_world.py`
- Create: `characters/rat/blender/render_rat_video.py`
- Create: `characters/rat/blender/render_rat_video_workbench.py`
- Create: `characters/rat/validation/validate_manifest.py`
- Create: `characters/rat/validation/validate_sculpt_v3.py`
- Create: `characters/rat/validation/diagnose_rat_v3.py`
- Create: `characters/rat/validation/test_diagnose_rat_v3.py`

**Interfaces:**
- Consumes: PR #7 and PR #8 branch heads from `rajalarata/ios`.
- Produces: reconstructable Blender character generation/refinement and sculpt QA tooling.

- [ ] Copy the original build/render scripts from `blender-rat-step1`.
- [ ] Overlay the newer sculpt-v3/world-space and diagnostic code from `blender-rat-sculpt-v3-clean`.
- [ ] Run `python -m py_compile` over every imported Python module.
- [ ] Run the diagnostic unit test directly with Python.
- [ ] Record the last known GitHub sculpt gate failure (muzzle projection and torso taper) in the Rat status document rather than weakening the validator.
- [ ] Commit the Blender build/sculpt lineage.

### Task 4: Preserve and verify the newest skin-repair stage

**Files:**
- Create: `characters/rat/blender/rat-production-v3-input.blend`
- Create: `characters/rat/rigging/repair_skin_weights_blender.py`
- Create: `characters/rat/validation/validate_skin_semantics_v3.py`
- Create: `characters/rat/exports/rat-production-v3-skin-repair.glb`
- Create: `characters/rat/qa/skin-repair/*.png`
- Create: `characters/rat/STATUS.md`
- Create: `characters/rat/SHA256SUMS.txt`

**Interfaces:**
- Consumes: Library `rat-skin-repair-stage.zip`.
- Produces: preserved editable source, repaired migration snapshot, deformation evidence and executable semantic gate.

- [ ] Import the editable `.blend`, repaired GLB, repair script, validator, four QA images, status and checksums; exclude `__pycache__` and `.pyc` files.
- [ ] Verify the imported binary files against the supplied SHA256 manifest where covered.
- [ ] Run `python -m py_compile` on the repair and validation scripts.
- [ ] Run `validate_skin_semantics_v3.py` against the repaired GLB and require a passing result.
- [ ] Preserve the status caveat that Blender-side execution/render verification remains outstanding.
- [ ] Commit the verified migration snapshot.

### Task 5: Preserve production Rat runtime integration and character references

**Files:**
- Create: `characters/rat/runtime/ProductionRatGLB.tsx`
- Create: `characters/rat/exports/rat-production-rigged.glb`
- Create: `characters/rat/exports/rat-production-rigged.manifest.json`
- Create: `characters/reference/rat-dog-character-turnaround.png`

**Interfaces:**
- Consumes: Library production-rig artifacts and Rat + Dog turnaround art.
- Produces: production skeleton contract and visual source reference.

- [ ] Import `ProductionRatGLB.tsx` and its referenced rig snapshot/manifest.
- [ ] Import the Rat + Dog turnaround reference sheet.
- [ ] Document that the skin-repair GLB is newer than the earlier rig snapshot and is the preferred repair lineage until Blender-side reproduction is completed.
- [ ] Commit the runtime/reference assets.

### Task 6: Replace historical Blender workflows with secure standalone workflows

**Files:**
- Create: `.github/workflows/validate.yml`
- Create: `.github/workflows/blender-rat.yml`
- Create: `.github/dependabot.yml`
- Create: `scripts/verify_blender_download.py`

**Interfaces:**
- Consumes: imported pipeline paths and character validators.
- Produces: repository-local verification with no dependency on historical iOS Actions run IDs.

- [ ] Add a fast validation workflow that checks Python compilation, semantic validator tests, Node performance tests and source hygiene.
- [ ] Pin checkout/upload/download actions to immutable commit SHAs and set `persist-credentials: false`.
- [ ] Give workflows only `contents: read` unless artifact download requires `actions: read`.
- [ ] Add a Blender workflow that starts from the committed editable Rat `.blend` rather than downloading an artifact from `rajalarata/ios`.
- [ ] Download Blender 4.5.13 LTS only after verifying its documented SHA-256 in `verify_blender_download.py`.
- [ ] Keep generated GLBs/renders/videos as short-retention Actions artifacts.
- [ ] Add Dependabot for GitHub Actions.
- [ ] Commit workflow hardening.

### Task 7: Repository-level verification and migration PR

**Files:**
- Update: `docs/lineage/MIGRATION-INVENTORY.md`
- Update: `characters/rat/STATUS.md`

**Interfaces:**
- Consumes: all reconstructed project source.
- Produces: reviewable migration PR and evidence that it supersedes the mixed iOS branches.

- [ ] Run all local tests that do not require Blender.
- [ ] Open a migration PR in `Mikujalarata/Mikujalarata` from `migration/3d-animation` to `main`.
- [ ] Let GitHub Actions run and inspect every job result/log.
- [ ] Fix failures without weakening quality gates.
- [ ] Update the migration inventory with the verified head SHA and CI results.
- [ ] Mark the migration PR ready only after required checks pass.

### Task 8: Retire Blender work from the iOS repository after verification

**Files:**
- No iOS main files should require deletion because the Blender PRs were not merged.

**Interfaces:**
- Consumes: verified standalone repository migration.
- Produces: clean separation between ProofLedger/iOS and 3D animation development.

- [ ] Add a final comment/body update to iOS PR #8 identifying the standalone migration that supersedes it.
- [ ] Close PR #8 without merging.
- [ ] Keep branch deletion as a separate final cleanup action only after confirming no unique source remains on either Blender branch.
- [ ] Verify `rajalarata/ios` main contains no Blender/Remotion experiment files.
- [ ] Record the final separation in both repositories' documentation.
