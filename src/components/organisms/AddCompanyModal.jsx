import { useState, useEffect } from 'react'
import Modal from '@/components/molecules/Modal'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const AddCompanyModal = ({ isOpen, onClose, onSubmit, company = null, title = 'Add New Company' }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Tags: '',
    address_c: '',
    city_c: '',
    state_c: '',
    zip_c: '',
    phone_c: '',
    website_c: '',
    industry_c: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (company) {
      setFormData({
        Name: company.Name || '',
        Tags: company.Tags || '',
        address_c: company.address_c || '',
        city_c: company.city_c || '',
        state_c: company.state_c || '',
        zip_c: company.zip_c || '',
        phone_c: company.phone_c || '',
        website_c: company.website_c || '',
        industry_c: company.industry_c || ''
      })
    } else {
      setFormData({
        Name: '',
        Tags: '',
        address_c: '',
        city_c: '',
        state_c: '',
        zip_c: '',
        phone_c: '',
        website_c: '',
        industry_c: ''
      })
    }
    setErrors({})
  }, [company, isOpen])

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
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Company name is required'
    }
    
    if (formData.website_c && !isValidWebsite(formData.website_c)) {
      newErrors.website_c = 'Please enter a valid website URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidWebsite = (url) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/
    return pattern.test(url)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <Input
              value={formData.Name}
              onChange={(e) => handleInputChange('Name', e.target.value)}
              placeholder="Enter company name"
              className={errors.Name ? 'border-error' : ''}
            />
            {errors.Name && (
              <p className="text-error text-sm mt-1">{errors.Name}</p>
            )}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <Input
              value={formData.industry_c}
              onChange={(e) => handleInputChange('industry_c', e.target.value)}
              placeholder="e.g., Technology, Healthcare"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <Input
              value={formData.phone_c}
              onChange={(e) => handleInputChange('phone_c', e.target.value)}
              placeholder="(555) 123-4567"
              type="tel"
            />
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <Input
              value={formData.website_c}
              onChange={(e) => handleInputChange('website_c', e.target.value)}
              placeholder="https://example.com"
              className={errors.website_c ? 'border-error' : ''}
            />
            {errors.website_c && (
              <p className="text-error text-sm mt-1">{errors.website_c}</p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <Input
              value={formData.address_c}
              onChange={(e) => handleInputChange('address_c', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <Input
              value={formData.city_c}
              onChange={(e) => handleInputChange('city_c', e.target.value)}
              placeholder="San Francisco"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <Input
              value={formData.state_c}
              onChange={(e) => handleInputChange('state_c', e.target.value)}
              placeholder="CA"
            />
          </div>

          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <Input
              value={formData.zip_c}
              onChange={(e) => handleInputChange('zip_c', e.target.value)}
              placeholder="94105"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <Input
              value={formData.Tags}
              onChange={(e) => handleInputChange('Tags', e.target.value)}
              placeholder="client, partner, prospect"
            />
            <p className="text-gray-500 text-xs mt-1">Separate multiple tags with commas</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                {company ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <ApperIcon name={company ? "Save" : "Plus"} size={16} className="mr-2" />
                {company ? 'Update Company' : 'Create Company'}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddCompanyModal