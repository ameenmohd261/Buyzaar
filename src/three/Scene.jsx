import { Canvas } from '@react-three/fiber'
import { Environment, PresentationControls, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'

const Scene = ({ children }) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 4], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        
        <PresentationControls
          global
          zoom={0.8}
          rotation={[0, -Math.PI / 6, 0]}
          polar={[-Math.PI / 6, Math.PI / 6]}
          azimuth={[-Math.PI / 6, Math.PI / 6]}
        >
          <group dispose={null}>
            {children}
          </group>
        </PresentationControls>
        
        <ContactShadows 
          position={[0, -1.5, 0]} 
          opacity={0.6} 
          scale={10} 
          blur={1.5} 
          far={1.5} 
        />
      </Suspense>
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
      />
    </Canvas>
  )
}

export default Scene