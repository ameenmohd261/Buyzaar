import { motion } from 'framer-motion'
import '../styles/HoverCard.css'

// Animated card component with hover effects
const HoverCard = ({ 
  children, 
  className = "", 
  hoverScale = 1.03, 
  hoverGlow = false,
  clickScale = 0.98
}) => {
  return (
    <motion.div
      className={`${className} ${hoverGlow ? 'hover-glow' : ''}`}
      whileHover={{ 
        scale: hoverScale, 
        y: -5,
        transition: { type: 'spring', stiffness: 300 }
      }}
      whileTap={{ 
        scale: clickScale,
        transition: { type: 'spring', stiffness: 500, damping: 10 }
      }}
    >
      {children}
    </motion.div>
  )
}

export const GlassmorphicCard = ({ children, className = "", ...props }) => {
  return (
    <HoverCard 
      className={`glassmorphism overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </HoverCard>
  )
}

export default HoverCard
