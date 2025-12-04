import { getApperClient } from "@/services/apperClient";
import { toast } from "react-hot-toast";
export const activityService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "from_stage_c"}},
          {"field": {"Name": "to_stage_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      })

      if (!response?.data?.length) {
        return []
      }

      // Map database fields to UI format
      return response.data.map(activity => ({
        Id: activity.Id,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        type: activity.type_c,
        fromStage: activity.from_stage_c,
        toStage: activity.to_stage_c,
        timestamp: activity.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('activity_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "from_stage_c"}},
          {"field": {"Name": "to_stage_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response?.data) {
        return null
      }

      // Map database fields to UI format
      return {
        Id: response.data.Id,
        dealId: response.data.deal_id_c?.Id || response.data.deal_id_c,
        type: response.data.type_c,
        fromStage: response.data.from_stage_c,
        toStage: response.data.to_stage_c,
        timestamp: response.data.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          deal_id_c: parseInt(activityData.dealId),
          type_c: activityData.type,
          from_stage_c: activityData.fromStage,
          to_stage_c: activityData.toStage
        }]
      }

      const response = await apperClient.createRecord('activity_c', params)
if (!response.success) {
        console.error('Activity creation failed:', response.message);
        toast.error(response.message);
        return null;
      }

      // Handle bulk operation results
      if (response.results && response.results.length > 0) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} activity records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          return successful[0].data;
        }
      }

      // Handle direct response data
      if (response.data) {
        return response.data;
      }

      // Fallback - return a basic response structure if available
      return response || null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error)
      throw error
    }
  },

  async getByDealId(dealId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('activity_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "deal_id_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "from_stage_c"}},
          {"field": {"Name": "to_stage_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        where: [{
          "FieldName": "deal_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(dealId)],
          "Include": true
        }],
        orderBy: [{
          "fieldName": "CreatedOn",
          "sorttype": "DESC"
        }]
      })

      if (!response?.data?.length) {
        return []
      }

      // Map database fields to UI format
      return response.data.map(activity => ({
        Id: activity.Id,
        dealId: activity.deal_id_c?.Id || activity.deal_id_c,
        type: activity.type_c,
        fromStage: activity.from_stage_c,
        toStage: activity.to_stage_c,
        timestamp: activity.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching activities by deal:", error?.response?.data?.message || error)
      return []
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.deleteRecord('activity_c', {
        RecordIds: [id]
      })
      
      if (!response.success) {
        throw new Error(response.message)
      }

      return true
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error)
      throw error
    }
  }
}