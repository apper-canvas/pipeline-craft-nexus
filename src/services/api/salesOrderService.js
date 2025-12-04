import { getApperClient } from '@/services/apperClient';

export const salesOrderService = {
  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };

      const response = await apperClient.fetchRecords('sales_order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching sales orders:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "order_date_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "shipping_address_c"}},
          {"field": {"Name": "billing_address_c"}},
          {"field": {"Name": "description_c"}}
        ]
      };

      const response = await apperClient.getRecordById('sales_order_c', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching sales order ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(salesOrderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Name: salesOrderData.Name || '',
          title_c: salesOrderData.title_c || '',
          order_date_c: salesOrderData.order_date_c || '',
          customer_id_c: parseInt(salesOrderData.customer_id_c) || null,
          total_amount_c: parseFloat(salesOrderData.total_amount_c) || 0,
          status_c: salesOrderData.status_c || 'Draft',
          shipping_address_c: salesOrderData.shipping_address_c || '',
          billing_address_c: salesOrderData.billing_address_c || '',
          description_c: salesOrderData.description_c || ''
        }]
      };

      const response = await apperClient.createRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} sales orders:`, failed);
          throw new Error(failed[0].message || 'Failed to create sales order');
        }
        return response.results.filter(r => r.success).map(r => r.data)[0];
      }

      return response.data;
    } catch (error) {
      console.error("Error creating sales order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, salesOrderData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          Name: salesOrderData.Name || '',
          title_c: salesOrderData.title_c || '',
          order_date_c: salesOrderData.order_date_c || '',
          customer_id_c: parseInt(salesOrderData.customer_id_c) || null,
          total_amount_c: parseFloat(salesOrderData.total_amount_c) || 0,
          status_c: salesOrderData.status_c || 'Draft',
          shipping_address_c: salesOrderData.shipping_address_c || '',
          billing_address_c: salesOrderData.billing_address_c || '',
          description_c: salesOrderData.description_c || ''
        }]
      };

      const response = await apperClient.updateRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} sales orders:`, failed);
          throw new Error(failed[0].message || 'Failed to update sales order');
        }
        return response.results.filter(r => r.success).map(r => r.data)[0];
      }

      return response.data;
    } catch (error) {
      console.error("Error updating sales order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('sales_order_c', params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} sales orders:`, failed);
          throw new Error(failed[0].message || 'Failed to delete sales order');
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting sales order:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async search(query) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "customer_id_c"}},
          {"field": {"Name": "total_amount_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [{
          "FieldName": "Name",
          "Operator": "Contains",
          "Values": [query]
        }],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 20, "offset": 0}
      };

      const response = await apperClient.fetchRecords('sales_order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching sales orders:", error?.response?.data?.message || error);
      return [];
    }
  }
};