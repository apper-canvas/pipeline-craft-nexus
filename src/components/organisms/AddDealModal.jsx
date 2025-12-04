import { useState, useEffect } from "react"
import Modal from "@/components/molecules/Modal"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"
import { toast } from "react-toastify"
import { dealService } from "@/services/api/dealService"
import { contactService } from "@/services/api/contactService"
import { DEAL_STAGES } from "@/utils/constants"

const AddDealModal = ({ isOpen, onClose, onSuccess }) => {
const [formData, setFormData] = useState({
    name: "",
    title: "",
    tags: "",
    date: "",
    contactId: "",
    value: "",
    stage: DEAL_STAGES.LEAD
  })
  const [contacts, setContacts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [errors, setErrors] = useState({})
  
  useEffect(() => {
    if (isOpen) {
      loadContacts()
    }
  }, [isOpen])
  
  const loadContacts = async () => {
    setIsLoadingContacts(true)
    try {
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (error) {
      toast.error("Failed to load contacts")
      console.error("Load contacts error:", error)
    } finally {
      setIsLoadingContacts(false)
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }
  
const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Deal name is required"
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required"
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact"
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
const dealData = {
        ...formData,
        contactId: parseInt(formData.contactId),
        value: parseFloat(formData.value)
      }
      
      const deal = await dealService.create(dealData)
      toast.success("Deal added successfully!")
      onSuccess?.(deal)
      handleReset()
    } catch (error) {
      toast.error("Failed to add deal. Please try again.")
      console.error("Add deal error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
const handleReset = () => {
    setFormData({
      name: "",
      title: "",
      tags: "",
      date: "",
      contactId: "",
      value: "",
      stage: DEAL_STAGES.LEAD
    })
    setErrors({})
    setIsSubmitting(false)
  }
  
  const handleClose = () => {
    if (!isSubmitting) {
      handleReset()
      onClose?.()
    }
  }
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Deal"
      size="default"
    >
<form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Name *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter deal name"
            error={errors.name}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Title *
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter deal title"
            error={errors.title}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <Input
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags (comma separated)"
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Date
          </label>
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact *
          </label>
          <select
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            disabled={isSubmitting || isLoadingContacts}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            <option value="">
              {isLoadingContacts ? "Loading contacts..." : "Select a contact"}
            </option>
{contacts.map((contact) => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name} {contact.company ? `(${contact.company})` : ""}
              </option>
            ))}
          </select>
          {errors.contactId && (
            <p className="mt-1 text-sm text-red-600">{errors.contactId}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal Value ($) *
          </label>
          <Input
            name="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={handleChange}
            placeholder="Enter deal value"
            error={errors.value}
            disabled={isSubmitting}
          />
          {errors.value && (
            <p className="mt-1 text-sm text-red-600">{errors.value}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Stage
          </label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            disabled={isSubmitting}
            className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {Object.values(DEAL_STAGES).map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
<Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !formData.name.trim() || !formData.title.trim() || !formData.contactId || !formData.value}
            className="flex-1"
          >
            {isSubmitting ? "Adding..." : "Add Deal"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddDealModal