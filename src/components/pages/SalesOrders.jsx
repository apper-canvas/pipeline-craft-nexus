import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import ErrorView from '@/components/ui/ErrorView';
import SalesOrderListItem from '@/components/molecules/SalesOrderListItem';
import AddSalesOrderModal from '@/components/organisms/AddSalesOrderModal';
import { salesOrderService } from '@/services/api/salesOrderService';

const SalesOrders = () => {
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const statusOptions = ['All', 'Draft', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    loadSalesOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [salesOrders, searchTerm, statusFilter]);

  const loadSalesOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await salesOrderService.getAll();
      setSalesOrders(data);
    } catch (err) {
      console.error('Error loading sales orders:', err);
      setError(err.message || 'Failed to load sales orders');
      setSalesOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = salesOrders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.title_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter(order => order.status_c === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setIsAddModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsAddModalOpen(true);
  };

  const handleDeleteOrder = async (order) => {
    if (!confirm(`Are you sure you want to delete "${order.Name || order.title_c}"?`)) {
      return;
    }

    try {
      await salesOrderService.delete(order.Id);
      toast.success('Sales order deleted successfully');
      loadSalesOrders();
    } catch (err) {
      console.error('Error deleting sales order:', err);
      toast.error(err.message || 'Failed to delete sales order');
    }
  };

  const handleSaveOrder = async (orderData) => {
    try {
      if (editingOrder) {
        await salesOrderService.update(editingOrder.Id, orderData);
        toast.success('Sales order updated successfully');
      } else {
        await salesOrderService.create(orderData);
        toast.success('Sales order created successfully');
      }
      setIsAddModalOpen(false);
      setEditingOrder(null);
      loadSalesOrders();
    } catch (err) {
      console.error('Error saving sales order:', err);
      toast.error(err.message || 'Failed to save sales order');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <Loading className="h-8 w-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6 py-8">
          <ErrorView 
            message={error} 
            onRetry={loadSalesOrders}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Orders</h1>
            <p className="text-gray-600">Manage your sales orders and track order status</p>
          </div>
          <Button 
            onClick={handleAddOrder}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Sales Order
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search sales orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sales Orders List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/60 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'All' ? 'No matching sales orders' : 'No sales orders yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || statusFilter !== 'All' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first sales order'}
              </p>
              {!searchTerm && statusFilter === 'All' && (
                <Button 
                  onClick={handleAddOrder}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                  Add Sales Order
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200/60">
              {filteredOrders.map((order) => (
                <SalesOrderListItem
                  key={order.Id}
                  order={order}
                  onEdit={handleEditOrder}
                  onDelete={handleDeleteOrder}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/60 p-4">
            <div className="text-2xl font-bold text-gray-900">
              {salesOrders.length}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/60 p-4">
            <div className="text-2xl font-bold text-green-600">
              {salesOrders.filter(o => o.status_c === 'Delivered').length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/60 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {salesOrders.filter(o => ['Draft', 'Confirmed'].includes(o.status_c)).length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <AddSalesOrderModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingOrder(null);
          }}
          onSave={handleSaveOrder}
          order={editingOrder}
        />
      )}
    </div>
  );
};

export default SalesOrders;