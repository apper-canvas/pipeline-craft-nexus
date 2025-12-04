import { getApperClient } from "@/services/apperClient"

export const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      })

      if (!response?.data?.length) {
        return []
      }

      // Map database fields to UI format
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn,
        movedToStageAt: deal.ModifiedOn
      }))
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('deal_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      })

      if (!response?.data) {
        return null
      }

      // Map database fields to UI format
      return {
        Id: response.data.Id,
        title: response.data.title_c,
        value: response.data.value_c,
        stage: response.data.stage_c,
        contactId: response.data.contact_id_c?.Id || response.data.contact_id_c,
        createdAt: response.data.CreatedOn,
        updatedAt: response.data.ModifiedOn,
        movedToStageAt: response.data.ModifiedOn
      }
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

async create(dealData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          title_c: dealData.title,
          value_c: dealData.value,
          stage_c: dealData.stage,
          contact_id_c: parseInt(dealData.contactId)
        }]
      }

      const response = await apperClient.createRecord('deal_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deal records:`, failed)
          failed.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return successful[0]?.data
      }

      throw new Error("Unexpected response structure")
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error)
      throw error
    }
  },

  async update(id, updates) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          Id: id,
          ...(updates.title && { title_c: updates.title }),
          ...(updates.value && { value_c: updates.value }),
          ...(updates.stage && { stage_c: updates.stage }),
          ...(updates.contactId && { contact_id_c: parseInt(updates.contactId) })
        }]
      }

      const response = await apperClient.updateRecord('deal_c', params)
      
      if (!response.success) {
        throw new Error(response.message)
      }

      return response.records[0]
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.deleteRecord('deal_c', {
        RecordIds: [id]
      })
      
      if (!response.success) {
        throw new Error(response.message)
      }

      return true
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error)
      throw error
    }
  },

  async getByContactId(contactId) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "contact_id_c",
          "Operator": "EqualTo",
          "Values": [parseInt(contactId)],
          "Include": true
        }]
      })

      if (!response?.data?.length) {
        return []
      }

      // Map database fields to UI format
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn,
        movedToStageAt: deal.ModifiedOn
      }))
    } catch (error) {
      console.error("Error fetching deals by contact:", error?.response?.data?.message || error)
      return []
    }
  },

  async getByStage(stage) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('deal_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "contact_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [{
          "FieldName": "stage_c",
          "Operator": "EqualTo",
          "Values": [stage],
          "Include": true
        }]
      })

      if (!response?.data?.length) {
        return []
      }

      // Map database fields to UI format
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c,
        value: deal.value_c,
        stage: deal.stage_c,
        contactId: deal.contact_id_c?.Id || deal.contact_id_c,
        createdAt: deal.CreatedOn,
        updatedAt: deal.ModifiedOn,
        movedToStageAt: deal.ModifiedOn
      }))
    } catch (error) {
      console.error("Error fetching deals by stage:", error?.response?.data?.message || error)
      return []
    }
  }
}