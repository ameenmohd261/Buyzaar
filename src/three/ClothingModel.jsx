import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const ClothingModel = ({ clothing, color }) => {
  const group = useRef()
  
  // In a real app, you would load the specific clothing model
  // For now, we're using a placeholder model based on the product type
  const modelPath = `/assets/models/${clothing.type || 'shirt'}.glb`
  const { scene } = useGLTF(modelPath)
  
  // Apply the selected color to the model
  useEffect(() => {
    if (!scene) return
    
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone the material to avoid modifying the cached material
        child.material = child.material.clone()
        
        if (color) {
          child.material.color = new THREE.Color(color)
        }
      }
    })
  }, [scene, color])
  
  // Gentle rotation for better preview
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.003
    }
  })

  return (
    <group ref={group}>
      <primitive 
        object={scene.clone()} 
        scale={1} 
        position={[0, -0.5, 0]}
      />
    </group>
  )
}

export default ClothingModel