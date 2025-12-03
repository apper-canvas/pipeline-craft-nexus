import Avatar from "@/components/atoms/Avatar"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatDate } from "@/utils/formatters"
import { cn } from "@/utils/cn"

const ContactListItem = ({ 
  contact, 
  deals = [],
  onClick,
  className 
}) => {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
  const activeDeals = deals.filter(deal => deal.stage !== "Closed").length
  
  return (
    <tr
      className={cn(
        "hover:bg-blue-50/50 cursor-pointer transition-colors",
        className
      )}
      onClick={() => onClick?.(contact)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <Avatar name={contact.name} size="default" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {contact.name}
            </div>
            <div className="text-sm text-gray-500">
              {contact.email}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{contact.company || "-"}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{contact.phone || "-"}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-900">{activeDeals}</span>
          {activeDeals > 0 && (
            <Badge variant="blue" size="sm">
              Active
            </Badge>
          )}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          ${totalValue.toLocaleString()}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">
          {formatDate(contact.createdAt)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <ApperIcon 
          name="ChevronRight" 
          className="w-4 h-4 text-gray-400" 
        />
      </td>
    </tr>
  )
}

export default ContactListItem