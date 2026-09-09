# Living World Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first playable slice of an immersive personal 3D world: a cinematic central hub that the player can explore, interact with, and use to enter a procedural digital district.

**Architecture:** React + TypeScript + Vite hosts a React Three Fiber scene. Zustand owns persistent world state; Rapier owns physical interactions; scene systems are split by responsibility so future districts can be added without rewriting the hub. DOM UI remains separate from the WebGL canvas for accessibility and mobile controls.

**Tech Stack:** React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Rapier, Zustand, GSAP, postprocessing, GLB/glTF.

**Spec:** The approved Living World design in the conversation: a cinematic, explorable representation of the user's past/present/future, beginning with a vertical slice containing a central hub, player, interactive objects, memory/project/digital portals, procedural digital city, persistent discovery state, cinematic effects, responsive controls, and performance adaptation.

## Global Constraints

- Build the first slice before expanding to the complete life map.
- Do not invent personal biographical facts; personal content must come from supplied context or explicit future data.
- Preserve a clean separation between world rendering, interaction/state, and DOM UI.
- Prefer GLB/glTF for shipped 3D assets.
- Support desktop and iPhone-sized interaction from the first slice.
- Keep WebGPU an enhancement path; retain WebGL compatibility.

---

### Task 1: Establish the application foundation

**Files:**
- Create/modify the existing project entry points after inspecting the repository structure.
- Create: `src/world/World.tsx`
- Create: `src/world/state/worldStore.ts`
- Create: `src/world/types.ts`

**Interfaces:**
- `World` renders the active world scene.
- `worldStore` exposes `discoveredIds`, `activeDistrict`, and actions `discover(id: string)` and `enterDistrict(id: string)`.

- [ ] **Step 1: Inspect the repository structure and current package configuration.**
- [ ] **Step 2: Add only the dependencies required by the approved architecture, preserving existing compatible versions where present.**
- [ ] **Step 3: Write state tests covering discovery and district transitions.**
- [ ] **Step 4: Run the focused tests and verify the new state contract passes.**
- [ ] **Step 5: Add the R3F canvas/world shell and verify the app renders an empty scene without runtime errors.**
- [ ] **Step 6: Commit the foundation as `feat: establish living world foundation`.**

### Task 2: Build the central hub

**Files:**
- Create: `src/world/districts/Hub/Hub.tsx`
- Create: `src/world/districts/Hub/HubEnvironment.tsx`
- Create: `src/world/player/PlayerController.tsx`
- Create: `src/world/player/mobileControls.tsx`

**Interfaces:**
- `Hub` is a self-contained district component.
- `PlayerController` exposes exploration and collision behavior to the active scene.

- [ ] **Step 1: Add a small playable hub using procedural geometry so the slice has no dependency on external assets.**
- [ ] **Step 2: Add player movement, camera follow, ground collision, and basic wall collision.**
- [ ] **Step 3: Add desktop keyboard/mouse controls and touch controls sized for iPhone interaction.**
- [ ] **Step 4: Test movement, collision, resize, and touch input in a browser.**
- [ ] **Step 5: Commit as `feat: add playable central hub`.**

### Task 3: Add interaction and portals

**Files:**
- Create: `src/world/interactions/Interactable.tsx`
- Create: `src/world/interactions/InteractionSystem.tsx`
- Create: `src/world/interactions/Portal.tsx`
- Create: `src/ui/HUD.tsx`

**Interfaces:**
- `Interactable` accepts `id`, `label`, and `onInteract`.
- `Portal` accepts `id`, `destination`, and `label`.
- `InteractionSystem` resolves the nearest interactable and dispatches its action.

- [ ] **Step 1: Write interaction tests for nearest-target selection and discovery updates.**
- [ ] **Step 2: Implement ray/proximity interaction detection.**
- [ ] **Step 3: Add visible interaction prompts in the DOM HUD.**
- [ ] **Step 4: Add three hub gateways: Memory, Projects, and Digital City.**
- [ ] **Step 5: Test keyboard, pointer, and touch activation.**
- [ ] **Step 6: Commit as `feat: add world interactions and portals`.**

### Task 4: Build the procedural Digital City

**Files:**
- Create: `src/world/districts/DigitalCity/DigitalCity.tsx`
- Create: `src/world/districts/DigitalCity/CityBlocks.tsx`
- Create: `src/world/districts/DigitalCity/DataStreams.tsx`
- Create: `src/world/districts/DigitalCity/DigitalMaterials.tsx`

**Interfaces:**
- `DigitalCity` renders a deterministic procedural district from a seed.
- `CityBlocks` creates instanced buildings from bounded layout parameters.
- `DataStreams` renders animated data paths.

- [ ] **Step 1: Define a deterministic city seed and bounded district dimensions.**
- [ ] **Step 2: Add instanced procedural buildings and roads to keep draw calls manageable.**
- [ ] **Step 3: Add animated data-stream geometry and restrained emissive materials.**
- [ ] **Step 4: Add landmarks representing generic technology concepts without asserting unsupported personal facts.**
- [ ] **Step 5: Test that identical seeds produce stable layouts and that mobile quality settings reduce instance counts/effects.**
- [ ] **Step 6: Commit as `feat: add procedural digital city`.**

### Task 5: Add cinematic transitions and atmosphere

**Files:**
- Create: `src/world/cinematics/transition.ts`
- Create: `src/world/environment/Atmosphere.tsx`
- Create: `src/world/environment/Lighting.tsx`
- Create: `src/world/audio/WorldAudio.tsx`

**Interfaces:**
- `transitionToDistrict(destination: string)` drives a cancellable scene transition.
- Environment components consume the active district and quality tier.

- [ ] **Step 1: Add a transition state test ensuring only one district is active after completion.**
- [ ] **Step 2: Implement fade/blur/camera movement using GSAP without blocking React state updates.**
- [ ] **Step 3: Add fog, ambient lighting, directional lighting, and subtle environmental motion.**
- [ ] **Step 4: Add spatialized ambient audio with a muted-by-default fallback for browser autoplay restrictions.**
- [ ] **Step 5: Test transitions repeatedly and verify cleanup leaves no duplicate animation loops/listeners.**
- [ ] **Step 6: Commit as `feat: add cinematic world atmosphere`.**

### Task 6: Add performance adaptation

**Files:**
- Create: `src/world/performance/qualityStore.ts`
- Create: `src/world/performance/QualityController.tsx`
- Modify: world/district components to consume the quality tier.

**Interfaces:**
- Quality tiers are `low`, `medium`, and `high`.
- `qualityStore` exposes `tier`, `setTier`, and `autoTune`.

- [ ] **Step 1: Write tests for deterministic quality selection from capability hints.**
- [ ] **Step 2: Implement tiered pixel ratio, shadows, post-processing, fog, and city instance counts.**
- [ ] **Step 3: Add a manual quality override in the HUD/settings surface.**
- [ ] **Step 4: Test on desktop and an iPhone-sized viewport; verify the scene remains navigable at low quality.**
- [ ] **Step 5: Commit as `perf: add adaptive world quality`.**

### Task 7: Integrate personal-world content safely

**Files:**
- Create: `src/world/content/worldContent.ts`
- Create: `src/world/content/contentSchema.ts`
- Create: `src/world/districts/MemoryDistrict/MemoryDistrict.tsx`
- Create: `src/world/districts/ProjectsDistrict/ProjectsDistrict.tsx`

**Interfaces:**
- Content entries have `id`, `title`, `description`, `type`, and optional `destination`.
- Districts consume content entries and never hard-code unsupported personal claims.

- [ ] **Step 1: Define the content schema and validation tests.**
- [ ] **Step 2: Seed only information already established in the project context: technology/software experimentation and project-oriented themes.**
- [ ] **Step 3: Render memory/project placeholders as discoverable artefacts rather than fabricated autobiographical events.**
- [ ] **Step 4: Test that missing optional personal fields do not crash the world.**
- [ ] **Step 5: Commit as `feat: add extensible personal world content`.**

### Task 8: Browser QA and release slice

**Files:**
- Create/modify: browser test configuration and `tests/world/*` as appropriate to the repository.
- Create: `docs/superpowers/verification/living-world.md`

- [ ] **Step 1: Run unit/type/build checks.**
- [ ] **Step 2: Run browser smoke tests covering load, movement, interaction, portal transition, discovery persistence, resize, and mobile controls.**
- [ ] **Step 3: Capture screenshots at desktop and iPhone-sized resolutions and inspect for clipping, unreadable HUD, and rendering regressions.**
- [ ] **Step 4: Measure startup and steady-state frame behavior and reduce any clearly excessive scene cost.**
- [ ] **Step 5: Document verified behavior and known limitations.**
- [ ] **Step 6: Commit as `test: verify living world vertical slice`.**

### Task 9: Review and integration

**Files:**
- All changed files from Tasks 1-8.

- [ ] **Step 1: Review the complete diff for accidental personal-data fabrication, unnecessary dependencies, and architectural coupling.**
- [ ] **Step 2: Run the full available test/build suite again.**
- [ ] **Step 3: Create a pull request from `feature/living-world` into the existing destination branch.**
- [ ] **Step 4: Record the vertical slice as the baseline for future districts and asset integration.**
