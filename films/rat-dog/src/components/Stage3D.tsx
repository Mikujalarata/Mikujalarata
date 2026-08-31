import React from 'react';
import {SoftSphere, Torus, Box} from './Primitives';

export const Stage3D: React.FC<{frame: number}> = ({frame}) => {
  const pulse = 0.7 + Math.sin(frame * 0.08) * 0.22;
  return (
    <>
      <fog attach="fog" args={['#080b16', 7.5, 18]} />
      <ambientLight intensity={0.28} />
      <hemisphereLight args={['#9db4ff', '#2a1522', 0.9]} />
      <directionalLight position={[0, 6, 5]} intensity={1.8} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <spotLight position={[-5, 7, 4]} color={'#75b9ff'} intensity={110} distance={18} angle={0.34} penumbra={0.8} castShadow />
      <spotLight position={[5, 6, 3]} color={'#ff769f'} intensity={95} distance={18} angle={0.36} penumbra={0.85} castShadow />
      <pointLight position={[0, 3, -2]} color={'#b793ff'} intensity={18 + pulse * 10} distance={9} />

      <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 11]} />
        <meshPhysicalMaterial color={'#171a29'} roughness={0.26} metalness={0.28} clearcoat={0.28} clearcoatRoughness={0.35} />
      </mesh>

      <mesh position={[0, 2.9, -4.2]} receiveShadow>
        <planeGeometry args={[15, 9]} />
        <meshStandardMaterial color={'#090c18'} roughness={0.95} />
      </mesh>

      <Torus color={'#50a7ff'} radius={1.55} tube={0.032} position={[-3.2, 2.2, -3.7]} scale={[1, 1, 1]} emissive={'#50a7ff'} emissiveIntensity={1.5} />
      <Torus color={'#ff5e8d'} radius={1.25} tube={0.032} position={[3.3, 2.5, -3.6]} scale={[1, 1, 1]} emissive={'#ff5e8d'} emissiveIntensity={1.4} />

      {[-5.2, -4.3, 4.3, 5.2].map((x, i) => (
        <group key={x} position={[x, 0, -3.35]}>
          <Box color={'#171e33'} size={[0.34, 3.9, 0.34]} position={[0, 0.75, 0]} metalness={0.4} roughness={0.4} />
          {Array.from({length: 6}).map((_, j) => (
            <SoftSphere
              key={j}
              color={i < 2 ? '#6bb4ff' : '#ff708e'}
              radius={0.1}
              position={[0, -0.65 + j * 0.55, 0.22]}
              emissive={i < 2 ? '#6bb4ff' : '#ff708e'}
              emissiveIntensity={1.8 + pulse}
              roughness={0.25}
            />
          ))}
        </group>
      ))}
    </>
  );
};
