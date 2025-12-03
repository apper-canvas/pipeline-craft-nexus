import { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const SearchBar = ({ 
  placeholder = "Search...",
  onSearch,
  className,
  showResults = false,
  results = [],
  onResultClick
}) => {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  
  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }
  
  const showDropdown = showResults && isFocused && query.length > 0 && results.length > 0
  
  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <Input
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200/60"
        />
      </div>
      
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.id || index}
              onClick={() => {
                onResultClick?.(result)
                setQuery("")
                setIsFocused(false)
              }}
              className="w-full px-4 py-3 text-left hover:bg-blue-50/80 flex items-center space-x-3 transition-colors"
            >
              <div className="text-sm">
                <div className="font-medium text-gray-900">{result.name}</div>
                {result.company && (
                  <div className="text-gray-500">{result.company}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar