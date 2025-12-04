import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import CustomTableModal from '@/components/organisms/CustomTableModal';
import AddFieldModal from '@/components/organisms/AddFieldModal';
import { customizeService } from '@/services/api/customizeService';

const Customize = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fieldsLoading, setFieldsLoading] = useState(false);
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const tablesData = await customizeService.getAllTables();
      setTables(tablesData);
    } catch (error) {
      console.error('Error loading tables:', error);
      toast.error('Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  const loadTableFields = async (tableName) => {
    try {
      setFieldsLoading(true);
      const fieldsData = await customizeService.getTableFields(tableName);
      setFields(fieldsData);
    } catch (error) {
      console.error('Error loading table fields:', error);
      toast.error('Failed to load table fields');
      setFields([]);
    } finally {
      setFieldsLoading(false);
    }
  };

  const handleTableSelect = async (table) => {
    setSelectedTable(table);
    await loadTableFields(table.name);
  };

  const handleCreateTable = async (tableData) => {
    try {
      const result = await customizeService.createTable(tableData);
      if (result.success) {
        setTables(prev => [...prev, result.data]);
        toast.success('Table created successfully');
        setShowCreateTableModal(false);
      }
    } catch (error) {
      console.error('Error creating table:', error);
      toast.error('Failed to create table');
    }
  };

  const handleAddField = async (tableName, fieldData) => {
    try {
      const result = await customizeService.addField(tableName, fieldData);
      if (result.success) {
        setFields(prev => [...prev, result.data]);
        // Update table field count
        setTables(prev => prev.map(table => 
          table.name === tableName 
            ? { ...table, fieldCount: table.fieldCount + 1 }
            : table
        ));
        toast.success('Field added successfully');
        setShowAddFieldModal(false);
      }
    } catch (error) {
      console.error('Error adding field:', error);
      toast.error('Failed to add field');
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (!confirm('Are you sure you want to delete this table? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await customizeService.deleteTable(tableId);
      if (result.success) {
        setTables(prev => prev.filter(table => table.id !== tableId));
        if (selectedTable?.id === tableId) {
          setSelectedTable(null);
          setFields([]);
        }
        toast.success('Table deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      toast.error('Failed to delete table');
    }
  };

  const handleDeleteField = async (fieldId) => {
    if (!confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await customizeService.deleteField(fieldId);
      if (result.success) {
        setFields(prev => prev.filter(field => field.id !== fieldId));
        // Update table field count
        setTables(prev => prev.map(table => 
          table.name === selectedTable?.name 
            ? { ...table, fieldCount: table.fieldCount - 1 }
            : table
        ));
        toast.success('Field deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting field:', error);
      toast.error('Failed to delete field');
    }
  };

  const getFieldTypeIcon = (type) => {
    const iconMap = {
      Text: 'Type',
      Number: 'Hash',
      Email: 'Mail',
      Phone: 'Phone',
      Date: 'Calendar',
      DateTime: 'Clock',
      Boolean: 'ToggleLeft',
      Picklist: 'List',
      MultilineText: 'AlignLeft',
      Currency: 'DollarSign',
      Lookup: 'Link'
    };
    return iconMap[type] || 'HelpCircle';
  };

  const getVisibilityColor = (visibility) => {
    const colorMap = {
      Updateable: 'bg-green-100 text-green-800',
      ReadOnly: 'bg-yellow-100 text-yellow-800',
      System: 'bg-gray-100 text-gray-800'
    };
    return colorMap[visibility] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ApperIcon name="Loader2" className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customize</h1>
            <p className="text-gray-600 mt-2">Manage your custom tables and fields</p>
          </div>
          <Button
            onClick={() => setShowCreateTableModal(true)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Create Table
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tables List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tables</h2>
            <div className="space-y-2">
              {tables.map((table) => (
                <div
                  key={table.id}
                  onClick={() => handleTableSelect(table)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedTable?.id === table.id
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{table.label}</div>
                      <div className="text-sm text-gray-500">{table.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {table.fieldCount} fields
                        </span>
                        {table.isCustom && (
                          <Badge variant="outline" className="text-xs">
                            Custom
                          </Badge>
                        )}
                      </div>
                    </div>
                    {table.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTable(table.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Details */}
        <div className="lg:col-span-2">
          {selectedTable ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedTable.label} Fields
                  </h2>
                  <p className="text-gray-600">{selectedTable.description}</p>
                </div>
                <Button
                  onClick={() => setShowAddFieldModal(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ApperIcon name="Plus" size={16} />
                  Add Field
                </Button>
              </div>

              {fieldsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <ApperIcon name="Loader2" className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : fields.length > 0 ? (
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <ApperIcon
                              name={getFieldTypeIcon(field.type)}
                              size={16}
                              className="text-gray-600"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 ml-1">*</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {field.name} • {field.type}
                            </div>
                            {field.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {field.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVisibilityColor(field.visibility)}`}>
                            {field.visibility}
                          </span>
                          <button
                            onClick={() => handleDeleteField(field.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Database" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No fields found for this table</p>
                  <Button
                    onClick={() => setShowAddFieldModal(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    Add First Field
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center py-12">
                <ApperIcon name="Table" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Table
                </h3>
                <p className="text-gray-500 mb-6">
                  Choose a table from the list to view and manage its fields
                </p>
                <Button
                  onClick={() => setShowCreateTableModal(true)}
                  className="flex items-center gap-2 mx-auto"
                >
                  <ApperIcon name="Plus" size={16} />
                  Create New Table
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CustomTableModal
        isOpen={showCreateTableModal}
        onClose={() => setShowCreateTableModal(false)}
        onSubmit={handleCreateTable}
      />

      <AddFieldModal
        isOpen={showAddFieldModal}
        onClose={() => setShowAddFieldModal(false)}
        onSubmit={handleAddField}
        tableName={selectedTable?.label || ''}
      />
    </div>
  );
};

export default Customize;