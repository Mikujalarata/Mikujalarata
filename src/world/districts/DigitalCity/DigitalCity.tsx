import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { useMemo } from 'react';

function City() {
  const buildings = useMemo(() => Array.from({ length: 64 }, (_, i) => {
    const x = (i % 8 - 3.5) * 5;
    const z = (Math.floor(i / 8) - 3.5) * 5;
    const height = 2 + ((i * 17) % 7);
    return { x, z, height };
  }), []);

  return (
    <>
      <color attach="background" args={['#050711']} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[8, 14, 6]} intensity={1.5} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
      {buildings.map(({ x, z, height }) => (
        <mesh key={`${x}:${z}`} position={[x, height / 2, z]} castShadow>
          <boxGeometry args={[3.5, height, 3.5]} />
          <meshStandardMaterial color="#243047" metalness={0.55} roughness={0.32} />
        </mesh>
      ))}
      <Sparkles count={180} scale={[40, 18, 40]} size={1.2} speed={0.35} />
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.05} />
    </>
  );
}

export function DigitalCity() {
  return <Canvas shadows camera={{ position: [18, 14, 18], fov: 52 }}><City /></Canvas>;
}
