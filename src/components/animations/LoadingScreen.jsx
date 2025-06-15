import { motion } from 'framer-motion'
import '../../styles/LoadingScreen.css';
import React from 'react';
// Cute character animation component
const CuteCharacter = () => {
  return (
    <motion.div 
      className="absolute bottom-20"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
    >
      <motion.div 
        className="w-16 h-16 bg-primary rounded-full flex items-center justify-center relative"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Eyes */}
        <div className="absolute flex w-full justify-center space-x-4 top-3">
          <motion.div 
            className="w-2 h-3 bg-white rounded-full"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
          <motion.div 
            className="w-2 h-3 bg-white rounded-full"
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
        </div>
        {/* Smile */}
        <div className="absolute w-6 h-3 border-b-2 border-white rounded-md bottom-3" />
      </motion.div>
    </motion.div>
  );
};
const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <motion.div
        className="mb-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-20 h-20 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
          <span className="font-sora font-bold text-white text-4xl">B</span>
        </div>
      </motion.div>
      
      <motion.div
        className="w-48 h-1 bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            delay: 0.4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </motion.div>
      
      <motion.p
        className="mt-6 text-text-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        Loading Buyzaar...
      </motion.p>
    </div>
  )
}

export default LoadingScreen