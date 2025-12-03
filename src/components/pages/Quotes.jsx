import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import ApperIcon from "@/components/ApperIcon"
import { quoteService } from "@/services/api/quoteService"
import { dealService } from "@/services/api/dealService"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import QuoteListItem from "@/components/molecules/QuoteListItem"
import AddQuoteModal from "@/components/organisms/AddQuoteModal"

const Quotes = () => {
  const [quotes, setQuotes] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingQuote, setEditingQuote] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [quotesData, dealsData] = await Promise.all([
        quoteService.getAll(),
        dealService.getAll()
      ])
      setQuotes(quotesData)
      setDeals(dealsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuote = async (quoteData) => {
    const result = await quoteService.create(quoteData)
    if (result) {
      toast.success("Quote created successfully!")
      setIsAddModalOpen(false)
      loadData()
    }
  }

  const handleUpdateQuote = async (quoteData) => {
    const result = await quoteService.update(editingQuote.Id, quoteData)
    if (result) {
      toast.success("Quote updated successfully!")
      setEditingQuote(null)
      loadData()
    }
  }

  const handleDeleteQuote = async (id) => {
    if (!confirm("Are you sure you want to delete this quote?")) return
    
    const success = await quoteService.delete(id)
    if (success) {
      toast.success("Quote deleted successfully!")
      loadData()
    }
  }

  const filteredQuotes = quotes.filter(quote =>
    quote.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.deal_id_c?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.status_c?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          onRetry={loadData}
        />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quotes</h1>
          <p className="text-gray-600">
            Manage your sales quotes and proposals
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <ApperIcon name="Plus" size={20} />
          Add Quote
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search quotes by name, deal, or status..."
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <ApperIcon name="FileText" size={20} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <ApperIcon name="Send" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-blue-600">
                {quotes.filter(q => q.status_c === 'Sent').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {quotes.filter(q => q.status_c === 'Accepted').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <ApperIcon name="XCircle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {quotes.filter(q => q.status_c === 'Rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <Empty
          title={searchTerm ? "No quotes found" : "No quotes yet"}
          description={
            searchTerm
              ? "Try adjusting your search terms"
              : "Create your first quote to get started"
          }
          action={
            !searchTerm && (
              <Button onClick={() => setIsAddModalOpen(true)}>
                <ApperIcon name="Plus" size={16} />
                Add Quote
              </Button>
            )
          }
        />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredQuotes.map((quote) => (
              <QuoteListItem
                key={quote.Id}
                quote={quote}
                onEdit={setEditingQuote}
                onDelete={handleDeleteQuote}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Quote Modal */}
      {isAddModalOpen && (
        <AddQuoteModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddQuote}
          deals={deals}
        />
      )}

      {/* Edit Quote Modal */}
      {editingQuote && (
        <AddQuoteModal
          quote={editingQuote}
          onClose={() => setEditingQuote(null)}
          onSubmit={handleUpdateQuote}
          deals={deals}
        />
      )}
    </div>
  )
}

export default Quotes