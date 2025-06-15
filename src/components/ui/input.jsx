import React from 'react'

const Input = React.forwardRef(({
  label,
  error,
  className = "",
  id,
  helpText,
  leftIcon,
  rightIcon,
  type = "text",
  ...props
}, ref) => {
  // Generate ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`
  
  return (
    <div className={className}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            input-field w-full
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-error focus:ring-error/30' : 'border-white/10 focus:ring-primary/50'}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helpText) && (
        <div className="mt-1 text-sm">
          {error ? (
            <p className="text-error">{error}</p>
          ) : helpText ? (
            <p className="text-text-secondary">{helpText}</p>
          ) : null}
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input