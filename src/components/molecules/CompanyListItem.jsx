import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import { formatDate } from '@/utils/formatters'

const CompanyListItem = ({ company, onEdit, onDelete }) => {
  const formatLocation = () => {
    const parts = [company.city_c, company.state_c].filter(Boolean)
    return parts.join(', ') || 'No location'
  }

  const formatAddress = () => {
    const parts = [
      company.address_c,
      company.city_c,
      company.state_c,
      company.zip_c
    ].filter(Boolean)
    
    if (parts.length === 0) return null
    
    return parts.join(', ')
  }

  const getTags = () => {
    if (!company.Tags) return []
    return company.Tags.split(',').map(tag => tag.trim()).filter(Boolean)
  }

  return (
    <div className="p-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Building2" size={20} className="text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {company.Name || 'Unnamed Company'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Factory" size={14} />
                  <span>{company.industry_c || 'No industry'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="MapPin" size={14} />
                  <span>{formatLocation()}</span>
                </div>
                {company.phone_c && (
                  <div className="flex items-center gap-1">
                    <ApperIcon name="Phone" size={14} />
                    <span>{company.phone_c}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {formatAddress() && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <ApperIcon name="MapPin" size={14} />
              <span>{formatAddress()}</span>
            </div>
          )}

          {company.website_c && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <ApperIcon name="Globe" size={14} />
              <a 
                href={company.website_c.startsWith('http') ? company.website_c : `https://${company.website_c}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {company.website_c}
              </a>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              {getTags().length > 0 && (
                <div className="flex items-center gap-2">
                  <ApperIcon name="Tag" size={14} className="text-gray-400" />
                  <div className="flex gap-1">
                    {getTags().slice(0, 3).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {getTags().length > 3 && (
                      <Badge variant="outline" size="sm" className="text-xs">
                        +{getTags().length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ApperIcon name="Calendar" size={14} />
              <span>Added {formatDate(company.CreatedOn)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="text-gray-600 hover:text-primary border-gray-300 hover:border-primary"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-gray-600 hover:text-error border-gray-300 hover:border-error"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CompanyListItem