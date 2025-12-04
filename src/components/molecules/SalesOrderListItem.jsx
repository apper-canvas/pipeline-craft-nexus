import React from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import { formatCurrency } from '@/utils/formatters';

const SalesOrderListItem = ({ order, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Draft': 'bg-gray-100 text-gray-800 border-gray-200',
      'Confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'Shipped': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Draft': 'FileText',
      'Confirmed': 'CheckCircle',
      'Shipped': 'Truck',
      'Delivered': 'Package',
      'Cancelled': 'X'
    };
    return icons[status] || 'FileText';
  };

  const formatOrderDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return '$0.00';
    return formatCurrency(parseFloat(amount));
  };

  return (
    <div className="p-6 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {order.Name || 'Unnamed Order'}
              </h3>
              {order.title_c && (
                <p className="text-sm text-gray-600 mb-2">{order.title_c}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <ApperIcon name="User" className="w-4 h-4 mr-1" />
                  {order.customer_id_c?.Name || 'No Customer'}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                  {formatOrderDate(order.order_date_c)}
                </div>
                <div className="flex items-center">
                  <ApperIcon name="DollarSign" className="w-4 h-4 mr-1" />
                  {formatAmount(order.total_amount_c)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge 
                variant="outline" 
                className={`${getStatusColor(order.status_c)} flex items-center`}
              >
                <ApperIcon 
                  name={getStatusIcon(order.status_c)} 
                  className="w-3 h-3 mr-1" 
                />
                {order.status_c || 'Draft'}
              </Badge>
            </div>
          </div>

          {/* Additional Details */}
          {(order.shipping_address_c || order.description_c) && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              {order.shipping_address_c && (
                <div className="flex items-start mb-2">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <span className="text-xs font-medium text-gray-500">Shipping:</span>
                    <p className="text-sm text-gray-600">{order.shipping_address_c}</p>
                  </div>
                </div>
              )}
              {order.description_c && (
                <div className="flex items-start">
                  <ApperIcon name="FileText" className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <span className="text-xs font-medium text-gray-500">Description:</span>
                    <p className="text-sm text-gray-600 line-clamp-2">{order.description_c}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(order)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ApperIcon name="Edit" className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(order)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderListItem;