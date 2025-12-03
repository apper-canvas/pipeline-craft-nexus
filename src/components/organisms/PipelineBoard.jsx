import { useState, useEffect } from "react"
import DealCard from "@/components/molecules/DealCard"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import { DEAL_STAGES, STAGE_COLORS } from "@/utils/constants"
import { formatCurrency } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const PipelineBoard = ({ 
  deals = [], 
  contacts = [], 
  onDealClick,
  onStageChange,
  onAddDeal
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null)
  const [dragOverStage, setDragOverStage] = useState(null)
  
  const stages = Object.values(DEAL_STAGES)
  
const getDealsByStage = (stage) => {
    return deals.filter(deal => deal?.stage === stage)
  }
  
const getContactForDeal = (dealContactId) => {
    return contacts.find(contact => contact?.Id === dealContactId)
  }
  
const getStageTotal = (stage) => {
    return getDealsByStage(stage).reduce((sum, deal) => sum + (deal?.value || 0), 0)
  }
  
  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = "move"
  }
  
  const handleDragEnd = () => {
    setDraggedDeal(null)
    setDragOverStage(null)
  }
  
  const handleDragOver = (e, stage) => {
    e.preventDefault()
    setDragOverStage(stage)
  }
  
  const handleDragLeave = () => {
    setDragOverStage(null)
  }
  
  const handleDrop = (e, newStage) => {
    e.preventDefault()
    
if (draggedDeal && draggedDeal?.stage !== newStage) {
      onStageChange?.(draggedDeal?.Id, newStage)
    }
    
    setDraggedDeal(null)
    setDragOverStage(null)
  }
  
  if (deals.length === 0) {
    return (
      <Empty
        icon="BarChart3"
        title="No deals in pipeline"
        description="Start by adding your first deal to track it through the sales process."
        action={onAddDeal}
        actionLabel="Add Your First Deal"
        className="min-h-[400px]"
      />
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 min-h-[600px]">
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage)
        const stageTotal = getStageTotal(stage)
        const stageColor = STAGE_COLORS[stage]
        const isDragOver = dragOverStage === stage
        
        return (
          <div
            key={stage}
            className={cn(
              "pipeline-column p-4 transition-all duration-200",
              isDragOver && "ring-2 ring-blue-400 ring-offset-2"
            )}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
          >
            {/* Stage Header */}
            <div className="mb-4 pb-3 border-b border-gray-200/60">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    `bg-${stageColor}-500`
                  )} />
                  <span>{stage}</span>
                </h3>
                <div className="text-sm font-medium text-gray-600">
                  {stageDeals.length}
                </div>
              </div>
              
              {stageTotal > 0 && (
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(stageTotal)}
                </div>
              )}
            </div>
            
            {/* Deal Cards */}
            <div className="space-y-3">
              {stageDeals.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <ApperIcon name="Inbox" className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">No deals</p>
                </div>
              ) : (
stageDeals.map((deal) => {
                  const contact = getContactForDeal(deal.contactId)
                  const isDragging = draggedDeal?.Id === deal.Id
                  
                  return (
                    <div
key={deal.Id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      onDragEnd={handleDragEnd}
                      className="drag-handle"
                    >
                      <DealCard
                        deal={deal}
                        contact={contact}
                        onCardClick={onDealClick}
                        isDragging={isDragging}
                      />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PipelineBoard