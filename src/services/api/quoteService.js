import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

export const quoteService = {
  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.fetchRecords('quote_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}}, 
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "expiry_date_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching quotes:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.getRecordById('quote_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "quote_date_c"}},
          {"field": {"Name": "expiry_date_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "description_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching quote ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(quoteData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Prepare data with only updateable fields
      const params = {
        records: [{
          Name: quoteData.Name,
          ...(quoteData.Tags && { Tags: quoteData.Tags }),
          ...(quoteData.deal_id_c && { deal_id_c: parseInt(quoteData.deal_id_c) }),
          ...(quoteData.quote_date_c && { quote_date_c: quoteData.quote_date_c }),
          ...(quoteData.expiry_date_c && { expiry_date_c: quoteData.expiry_date_c }),
          ...(quoteData.amount_c && { amount_c: parseFloat(quoteData.amount_c) }),
          ...(quoteData.status_c && { status_c: quoteData.status_c }),
          ...(quoteData.description_c && { description_c: quoteData.description_c })
        }]
      };

      const response = await apperClient.createRecord('quote_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error creating quote:", error?.response?.data?.message || error);
      toast.error("Failed to create quote");
      return null;
    }
  },

  async update(id, quoteData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      // Prepare data with only updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          ...(quoteData.Name !== undefined && { Name: quoteData.Name }),
          ...(quoteData.Tags !== undefined && { Tags: quoteData.Tags }),
          ...(quoteData.deal_id_c !== undefined && { deal_id_c: quoteData.deal_id_c ? parseInt(quoteData.deal_id_c) : null }),
          ...(quoteData.quote_date_c !== undefined && { quote_date_c: quoteData.quote_date_c }),
          ...(quoteData.expiry_date_c !== undefined && { expiry_date_c: quoteData.expiry_date_c }),
          ...(quoteData.amount_c !== undefined && { amount_c: quoteData.amount_c ? parseFloat(quoteData.amount_c) : null }),
          ...(quoteData.status_c !== undefined && { status_c: quoteData.status_c }),
          ...(quoteData.description_c !== undefined && { description_c: quoteData.description_c })
        }]
      };

      const response = await apperClient.updateRecord('quote_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0 ? successful[0].data : null;
      }

      return null;
    } catch (error) {
      console.error("Error updating quote:", error?.response?.data?.message || error);
      toast.error("Failed to update quote");
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const response = await apperClient.deleteRecord('quote_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} quotes:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successful.length > 0;
      }

      return false;
    } catch (error) {
      console.error("Error deleting quote:", error?.response?.data?.message || error);
      toast.error("Failed to delete quote");
      return false;
    }
  }
};