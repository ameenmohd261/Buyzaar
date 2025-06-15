import { motion } from 'framer-motion'

// Page transition component for smooth transitions between routes
const PageTransition = ({ children }) => {
  const variants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  }

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: 'tween',
        duration: 0.3
      }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition