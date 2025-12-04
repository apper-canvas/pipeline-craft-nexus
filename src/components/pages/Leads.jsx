import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import SearchBar from '@/components/molecules/SearchBar'
import LeadListItem from '@/components/molecules/LeadListItem'
import AddLeadModal from '@/components/organisms/AddLeadModal'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { leadService } from '@/services/api/leadService'

const Leads = () => {
  const [leads, setLeads] = useState([])
  const [filteredLeads, setFilteredLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [sortField, setSortField] = useState('CreatedOn')
  const [sortDirection, setSortDirection] = useState('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)

  // Status and source options for filtering
  const statusOptions = ['New', 'Contacted', 'Qualified', 'Lost']
  const sourceOptions = ['Web', 'Referral', 'Trade Show', 'Other']

  useEffect(() => {
    fetchLeads()
  }, [])

  useEffect(() => {
    filterAndSortLeads()
  }, [leads, searchTerm, statusFilter, sourceFilter, sortField, sortDirection])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await leadService.getAll()
      setLeads(data || [])
    } catch (err) {
      console.error('Error fetching leads:', err)
      setError('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortLeads = () => {
    let filtered = [...leads]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(lead => {
        const searchLower = searchTerm.toLowerCase()
        const fullName = `${lead.first_name_c || ''} ${lead.last_name_c || ''}`.toLowerCase()
        return (
          fullName.includes(searchLower) ||
          (lead.company_c && lead.company_c.toLowerCase().includes(searchLower)) ||
          (lead.email_c && lead.email_c.toLowerCase().includes(searchLower)) ||
          (lead.phone_c && lead.phone_c.toLowerCase().includes(searchLower)) ||
          (lead.title_c && lead.title_c.toLowerCase().includes(searchLower)) ||
          (lead.industry_c && lead.industry_c.toLowerCase().includes(searchLower))
        )
      })
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(lead => lead.status_c === statusFilter)
    }

    // Apply source filter
    if (sourceFilter) {
      filtered = filtered.filter(lead => lead.source_c === sourceFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortField) {
        case 'name':
          aValue = `${a.first_name_c || ''} ${a.last_name_c || ''}`.toLowerCase()
          bValue = `${b.first_name_c || ''} ${b.last_name_c || ''}`.toLowerCase()
          break
        case 'company':
          aValue = (a.company_c || '').toLowerCase()
          bValue = (b.company_c || '').toLowerCase()
          break
        case 'status':
          aValue = (a.status_c || '').toLowerCase()
          bValue = (b.status_c || '').toLowerCase()
          break
        case 'source':
          aValue = (a.source_c || '').toLowerCase()
          bValue = (b.source_c || '').toLowerCase()
          break
        case 'CreatedOn':
          aValue = new Date(a.CreatedOn || 0)
          bValue = new Date(b.CreatedOn || 0)
          break
        case 'annual_revenue':
          aValue = parseFloat(a.annual_revenue_c || 0)
          bValue = parseFloat(b.annual_revenue_c || 0)
          break
        default:
          return 0
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredLeads(filtered)
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleAddLead = async (leadData) => {
    try {
      const result = await leadService.create(leadData)
      if (result) {
        await fetchLeads()
        setIsAddModalOpen(false)
      }
    } catch (error) {
      console.error('Error adding lead:', error)
    }
  }

  const handleEditLead = (lead) => {
    setEditingLead(lead)
    setIsAddModalOpen(true)
  }

  const handleUpdateLead = async (leadData) => {
    try {
      const result = await leadService.update(editingLead.Id, leadData)
      if (result) {
        await fetchLeads()
        setIsAddModalOpen(false)
        setEditingLead(null)
      }
    } catch (error) {
      console.error('Error updating lead:', error)
    }
  }

  const handleDeleteLead = async (leadId) => {
    try {
      const success = await leadService.delete(leadId)
      if (success) {
        await fetchLeads()
      }
    } catch (error) {
      console.error('Error deleting lead:', error)
    }
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setEditingLead(null)
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown'
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'new': return 'blue'
      case 'contacted': return 'indigo'
      case 'qualified': return 'green'
      case 'lost': return 'red'
      default: return 'gray'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Loading className="h-64" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorView
          message={error}
          onRetry={fetchLeads}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Manage your sales leads and prospects</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200/60 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search leads by name, company, email, phone, title, or industry..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Sources</option>
              {sourceOptions.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200/60 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            </div>
          </div>
        </div>
        {statusOptions.map(status => {
          const count = leads.filter(lead => lead.status_c === status).length
          return (
            <div key={status} className="bg-white rounded-xl border border-gray-200/60 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Badge variant={getStatusColor(status)} className="w-8 h-8 rounded-lg flex items-center justify-center">
                    {status[0]}
                  </Badge>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{status}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-xl border border-gray-200/60 p-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 py-2">Sort by:</span>
          {[
            { field: 'name', label: 'Name' },
            { field: 'company', label: 'Company' },
            { field: 'status', label: 'Status' },
            { field: 'source', label: 'Source' },
            { field: 'annual_revenue', label: 'Revenue' },
            { field: 'CreatedOn', label: 'Created Date' }
          ].map(({ field, label }) => (
            <Button
              key={field}
              variant={sortField === field ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleSort(field)}
              className="flex items-center"
            >
              {label}
              <ApperIcon 
                name={getSortIcon(field)} 
                className="w-3 h-3 ml-1" 
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {filteredLeads.length} of {leads.length} leads
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <Empty
          title="No leads found"
          description={searchTerm || statusFilter || sourceFilter ? 
            "Try adjusting your search or filters to find leads." :
            "Get started by adding your first lead to track prospects and opportunities."
          }
          action={
            <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center">
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredLeads.map((lead) => (
            <LeadListItem
              key={lead.Id}
              lead={lead}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Lead Modal */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingLead ? handleUpdateLead : handleAddLead}
        lead={editingLead}
      />
    </div>
  )
}

export default Leads