import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const companyService = {
  async getAll() {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await apperClient.fetchRecords('company_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error('Error fetching companies:', error?.response?.data?.message || error)
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "address_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "state_c"}},
          {"field": {"Name": "zip_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "website_c"}},
          {"field": {"Name": "industry_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById('company_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching company ${id}:`, error?.response?.data?.message || error)
      return null
    }
  },

  async create(companyData) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      // Only include updateable fields
      const params = {
        records: [{
          Name: companyData.Name || '',
          Tags: companyData.Tags || '',
          address_c: companyData.address_c || '',
          city_c: companyData.city_c || '',
          state_c: companyData.state_c || '',
          zip_c: companyData.zip_c || '',
          phone_c: companyData.phone_c || '',
          website_c: companyData.website_c || '',
          industry_c: companyData.industry_c || ''
        }]
      }

      const response = await apperClient.createRecord('company_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} companies:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success('Company created successfully')
          return successful[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error creating company:', error?.response?.data?.message || error)
      toast.error('Failed to create company')
      return null
    }
  },

  async update(id, companyData) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      // Only include updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: companyData.Name || '',
          Tags: companyData.Tags || '',
          address_c: companyData.address_c || '',
          city_c: companyData.city_c || '',
          state_c: companyData.state_c || '',
          zip_c: companyData.zip_c || '',
          phone_c: companyData.phone_c || '',
          website_c: companyData.website_c || '',
          industry_c: companyData.industry_c || ''
        }]
      }

      const response = await apperClient.updateRecord('company_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} companies:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success('Company updated successfully')
          return successful[0].data
        }
      }
      
      return null
    } catch (error) {
      console.error('Error updating company:', error?.response?.data?.message || error)
      toast.error('Failed to update company')
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error('ApperClient not initialized')
      }

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await apperClient.deleteRecord('company_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} companies:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success('Company deleted successfully')
          return true
        }
      }
      
      return false
    } catch (error) {
      console.error('Error deleting company:', error?.response?.data?.message || error)
      toast.error('Failed to delete company')
      return false
    }
  }
}