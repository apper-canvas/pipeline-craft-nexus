import { getApperClient } from "@/services/apperClient"

export const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.fetchRecords('contact_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response?.data?.length) {
        return []
      }

      // Map database fields to UI format
      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.Name,
        email: contact.email_c,
        phone: contact.phone_c,
        company: contact.company_c,
        notes: contact.notes_c,
        createdAt: contact.CreatedOn,
        updatedAt: contact.CreatedOn
      }))
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.getRecordById('contact_c', id, {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      })

      if (!response?.data) {
        return null
      }

      // Map database fields to UI format
      return {
        Id: response.data.Id,
        name: response.data.Name,
        email: response.data.email_c,
        phone: response.data.phone_c,
        company: response.data.company_c,
        notes: response.data.notes_c,
        createdAt: response.data.CreatedOn,
        updatedAt: response.data.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          Name: contactData.name,
          email_c: contactData.email,
          phone_c: contactData.phone,
          company_c: contactData.company,
          notes_c: contactData.notes
        }]
      }

const response = await apperClient.createRecord('contact_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} contact records:`, failed)
          failed.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return successful[0]?.data
      }

      throw new Error("Unexpected response structure")
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error)
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
          Name: updates.name,
          email_c: updates.email,
          phone_c: updates.phone,
          company_c: updates.company,
          notes_c: updates.notes
        }]
      }

const response = await apperClient.updateRecord('contact_c', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} contact records:`, failed)
          failed.forEach(record => {
            if (record.message) throw new Error(record.message)
          })
        }
        
        return successful[0]?.data
      }

      throw new Error("Unexpected response structure")
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const response = await apperClient.deleteRecord('contact_c', {
        RecordIds: [id]
      })
      
      if (!response.success) {
        throw new Error(response.message)
      }

      return true
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error)
      throw error
    }
  }
}