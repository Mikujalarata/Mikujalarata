import React from 'react';
import {Box, Cone, SoftSphere, Torus} from './Primitives';
type Cue = {section: string; key: number; rim: number; floorGlow: number; ratAccent: number; dogAccent: number};

export const FilmStage3D: React.FC<{cue: Cue; frame: number}> = ({cue, frame}) => {
  const flicker = 0.92 + Math.sin(frame * 0.071) * 0.04 + Math.sin(frame * 0.023 + 1.7) * 0.025;
  return (
    <>
      <color attach="background" args={['#050812']} />
      <fog attach="fog" args={['#070b16', 7.2, 17.5]} />
      <ambientLight intensity={0.17} />
      <hemisphereLight args={['#a9c8ff', '#32111d', 0.72]} />
      <directionalLight position={[0.2, 6.8, 4.8]} intensity={1.55 * cue.key} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
      <spotLight position={[-5.3, 7.4, 3.8]} color={'#58a9ff'} intensity={98 * cue.ratAccent * flicker} distance={18} angle={0.34} penumbra={0.83} castShadow />
      <spotLight position={[5.3, 7.1, 3.6]} color={'#ff5f8f'} intensity={94 * cue.dogAccent * flicker} distance={18} angle={0.35} penumbra={0.84} castShadow />
      <spotLight position={[0, 6.1, -1.0]} color={'#d7c5ff'} intensity={62 * cue.rim} distance={13} angle={0.38} penumbra={0.9} />
      <pointLight position={[0, 1.8, 1.6]} color={'#e8dcff'} intensity={6.5 * cue.key} distance={7} />

      <mesh position={[0, -1.24, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshPhysicalMaterial color={'#121724'} roughness={0.22} metalness={0.33} clearcoat={0.35} clearcoatRoughness={0.28} />
      </mesh>
      <mesh position={[0, 3.0, -4.35]} receiveShadow>
        <planeGeometry args={[16, 9.5]} />
        <meshStandardMaterial color={'#070a13'} roughness={0.98} />
      </mesh>

      <Torus color={'#4ba2ff'} radius={1.55} tube={0.035} position={[-3.3, 2.25, -4.0]} emissive={'#4ba2ff'} emissiveIntensity={1.7 * cue.ratAccent} />
      <Torus color={'#ff5e8b'} radius={1.40} tube={0.035} position={[3.35, 2.35, -4.0]} emissive={'#ff5e8b'} emissiveIntensity={1.65 * cue.dogAccent} />
      <Torus color={'#b392ff'} radius={0.64} tube={0.024} position={[0, 3.15, -4.05]} emissive={'#b392ff'} emissiveIntensity={1.4 * cue.rim} />

      <Cone color={'#4da9ff'} radius={1.25} height={6.8} position={[-4.4, 3.5, 0.3]} rotation={[0.12, 0, -0.62]} opacity={0.055 * cue.ratAccent} emissive={'#4da9ff'} emissiveIntensity={0.65} />
      <Cone color={'#ff5e8b'} radius={1.25} height={6.8} position={[4.4, 3.5, 0.3]} rotation={[0.12, 0, 0.62]} opacity={0.05 * cue.dogAccent} emissive={'#ff5e8b'} emissiveIntensity={0.65} />

      {[-5.2, -4.45, 4.45, 5.2].map((x, i) => (
        <group key={x} position={[x, 0, -3.55]}>
          <Box color={'#182038'} size={[0.28, 4.2, 0.28]} position={[0, 0.82, 0]} metalness={0.42} roughness={0.38} />
          {Array.from({length: 7}).map((_, j) => (
            <SoftSphere key={j} color={i < 2 ? '#69b5ff' : '#ff718f'} radius={0.075} position={[0, -0.72 + j * 0.54, 0.20]}
              emissive={i < 2 ? '#69b5ff' : '#ff718f'} emissiveIntensity={(1.5 + cue.floorGlow) * flicker} roughness={0.22} />
          ))}
        </group>
      ))}

      {[-2.7, -1.35, 0, 1.35, 2.7].map((x, i) => (
        <SoftSphere key={x} color={i % 2 ? '#9a7cff' : '#67b7ff'} radius={0.045} position={[x, -1.17, 0.6]} emissive={i % 2 ? '#9a7cff' : '#67b7ff'} emissiveIntensity={2.0 * cue.floorGlow} roughness={0.20} />
      ))}
    </>
  );
};
