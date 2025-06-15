import React from 'react'

const Card = React.forwardRef(({
  className = "",
  children,
  bordered = false,
  glassmorph = true,
  hover = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`
        ${glassmorph ? 'glassmorphism' : 'bg-white/5'}
        ${bordered ? 'border border-white/10' : ''}
        ${hover ? 'transition-all duration-300 hover:border-primary/30 card-hover' : ''}
        rounded-xl overflow-hidden
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export const CardHeader = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardTitle = ({ className = "", children, ...props }) => {
  return (
    <h3 className={`text-xl font-bold ${className}`} {...props}>
      {children}
    </h3>
  )
}

export const CardDescription = ({ className = "", children, ...props }) => {
  return (
    <p className={`text-text-secondary mt-1 ${className}`} {...props}>
      {children}
    </p>
  )
}

export const CardContent = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

export const CardFooter = ({ className = "", children, ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card