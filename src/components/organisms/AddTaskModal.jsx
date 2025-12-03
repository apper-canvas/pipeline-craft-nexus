import { useState, useEffect } from 'react'
import { taskService } from '@/services/api/taskService'
import { contactService } from '@/services/api/contactService'
import { TASK_STATUSES, TASK_PRIORITIES } from '@/utils/constants'
import Modal from '@/components/molecules/Modal'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

const AddTaskModal = ({ isOpen, onClose, task = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title_c: '',
    description_c: '',
    status_c: 'Open',
    priority_c: 'Normal',
    due_date_c: '',
    related_to_c: '',
    assigned_to_c: ''
  })
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(false)
  const [contactsLoading, setContactsLoading] = useState(false)
  const isEditing = !!task

  useEffect(() => {
    if (task) {
      setFormData({
        title_c: task.title_c || '',
        description_c: task.description_c || '',
        status_c: task.status_c || 'Open',
        priority_c: task.priority_c || 'Normal',
        due_date_c: task.due_date_c ? task.due_date_c.split('T')[0] : '',
        related_to_c: task.related_to_c?.Id || '',
        assigned_to_c: task.assigned_to_c?.Id || ''
      })
    } else {
      setFormData({
        title_c: '',
        description_c: '',
        status_c: 'Open',
        priority_c: 'Normal',
        due_date_c: '',
        related_to_c: '',
        assigned_to_c: ''
      })
    }
  }, [task])

  useEffect(() => {
    if (isOpen) {
      loadContacts()
    }
  }, [isOpen])

  const loadContacts = async () => {
    setContactsLoading(true)
    try {
      const data = await contactService.getAll()
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
    setContactsLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        due_date_c: formData.due_date_c ? new Date(formData.due_date_c + 'T23:59:59').toISOString() : null,
        related_to_c: formData.related_to_c || null,
        assigned_to_c: formData.assigned_to_c || null
      }

      let result
      if (isEditing) {
        result = await taskService.update(task.Id, submitData)
      } else {
        result = await taskService.create(submitData)
      }

      if (result) {
        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Error saving task:', error)
    }
    
    setLoading(false)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Add New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <Input
            value={formData.title_c}
            onChange={(e) => handleInputChange('title_c', e.target.value)}
            placeholder="Enter task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description_c}
            onChange={(e) => handleInputChange('description_c', e.target.value)}
            placeholder="Enter task description"
            rows={3}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status_c}
              onChange={(e) => handleInputChange('status_c', e.target.value)}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {Object.values(TASK_STATUSES).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority_c}
              onChange={(e) => handleInputChange('priority_c', e.target.value)}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {Object.values(TASK_PRIORITIES).map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <Input
            type="date"
            value={formData.due_date_c}
            onChange={(e) => handleInputChange('due_date_c', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related To
            </label>
            <select
              value={formData.related_to_c}
              onChange={(e) => handleInputChange('related_to_c', e.target.value)}
              disabled={contactsLoading}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <option value="">Select contact</option>
              {contacts.map(contact => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <select
              value={formData.assigned_to_c}
              onChange={(e) => handleInputChange('assigned_to_c', e.target.value)}
              disabled={contactsLoading}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              <option value="">Select assignee</option>
              {contacts.map(contact => (
                <option key={contact.Id} value={contact.Id}>
                  {contact.Name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddTaskModal