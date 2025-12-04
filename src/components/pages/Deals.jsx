import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import SearchBar from '@/components/molecules/SearchBar'
import AddDealModal from '@/components/organisms/AddDealModal'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { DEAL_STAGES, STAGE_COLORS } from '@/utils/constants'
import { cn } from '@/utils/cn'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState('All')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showAddDeal, setShowAddDeal] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')
    
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load deals. Please try again.')
      console.error('Load data error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getContactForDeal = (dealContactId) => {
    return contacts.find(contact => contact?.Id === dealContactId)
  }

  const filteredAndSortedDeals = deals
    .filter(deal => {
      const contact = getContactForDeal(deal.contactId)
      const matchesSearch = !searchQuery || 
        (deal?.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deal?.stage || '').toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStage = stageFilter === 'All' || deal?.stage === stageFilter
      
      return matchesSearch && matchesStage
    })
    .sort((a, b) => {
      let aVal, bVal
      
      switch (sortBy) {
        case 'title':
          aVal = a?.title || ''
          bVal = b?.title || ''
          break
        case 'value':
          aVal = a?.value || 0
          bVal = b?.value || 0
          break
        case 'stage':
          aVal = a?.stage || ''
          bVal = b?.stage || ''
          break
        case 'contact':
          const aContact = getContactForDeal(a.contactId)
          const bContact = getContactForDeal(b.contactId)
          aVal = aContact?.name || ''
          bVal = bContact?.name || ''
          break
        default:
          aVal = a?.createdAt || ''
          bVal = b?.createdAt || ''
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    })

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return 'ChevronsUpDown'
    return sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'
  }

  const handleAddDeal = () => {
    setEditingDeal(null)
    setShowAddDeal(true)
  }

  const handleEditDeal = (deal) => {
    setEditingDeal(deal)
    setShowAddDeal(true)
  }

  const handleDeleteDeal = async (deal) => {
    if (!window.confirm(`Are you sure you want to delete the deal "${deal.title}"?`)) {
      return
    }

    try {
      await dealService.delete(deal.Id)
      setDeals(prev => prev.filter(d => d.Id !== deal.Id))
      toast.success('Deal deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete deal. Please try again.')
      console.error('Delete deal error:', error)
    }
  }

  const handleDealSuccess = (deal) => {
    if (editingDeal) {
      setDeals(prev => prev.map(d => d.Id === deal.Id ? deal : d))
      toast.success('Deal updated successfully!')
    } else {
      setDeals(prev => [...prev, deal])
      toast.success('Deal added successfully!')
    }
    setShowAddDeal(false)
    setEditingDeal(null)
  }

  const getStageColor = (stage) => {
    const colors = {
      'Lead': 'blue',
      'Qualified': 'indigo', 
      'Proposal': 'purple',
      'Negotiation': 'amber',
      'Closed': 'green'
    }
    return colors[stage] || 'gray'
  }

  if (loading) {
    return <Loading type="deals" />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-6 py-16">
          <ErrorView 
            message={error}
            onRetry={loadData}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                Deals
              </h1>
              <p className="text-gray-600">
                Manage your sales opportunities and track deal progress
              </p>
            </div>
            <Button
              variant="primary"
              size="default"
              onClick={handleAddDeal}
              className="flex items-center space-x-2 self-start sm:self-center"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Add Deal</span>
            </Button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search deals by title, contact, or stage..."
              onSearch={handleSearch}
              className="w-full"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Stages</option>
              {Object.values(DEAL_STAGES).map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Deals List */}
        {filteredAndSortedDeals.length === 0 ? (
          <Empty
            icon="Handshake"
            title="No deals found"
            description={searchQuery || stageFilter !== 'All' 
              ? "Try adjusting your search or filters to find deals."
              : "Start by adding your first deal to track sales opportunities."
            }
            action={handleAddDeal}
            actionLabel="Add Your First Deal"
            className="min-h-[400px]"
          />
        ) : (
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 border-b border-gray-200/60 bg-gray-50/50 text-sm font-medium text-gray-700">
              <div className="lg:col-span-3">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                >
                  <span>Deal Title</span>
                  <ApperIcon name={getSortIcon('title')} className="w-3 h-3" />
                </button>
              </div>
              <div className="lg:col-span-2">
                <button
                  onClick={() => handleSort('contact')}
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                >
                  <span>Contact</span>
                  <ApperIcon name={getSortIcon('contact')} className="w-3 h-3" />
                </button>
              </div>
              <div className="lg:col-span-2">
                <button
                  onClick={() => handleSort('value')}
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                >
                  <span>Value</span>
                  <ApperIcon name={getSortIcon('value')} className="w-3 h-3" />
                </button>
              </div>
              <div className="lg:col-span-2">
                <button
                  onClick={() => handleSort('stage')}
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                >
                  <span>Stage</span>
                  <ApperIcon name={getSortIcon('stage')} className="w-3 h-3" />
                </button>
              </div>
              <div className="lg:col-span-2">
                <button
                  onClick={() => handleSort('createdAt')}
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                >
                  <span>Created</span>
                  <ApperIcon name={getSortIcon('createdAt')} className="w-3 h-3" />
                </button>
              </div>
              <div className="lg:col-span-1">
                <span>Actions</span>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200/60">
              {filteredAndSortedDeals.map((deal) => {
                const contact = getContactForDeal(deal.contactId)
                const stageColor = getStageColor(deal.stage)
                
                return (
                  <div
                    key={deal.Id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="lg:col-span-3">
                      <div className="font-medium text-gray-900 mb-1">
                        {deal.title}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="text-gray-900">
                        {contact?.name || 'Unknown Contact'}
                      </div>
                      {contact?.company && (
                        <div className="text-sm text-gray-500">
                          {contact.company}
                        </div>
                      )}
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(deal.value)}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <Badge
                        variant={stageColor}
                        size="sm"
                        className="inline-flex"
                      >
                        {deal.stage}
                      </Badge>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <div className="text-gray-600 text-sm">
                        {formatDate(deal.createdAt)}
                      </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDeal(deal)}
                          className="p-1 hover:bg-gray-100"
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDeal(deal)}
                          className="p-1 hover:bg-red-50 hover:text-red-600"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Deal Modal */}
      <AddDealModal
        isOpen={showAddDeal}
        onClose={() => {
          setShowAddDeal(false)
          setEditingDeal(null)
        }}
        onSuccess={handleDealSuccess}
        deal={editingDeal}
      />
    </div>
  )
}

export default Deals