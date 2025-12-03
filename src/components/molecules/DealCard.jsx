import { useState } from "react"
import Avatar from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatCurrency, getDaysInStage } from "@/utils/formatters"
import { STAGE_COLORS } from "@/utils/constants"
import { cn } from "@/utils/cn"

const DealCard = ({ 
  deal, 
  contact,
  onCardClick,
  isDragging = false,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false)
  
  const daysInStage = getDaysInStage(deal.movedToStageAt)
  const stageColor = STAGE_COLORS[deal.stage]
  
  return (
    <div
      className={cn(
        "deal-card p-4 cursor-pointer select-none transition-all duration-200",
        `stage-${stageColor}`,
        isDragging && "opacity-50 transform rotate-2",
        isHovered && "transform -translate-y-1 shadow-lg",
        className
      )}
      onClick={() => onCardClick?.(deal, contact)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3 mb-3">
        <Avatar 
          name={contact?.name} 
          size="default"
          className="flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate text-sm">
            {contact?.name || "Unknown Contact"}
          </h4>
          <p className="text-xs text-gray-500 truncate">
            {contact?.company || "No Company"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold text-gray-900">
          {formatCurrency(deal.value)}
        </div>
        {daysInStage > 0 && (
          <Badge 
            variant={daysInStage > 30 ? "red" : daysInStage > 14 ? "yellow" : "green"}
            size="sm"
          >
            {daysInStage}d
          </Badge>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{deal.title}</span>
        <div className="flex items-center space-x-1">
          <ApperIcon name="Calendar" className="w-3 h-3" />
          <span>{daysInStage === 1 ? "Today" : `${daysInStage}d ago`}</span>
        </div>
      </div>
    </div>
  )
}

export default DealCard