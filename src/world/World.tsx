import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useWorldStore } from './state/worldStore';
import { DigitalCity } from './districts/DigitalCity/DigitalCity';
import { Hub } from './districts/Hub/Hub';

function HubScene() {
  return (
    <>
      <color attach="background" args={['#060816']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 16, 8]} intensity={1.4} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0d1324" />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[3.2, 4.5, 4, 48]} />
        <meshStandardMaterial color="#28324a" metalness={0.65} roughness={0.25} />
      </mesh>
      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
      <Environment preset="night" />
    </>
  );
}

export function World() {
  const activeDistrict = useWorldStore((state) => state.activeDistrict);
  if (activeDistrict === 'digital-city') return <DigitalCity />;

  return (
    <main style={{ position: 'fixed', inset: 0, background: '#060816' }}>
      <Canvas shadows camera={{ position: [14, 10, 14], fov: 50 }}>
        <HubScene />
      </Canvas>
      <Hub />
      <div style={{ position: 'absolute', top: 18, left: 18, color: 'white', fontFamily: 'system-ui', letterSpacing: '.08em' }}>
        THE LIVING WORLD
      </div>
    </main>
  );
}
