import { motion } from 'framer-motion'

const LoadingSpinner = ({ size = 40 }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 border-t-2 border-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 border-t-2 border-accent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  )
}

export default LoadingSpinner