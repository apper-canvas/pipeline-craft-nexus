import { useState, useEffect } from 'react'
import Modal from '@/components/molecules/Modal'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const AddLeadModal = ({ isOpen, onClose, onSubmit, lead = null }) => {
  const [formData, setFormData] = useState({
    first_name_c: '',
    last_name_c: '',
    title_c: '',
    company_c: '',
    email_c: '',
    phone_c: '',
    status_c: 'New',
    source_c: '',
    industry_c: '',
    annual_revenue_c: '',
    notes_c: '',
    Tags: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Status options from picklist
  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Lost', label: 'Lost' }
  ]

  // Source options from picklist  
  const sourceOptions = [
    { value: 'Web', label: 'Web' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Trade Show', label: 'Trade Show' },
    { value: 'Other', label: 'Other' }
  ]

  useEffect(() => {
    if (lead) {
      setFormData({
        first_name_c: lead.first_name_c || '',
        last_name_c: lead.last_name_c || '',
        title_c: lead.title_c || '',
        company_c: lead.company_c || '',
        email_c: lead.email_c || '',
        phone_c: lead.phone_c || '',
        status_c: lead.status_c || 'New',
        source_c: lead.source_c || '',
        industry_c: lead.industry_c || '',
        annual_revenue_c: lead.annual_revenue_c || '',
        notes_c: lead.notes_c || '',
        Tags: lead.Tags || ''
      })
    } else {
      setFormData({
        first_name_c: '',
        last_name_c: '',
        title_c: '',
        company_c: '',
        email_c: '',
        phone_c: '',
        status_c: 'New',
        source_c: '',
        industry_c: '',
        annual_revenue_c: '',
        notes_c: '',
        Tags: ''
      })
    }
    setErrors({})
  }, [lead, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.first_name_c.trim()) {
      newErrors.first_name_c = 'First name is required'
    }

    if (!formData.last_name_c.trim()) {
      newErrors.last_name_c = 'Last name is required'
    }

    if (!formData.company_c.trim()) {
      newErrors.company_c = 'Company is required'
    }

    if (formData.email_c && !isValidEmail(formData.email_c)) {
      newErrors.email_c = 'Please enter a valid email address'
    }

    if (formData.annual_revenue_c && (isNaN(formData.annual_revenue_c) || formData.annual_revenue_c < 0)) {
      newErrors.annual_revenue_c = 'Annual revenue must be a positive number'
    }

    return newErrors
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Convert annual revenue to number if provided
      const submitData = {
        ...formData,
        annual_revenue_c: formData.annual_revenue_c ? parseFloat(formData.annual_revenue_c) : null
      }
      
      await onSubmit(submitData)
      onClose()
    } catch (error) {
      console.error('Error submitting lead:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={lead ? 'Edit Lead' : 'Add New Lead'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <Input
                value={formData.first_name_c}
                onChange={(e) => handleInputChange('first_name_c', e.target.value)}
                placeholder="Enter first name"
                error={!!errors.first_name_c}
              />
              {errors.first_name_c && (
                <p className="mt-1 text-sm text-red-600">{errors.first_name_c}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <Input
                value={formData.last_name_c}
                onChange={(e) => handleInputChange('last_name_c', e.target.value)}
                placeholder="Enter last name"
                error={!!errors.last_name_c}
              />
              {errors.last_name_c && (
                <p className="mt-1 text-sm text-red-600">{errors.last_name_c}</p>
              )}
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <Input
                value={formData.title_c}
                onChange={(e) => handleInputChange('title_c', e.target.value)}
                placeholder="Enter job title"
                error={!!errors.title_c}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company *
              </label>
              <Input
                value={formData.company_c}
                onChange={(e) => handleInputChange('company_c', e.target.value)}
                placeholder="Enter company name"
                error={!!errors.company_c}
              />
              {errors.company_c && (
                <p className="mt-1 text-sm text-red-600">{errors.company_c}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <Input
                value={formData.industry_c}
                onChange={(e) => handleInputChange('industry_c', e.target.value)}
                placeholder="Enter industry"
                error={!!errors.industry_c}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Revenue
              </label>
              <Input
                type="number"
                value={formData.annual_revenue_c}
                onChange={(e) => handleInputChange('annual_revenue_c', e.target.value)}
                placeholder="Enter annual revenue"
                error={!!errors.annual_revenue_c}
                min="0"
                step="0.01"
              />
              {errors.annual_revenue_c && (
                <p className="mt-1 text-sm text-red-600">{errors.annual_revenue_c}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={formData.email_c}
                onChange={(e) => handleInputChange('email_c', e.target.value)}
                placeholder="Enter email address"
                error={!!errors.email_c}
              />
              {errors.email_c && (
                <p className="mt-1 text-sm text-red-600">{errors.email_c}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={formData.phone_c}
                onChange={(e) => handleInputChange('phone_c', e.target.value)}
                placeholder="Enter phone number"
                error={!!errors.phone_c}
              />
            </div>
          </div>
        </div>

        {/* Status and Source */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4">Lead Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status_c}
                onChange={(e) => handleInputChange('status_c', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={formData.source_c}
                onChange={(e) => handleInputChange('source_c', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select source</option>
                {sourceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes and Tags */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes_c}
              onChange={(e) => handleInputChange('notes_c', e.target.value)}
              placeholder="Enter notes about this lead..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <Input
              value={formData.Tags}
              onChange={(e) => handleInputChange('Tags', e.target.value)}
              placeholder="Enter tags separated by commas"
              error={!!errors.Tags}
            />
            <p className="mt-1 text-sm text-gray-500">Separate multiple tags with commas</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center"
          >
            {isSubmitting && (
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
            )}
            {lead ? 'Update Lead' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddLeadModal