import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { QUOTE_STATUS_COLORS } from "@/utils/constants"

const QuoteListItem = ({ quote, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    return QUOTE_STATUS_COLORS[status] || "gray"
  }

  const formatAmount = (amount) => {
    if (!amount) return "—"
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return "—"
    try {
      return format(new Date(date), 'MMM dd, yyyy')
    } catch {
      return "—"
    }
  }

  const isExpired = quote.expiry_date_c && new Date(quote.expiry_date_c) < new Date()

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" size={20} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {quote.Name}
                </h3>
                <Badge color={getStatusColor(quote.status_c)}>
                  {quote.status_c}
                </Badge>
                {isExpired && quote.status_c !== 'Accepted' && quote.status_c !== 'Rejected' && (
                  <Badge color="red">
                    Expired
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex items-center text-sm text-gray-500 space-x-4">
                {quote.deal_id_c?.Name && (
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Briefcase" size={14} />
                    <span>{quote.deal_id_c.Name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <ApperIcon name="DollarSign" size={14} />
                  <span>{formatAmount(quote.amount_c)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Calendar" size={14} />
                  <span>{formatDate(quote.quote_date_c)}</span>
                </div>
                {quote.expiry_date_c && (
                  <div className={`flex items-center space-x-1 ${isExpired ? 'text-red-500' : ''}`}>
                    <ApperIcon name="Clock" size={14} />
                    <span>Expires {formatDate(quote.expiry_date_c)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {quote.description_c && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {quote.description_c}
            </p>
          )}
          
          {quote.Tags && (
            <div className="flex flex-wrap gap-1">
              {quote.Tags.split(',').map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(quote)}
            className="text-gray-600 hover:text-blue-600 hover:border-blue-300"
          >
            <ApperIcon name="Edit3" size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(quote.Id)}
            className="text-gray-600 hover:text-red-600 hover:border-red-300"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default QuoteListItem