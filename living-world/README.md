# The Living World

First playable vertical slice of the immersive personal 3D world.

## Current slice

- Central futuristic hub
- Procedural skyline and floating data field
- Three interactive gateways: Memories, Projects, Digital City
- Orbit exploration plus WASD/arrow movement
- Touch joystick and mobile interaction button
- Cinematic fade transition
- Adaptive renderer pixel ratio on smaller screens
- No fabricated autobiographical content

## Run

Open `index.html` from a static web server. The scene loads Three.js from a public CDN and requires no local build toolchain.

## Direction

This is intentionally a lightweight playable foundation. The next iterations can move the renderer into React Three Fiber, add Rapier physics, GLB character/asset integration, persistent world state, procedural districts, audio, WebXR, and automated browser QA without changing the world concept.
