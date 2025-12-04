import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const leadService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "annual_revenue_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      }

      const response = await apperClient.fetchRecords('lead_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching leads:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "annual_revenue_c"}},
          {"field": {"Name": "notes_c"}}
        ]
      }

      const response = await apperClient.getRecordById('lead_c', parseInt(id), params)
      return response.data
    } catch (error) {
      console.error(`Error fetching lead ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(leadData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          Name: leadData.Name || `${leadData.first_name_c} ${leadData.last_name_c}`.trim(),
          title_c: leadData.title_c || "",
          first_name_c: leadData.first_name_c || "",
          last_name_c: leadData.last_name_c || "",
          company_c: leadData.company_c || "",
          email_c: leadData.email_c || "",
          phone_c: leadData.phone_c || "",
          status_c: leadData.status_c || "New",
          source_c: leadData.source_c || "",
          industry_c: leadData.industry_c || "",
          annual_revenue_c: leadData.annual_revenue_c || null,
          notes_c: leadData.notes_c || "",
          Tags: leadData.Tags || ""
        }]
      }

      const response = await apperClient.createRecord('lead_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} leads:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success('Lead created successfully')
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error creating lead:", error?.response?.data?.message || error)
      return null
    }
  },

  async update(id, leadData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const updateData = {
        Id: parseInt(id)
      }

      // Only include updateable fields with non-empty values
      if (leadData.Name) updateData.Name = leadData.Name
      if (leadData.title_c !== undefined) updateData.title_c = leadData.title_c
      if (leadData.first_name_c !== undefined) updateData.first_name_c = leadData.first_name_c
      if (leadData.last_name_c !== undefined) updateData.last_name_c = leadData.last_name_c
      if (leadData.company_c !== undefined) updateData.company_c = leadData.company_c
      if (leadData.email_c !== undefined) updateData.email_c = leadData.email_c
      if (leadData.phone_c !== undefined) updateData.phone_c = leadData.phone_c
      if (leadData.status_c !== undefined) updateData.status_c = leadData.status_c
      if (leadData.source_c !== undefined) updateData.source_c = leadData.source_c
      if (leadData.industry_c !== undefined) updateData.industry_c = leadData.industry_c
      if (leadData.annual_revenue_c !== undefined) updateData.annual_revenue_c = leadData.annual_revenue_c
      if (leadData.notes_c !== undefined) updateData.notes_c = leadData.notes_c
      if (leadData.Tags !== undefined) updateData.Tags = leadData.Tags

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord('lead_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} leads:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success('Lead updated successfully')
          return successful[0].data
        }
      }

      return null
    } catch (error) {
      console.error("Error updating lead:", error?.response?.data?.message || error)
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('lead_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} leads:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success('Lead deleted successfully')
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting lead:", error?.response?.data?.message || error)
      return false
    }
  }
}