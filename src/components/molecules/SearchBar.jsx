import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  placeholder = "Search...",
  onSearch,
  value,
  onChange,
  className,
  showResults = false,
  results = [],
  onResultClick,
  onClear
}) => {
const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [showClearButton, setShowClearButton] = useState(false)
  
  // Use controlled value if provided, otherwise use internal state
  const inputValue = value !== undefined ? value : query
  
const handleChange = (e) => {
    const inputValue = e.target.value
    
    // If using controlled pattern (value + onChange)
    if (value !== undefined && onChange) {
      onChange(inputValue)
    } else {
      // If using callback pattern (onSearch)
      setQuery(inputValue)
      onSearch?.(inputValue)
    }
    
    setShowClearButton(inputValue.length > 0)
  }
  
  const handleClear = () => {
    if (value !== undefined && onChange) {
      onChange("")
    } else {
      setQuery("")
      onSearch?.("")
    }
    onClear?.()
    setShowClearButton(false)
  }
  
const showDropdown = showResults && isFocused && inputValue.length > 0 && results.length > 0
  
  return (
<div className={cn("relative", className)}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <Input
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className={cn(
            "pl-10 bg-white/80 backdrop-blur-sm border-gray-200/60",
            showClearButton && "pr-10"
          )}
        />
        {showClearButton && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-gray-200/60 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.id || index}
              onClick={() => {
                onResultClick?.(result)
handleClear()
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