import React from 'react'
import { motion } from 'framer-motion'


// Button variants
const variants = {
  primary: "button-primary",
  secondary: "button-secondary",
  outline: "border border-white/20 bg-transparent hover:bg-white/10 text-white",
  ghost: "bg-transparent hover:bg-white/10 text-white",
  icon: "p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
}

// Button sizes
const sizes = {
  sm: "py-1.5 px-3 text-sm",
  md: "py-2.5 px-5",
  lg: "py-3 px-6 text-lg",
  xl: "py-4 px-8 text-lg"
}

const Button = React.forwardRef(({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  onClick,
  ...props
}, ref) => {
  
  const buttonClass = `
    ${variants[variant]} 
    ${sizes[size]} 
    inline-flex items-center justify-center rounded-lg font-medium transition-all
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
    ${className}
  `
  
  return (
    <motion.button
      ref={ref}
      className={buttonClass}
      onClick={!disabled && !isLoading ? onClick : undefined}
      whileTap={{ scale: !disabled && !isLoading ? 0.98 : 1 }}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button