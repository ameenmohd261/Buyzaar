import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useUserStore } from '../store/userStore'

const Avatar = ({ viewMode = 'front' }) => {
  const group = useRef()
  const { avatarData } = useUserStore()
  
  // In a real app, you would load the user's actual avatar model
  // For now, we're using a placeholder model
  const { scene, animations } = useGLTF('/assets/models/avatar.glb')
  const { actions, names } = useAnimations(animations, group)
  
  // Set rotation based on viewMode
  useFrame(() => {
    if (!group.current) return
    
    let targetRotation = 0
    
    if (viewMode === 'side') {
      targetRotation = Math.PI / 2 // 90 degrees
    } else if (viewMode === 'back') {
      targetRotation = Math.PI // 180 degrees
    }
    
    // Smoothly rotate to target
    group.current.rotation.y = group.current.rotation.y + (targetRotation - group.current.rotation.y) * 0.1
  })
  
  // Play idle animation
  useFrame(() => {
    if (names.includes('Idle')) {
      actions['Idle'].play()
    }
  }, [])

  return (
    <group ref={group}>
      <primitive 
        object={scene.clone()} 
        scale={1} 
        position={[0, -1, 0]}
      />
    </group>
  )
}

export default Avatar