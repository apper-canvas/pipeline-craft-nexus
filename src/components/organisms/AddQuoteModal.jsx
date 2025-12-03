import { useState, useEffect } from "react"
import Modal from "@/components/molecules/Modal"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { QUOTE_STATUSES } from "@/utils/constants"
import { format } from "date-fns"

const AddQuoteModal = ({ quote = null, onClose, onSubmit, deals = [] }) => {
  const [formData, setFormData] = useState({
    Name: "",
    deal_id_c: "",
    quote_date_c: "",
    expiry_date_c: "",
    amount_c: "",
    status_c: QUOTE_STATUSES.DRAFT,
    description_c: "",
    Tags: ""
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (quote) {
      setFormData({
        Name: quote.Name || "",
        deal_id_c: quote.deal_id_c?.Id || "",
        quote_date_c: quote.quote_date_c ? format(new Date(quote.quote_date_c), 'yyyy-MM-dd') : "",
        expiry_date_c: quote.expiry_date_c ? format(new Date(quote.expiry_date_c), 'yyyy-MM-dd') : "",
        amount_c: quote.amount_c || "",
        status_c: quote.status_c || QUOTE_STATUSES.DRAFT,
        description_c: quote.description_c || "",
        Tags: quote.Tags || ""
      })
    }
  }, [quote])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.Name.trim()) {
      alert("Quote name is required")
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={quote ? "Edit Quote" : "Add New Quote"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quote Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quote Name *
          </label>
          <Input
            type="text"
            value={formData.Name}
            onChange={(e) => handleChange("Name", e.target.value)}
            placeholder="Enter quote name"
            required
          />
        </div>

        {/* Deal Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deal
          </label>
          <select
            value={formData.deal_id_c}
            onChange={(e) => handleChange("deal_id_c", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a deal</option>
            {deals.map((deal) => (
              <option key={deal.Id} value={deal.Id}>
                {deal.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Quote Date and Expiry Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quote Date
            </label>
            <Input
              type="date"
              value={formData.quote_date_c}
              onChange={(e) => handleChange("quote_date_c", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <Input
              type="date"
              value={formData.expiry_date_c}
              onChange={(e) => handleChange("expiry_date_c", e.target.value)}
            />
          </div>
        </div>

        {/* Amount and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.amount_c}
              onChange={(e) => handleChange("amount_c", e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status_c}
              onChange={(e) => handleChange("status_c", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.values(QUOTE_STATUSES).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <Input
            type="text"
            value={formData.Tags}
            onChange={(e) => handleChange("Tags", e.target.value)}
            placeholder="Enter tags separated by commas"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description_c}
            onChange={(e) => handleChange("description_c", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter quote description"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
                {quote ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name={quote ? "Check" : "Plus"} size={16} />
                {quote ? "Update Quote" : "Create Quote"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddQuoteModal