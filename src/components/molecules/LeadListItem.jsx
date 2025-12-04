import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { formatDate, formatCurrency } from '@/utils/formatters'
import { cn } from '@/utils/cn'

const LeadListItem = ({ lead, onEdit, onDelete, onClick }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'blue'
      case 'contacted': return 'indigo'
      case 'qualified': return 'green'
      case 'lost': return 'red'
      default: return 'gray'
    }
  }

  const getSourceIcon = (source) => {
    switch (source?.toLowerCase()) {
      case 'web': return 'Globe'
      case 'referral': return 'Users'
      case 'trade show': return 'Building2'
      default: return 'HelpCircle'
    }
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit?.(lead)
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm('Are you sure you want to delete this lead?')) {
      onDelete?.(lead.Id)
    }
  }

  return (
    <div 
      className={cn(
        "group bg-white rounded-xl border border-gray-200/60 p-6 shadow-sm",
        "hover:shadow-lg hover:border-gray-300/60 transition-all duration-200 cursor-pointer",
        "hover:bg-gradient-to-br hover:from-white hover:to-gray-50/30"
      )}
      onClick={() => onClick?.(lead)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header with name and status */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {(lead.first_name_c?.[0] || lead.Name?.[0] || 'L').toUpperCase()}
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {lead.first_name_c && lead.last_name_c 
                    ? `${lead.first_name_c} ${lead.last_name_c}`
                    : lead.Name || 'Unnamed Lead'
                  }
                </h3>
                {lead.title_c && (
                  <p className="text-sm text-gray-600 truncate">{lead.title_c}</p>
                )}
              </div>
            </div>
            <Badge 
              variant={getStatusColor(lead.status_c)} 
              className="flex-shrink-0"
            >
              {lead.status_c || 'New'}
            </Badge>
          </div>

          {/* Company and contact info */}
          <div className="space-y-2 mb-4">
            {lead.company_c && (
              <div className="flex items-center text-sm text-gray-700">
                <ApperIcon name="Building2" className="w-4 h-4 mr-2 text-gray-500" />
                <span className="truncate">{lead.company_c}</span>
              </div>
            )}
            {lead.email_c && (
              <div className="flex items-center text-sm text-gray-700">
                <ApperIcon name="Mail" className="w-4 h-4 mr-2 text-gray-500" />
                <span className="truncate">{lead.email_c}</span>
              </div>
            )}
            {lead.phone_c && (
              <div className="flex items-center text-sm text-gray-700">
                <ApperIcon name="Phone" className="w-4 h-4 mr-2 text-gray-500" />
                <span className="truncate">{lead.phone_c}</span>
              </div>
            )}
          </div>

          {/* Source and industry */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {lead.source_c && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name={getSourceIcon(lead.source_c)} className="w-4 h-4 mr-1" />
                  <span>{lead.source_c}</span>
                </div>
              )}
              {lead.industry_c && (
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Factory" className="w-4 h-4 mr-1" />
                  <span>{lead.industry_c}</span>
                </div>
              )}
            </div>
            {lead.annual_revenue_c && (
              <div className="text-sm font-medium text-green-700">
                {formatCurrency(lead.annual_revenue_c)}
              </div>
            )}
          </div>

          {/* Notes preview */}
          {lead.notes_c && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {lead.notes_c}
              </p>
            </div>
          )}

          {/* Tags */}
          {lead.Tags && (
            <div className="flex flex-wrap gap-1 mb-4">
              {lead.Tags.split(',').filter(Boolean).slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {tag.trim()}
                </Badge>
              ))}
              {lead.Tags.split(',').filter(Boolean).length > 3 && (
                <Badge variant="secondary" size="sm">
                  +{lead.Tags.split(',').filter(Boolean).length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer with date and actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Created {formatDate(lead.CreatedOn)}
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="h-8 w-8 p-0"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeadListItem