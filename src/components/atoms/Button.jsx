import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  disabled = false,
  onClick,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md",
    secondary: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-300 hover:from-gray-100 hover:to-gray-200 focus:ring-gray-500",
    accent: "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 focus:ring-amber-500 shadow-sm hover:shadow-md",
    success: "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-sm hover:shadow-md",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-sm hover:shadow-md"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  return (
<button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      ref={ref}
      onClick={typeof onClick === 'function' ? onClick : undefined}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button