import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const taskService = {
  async getAll(filters = {}) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const whereConditions = []
      
      if (filters.status) {
        whereConditions.push({
          FieldName: "status_c",
          Operator: "EqualTo", 
          Values: [filters.status],
          Include: true
        })
      }

      if (filters.priority) {
        whereConditions.push({
          FieldName: "priority_c",
          Operator: "EqualTo",
          Values: [filters.priority], 
          Include: true
        })
      }

      if (filters.search) {
        whereConditions.push({
          FieldName: "title_c",
          Operator: "Contains",
          Values: [filters.search],
          Include: true
        })
      }

      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "related_to_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: whereConditions,
        orderBy: [{
          fieldName: "CreatedOn",
          sorttype: "DESC"
        }],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }

      const response = await apperClient.fetchRecords('task_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      toast.error("Failed to load tasks")
      return []
    }
  },

  async getById(id) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "related_to_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "completed_date_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await apperClient.getRecordById('task_c', id, params)
      return response.data
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      toast.error("Failed to load task")
      return null
    }
  },

  async create(taskData) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        records: [{
          title_c: taskData.title_c,
          description_c: taskData.description_c,
          status_c: taskData.status_c,
          priority_c: taskData.priority_c,
          due_date_c: taskData.due_date_c,
          related_to_c: taskData.related_to_c ? parseInt(taskData.related_to_c) : undefined,
          assigned_to_c: taskData.assigned_to_c ? parseInt(taskData.assigned_to_c) : undefined
        }]
      }

      const response = await apperClient.createRecord('task_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Task created successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      toast.error("Failed to create task")
      return null
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const updateData = {
        Id: id,
        title_c: taskData.title_c,
        description_c: taskData.description_c,
        status_c: taskData.status_c,
        priority_c: taskData.priority_c,
        due_date_c: taskData.due_date_c,
        related_to_c: taskData.related_to_c ? parseInt(taskData.related_to_c) : undefined,
        assigned_to_c: taskData.assigned_to_c ? parseInt(taskData.assigned_to_c) : undefined
      }

      if (taskData.status_c === 'Completed' && !taskData.completed_date_c) {
        updateData.completed_date_c = new Date().toISOString()
      }

      const params = {
        records: [updateData]
      }

      const response = await apperClient.updateRecord('task_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Task updated successfully")
          return successful[0].data
        }
      }
      return null
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      toast.error("Failed to update task")
      return null
    }
  },

  async delete(id) {
    try {
      const apperClient = await getApperClient()
      if (!apperClient) {
        throw new Error("ApperClient not initialized")
      }

      const params = {
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord('task_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Task deleted successfully")
          return true
        }
      }
      return false
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      toast.error("Failed to delete task")
      return false
    }
  }
}