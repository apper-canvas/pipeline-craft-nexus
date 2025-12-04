import { useState } from 'react';
import Modal from '@/components/molecules/Modal';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const fieldTypes = [
  { value: 'Text', label: 'Text', icon: 'Type' },
  { value: 'Number', label: 'Number', icon: 'Hash' },
  { value: 'Email', label: 'Email', icon: 'Mail' },
  { value: 'Phone', label: 'Phone', icon: 'Phone' },
  { value: 'Date', label: 'Date', icon: 'Calendar' },
  { value: 'DateTime', label: 'Date Time', icon: 'Clock' },
  { value: 'Boolean', label: 'Boolean', icon: 'ToggleLeft' },
  { value: 'Picklist', label: 'Picklist', icon: 'List' },
  { value: 'MultilineText', label: 'Multiline Text', icon: 'AlignLeft' },
  { value: 'Currency', label: 'Currency', icon: 'DollarSign' },
  { value: 'Lookup', label: 'Lookup', icon: 'Link' }
];

const visibilityOptions = [
  { value: 'Updateable', label: 'Updateable' },
  { value: 'ReadOnly', label: 'Read Only' },
  { value: 'System', label: 'System' }
];

const AddFieldModal = ({ isOpen, onClose, onSubmit, tableName }) => {
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    type: 'Text',
    required: false,
    visibility: 'Updateable',
    description: '',
    picklistOptions: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Field name is required';
    } else if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(formData.name)) {
      newErrors.name = 'Field name must start with a letter and contain only letters, numbers, and underscores';
    }

    if (!formData.label.trim()) {
      newErrors.label = 'Display label is required';
    }

    if (formData.type === 'Picklist' && !formData.picklistOptions.trim()) {
      newErrors.picklistOptions = 'Picklist options are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(tableName, formData);
      setFormData({
        name: '',
        label: '',
        type: 'Text',
        required: false,
        visibility: 'Updateable',
        description: '',
        picklistOptions: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error adding field:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      label: '',
      type: 'Text',
      required: false,
      visibility: 'Updateable',
      description: '',
      picklistOptions: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Add Field to ${tableName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Field Name *
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., product_code"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <ApperIcon name="AlertCircle" size={14} />
              {errors.name}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Will be saved as: {formData.name}_c
          </p>
        </div>

        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
            Display Label *
          </label>
          <Input
            id="label"
            name="label"
            value={formData.label}
            onChange={handleInputChange}
            placeholder="e.g., Product Code"
            className={errors.label ? 'border-red-500' : ''}
          />
          {errors.label && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <ApperIcon name="AlertCircle" size={14} />
              {errors.label}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Field Type *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {fieldTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {formData.type === 'Picklist' && (
          <div>
            <label htmlFor="picklistOptions" className="block text-sm font-medium text-gray-700 mb-1">
              Picklist Options *
            </label>
            <textarea
              id="picklistOptions"
              name="picklistOptions"
              value={formData.picklistOptions}
              onChange={handleInputChange}
              placeholder="Enter options separated by commas: Option 1, Option 2, Option 3"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                errors.picklistOptions ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.picklistOptions && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <ApperIcon name="AlertCircle" size={14} />
                {errors.picklistOptions}
              </p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-1">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {visibilityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            id="required"
            name="required"
            type="checkbox"
            checked={formData.required}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
            Required field
          </label>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of this field..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            {isSubmitting && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
            Add Field
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddFieldModal;