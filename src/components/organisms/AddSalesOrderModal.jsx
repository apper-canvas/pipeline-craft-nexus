import React, { useState, useEffect } from 'react';
import Modal from '@/components/molecules/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import { contactService } from '@/services/api/contactService';

const AddSalesOrderModal = ({ isOpen, onClose, onSave, order }) => {
  const [formData, setFormData] = useState({
    Name: '',
    title_c: '',
    order_date_c: '',
    customer_id_c: '',
    total_amount_c: '',
    status_c: 'Draft',
    shipping_address_c: '',
    billing_address_c: '',
    description_c: ''
  });

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);

  const statusOptions = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Confirmed', label: 'Confirmed' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadContacts();
      if (order) {
        setFormData({
          Name: order.Name || '',
          title_c: order.title_c || '',
          order_date_c: order.order_date_c ? new Date(order.order_date_c).toISOString().slice(0, 16) : '',
          customer_id_c: order.customer_id_c?.Id || '',
          total_amount_c: order.total_amount_c || '',
          status_c: order.status_c || 'Draft',
          shipping_address_c: order.shipping_address_c || '',
          billing_address_c: order.billing_address_c || '',
          description_c: order.description_c || ''
        });
      } else {
        setFormData({
          Name: '',
          title_c: '',
          order_date_c: '',
          customer_id_c: '',
          total_amount_c: '',
          status_c: 'Draft',
          shipping_address_c: '',
          billing_address_c: '',
          description_c: ''
        });
      }
    }
  }, [isOpen, order]);

  const loadContacts = async () => {
    try {
      setContactsLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts([]);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.Name.trim()) {
      alert('Please enter a sales order name');
      return;
    }

    if (!formData.customer_id_c) {
      alert('Please select a customer');
      return;
    }

    if (!formData.total_amount_c) {
      alert('Please enter the total amount');
      return;
    }

    try {
      setLoading(true);
      
      const salesOrderData = {
        Name: formData.Name.trim(),
        title_c: formData.title_c.trim(),
        order_date_c: formData.order_date_c ? new Date(formData.order_date_c).toISOString() : '',
        customer_id_c: parseInt(formData.customer_id_c),
        total_amount_c: parseFloat(formData.total_amount_c),
        status_c: formData.status_c,
        shipping_address_c: formData.shipping_address_c.trim(),
        billing_address_c: formData.billing_address_c.trim(),
        description_c: formData.description_c.trim()
      };

      await onSave(salesOrderData);
    } catch (error) {
      console.error('Error saving sales order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedCustomerName = () => {
    if (!formData.customer_id_c) return '';
    const customer = contacts.find(c => c.Id === parseInt(formData.customer_id_c));
    return customer ? customer.Name : '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {order ? 'Edit Sales Order' : 'Add New Sales Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Name *
              </label>
              <Input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                placeholder="Enter order name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                type="text"
                name="title_c"
                value={formData.title_c}
                onChange={handleInputChange}
                placeholder="Enter order title"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              {contactsLoading ? (
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  Loading contacts...
                </div>
              ) : (
                <select
                  name="customer_id_c"
                  value={formData.customer_id_c}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a customer</option>
                  {contacts.map(contact => (
                    <option key={contact.Id} value={contact.Id}>
                      {contact.Name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Date
              </label>
              <Input
                type="datetime-local"
                name="order_date_c"
                value={formData.order_date_c}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount *
              </label>
              <Input
                type="number"
                step="0.01"
                name="total_amount_c"
                value={formData.total_amount_c}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status_c"
                value={formData.status_c}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address
              </label>
              <textarea
                name="shipping_address_c"
                value={formData.shipping_address_c}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter shipping address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Address
              </label>
              <textarea
                name="billing_address_c"
                value={formData.billing_address_c}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter billing address"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description_c"
              value={formData.description_c}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter order description"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  {order ? 'Update' : 'Create'} Sales Order
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddSalesOrderModal;