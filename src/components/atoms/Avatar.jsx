import { cn } from "@/utils/cn"

const Avatar = ({ 
  src, 
  alt, 
  name,
  size = "default",
  className 
}) => {
  const sizes = {
    sm: "w-6 h-6 text-xs",
    default: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg"
  }
  
  const getInitials = (name) => {
    if (!name) return "?"
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  
  const getGradientClass = (name) => {
    const gradients = [
      "from-blue-400 to-blue-600",
      "from-purple-400 to-purple-600", 
      "from-green-400 to-green-600",
      "from-amber-400 to-amber-600",
      "from-red-400 to-red-600",
      "from-indigo-400 to-indigo-600"
    ]
    
    const index = name ? name.length % gradients.length : 0
    return gradients[index]
  }
  
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
      />
    )
  }
  
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br text-white font-semibold flex items-center justify-center",
        sizes[size],
        `bg-gradient-to-br ${getGradientClass(name)}`,
        className
      )}
    >
      {getInitials(name)}
    </div>
  )
}

export default Avatar