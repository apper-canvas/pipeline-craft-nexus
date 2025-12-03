import { useState, useEffect } from "react"
import Avatar from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { formatDate, formatCurrency } from "@/utils/formatters"
import { STAGE_COLORS } from "@/utils/constants"
import { cn } from "@/utils/cn"

const ContactDetail = ({ 
  contact, 
  deals = [],
  activities = [],
  isOpen, 
  onClose,
  onEditContact
}) => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])
  
  if (!isOpen || !contact) return null
  
  const activeDeals = deals.filter(deal => deal.stage !== "Closed")
  const closedDeals = deals.filter(deal => deal.stage === "Closed")
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const wonValue = closedDeals.reduce((sum, deal) => sum + deal.value, 0)
  
  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md bg-white/95 backdrop-blur-sm shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-50/80 to-purple-50/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/60 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar name={contact.name} size="xl" />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">{contact.name}</h3>
              <p className="text-gray-600">{contact.company || "No Company"}</p>
              <div className="flex items-center space-x-4 mt-2">
                {contact.email && (
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <ApperIcon name="Mail" className="w-4 h-4" />
                    <span>Email</span>
                  </a>
                )}
                {contact.phone && (
                  <a 
                    href={`tel:${contact.phone}`}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <ApperIcon name="Phone" className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
            <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <div className="text-gray-900">{contact.email || "-"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <div className="text-gray-900">{contact.phone || "-"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <div className="text-gray-900">{contact.company || "-"}</div>
              </div>
              {contact.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <div className="text-gray-900">{contact.notes}</div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Added</label>
                <div className="text-gray-900">{formatDate(contact.createdAt)}</div>
              </div>
            </div>
          </div>
          
          {/* Deal Summary */}
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
            <h4 className="font-semibold text-gray-900 mb-3">Deal Summary</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{deals.length}</div>
                <div className="text-sm text-gray-500">Total Deals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</div>
                <div className="text-sm text-gray-500">Total Value</div>
              </div>
            </div>
            
            {wonValue > 0 && (
              <div className="mt-4 p-3 bg-green-50/80 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">Won Deals</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(wonValue)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Active Deals */}
          {activeDeals.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
              <h4 className="font-semibold text-gray-900 mb-3">Active Deals</h4>
              <div className="space-y-3">
                {activeDeals.map((deal) => {
                  const stageColor = STAGE_COLORS[deal.stage]
                  return (
                    <div key={deal.Id} className="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{deal.title}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={stageColor} size="sm">
                            {deal.stage}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatDate(deal.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(deal.value)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          
          {/* Recent Activity */}
          {activities.length > 0 && (
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/60">
              <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity.Id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <ApperIcon 
                        name={activity.type === "stage_changed" ? "ArrowRight" : "Plus"} 
                        className="w-4 h-4 text-blue-600" 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">
                        {activity.type === "stage_changed" 
                          ? `Deal moved from ${activity.fromStage} to ${activity.toStage}`
                          : "Deal created"
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200/60 bg-gray-50/60">
          <Button
            variant="primary"
            size="default"
            onClick={() => onEditContact?.(contact)}
            className="w-full flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
            <span>Edit Contact</span>
          </Button>
        </div>
      </div>
    </>
  )
}

export default ContactDetail