import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import SearchBar from '@/components/molecules/SearchBar'
import CompanyListItem from '@/components/molecules/CompanyListItem'
import AddCompanyModal from '@/components/organisms/AddCompanyModal'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { companyService } from '@/services/api/companyService'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await companyService.getAll()
      setCompanies(data)
      setFilteredCompanies(data)
    } catch (err) {
      setError('Failed to load companies')
      console.error('Error loading companies:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCompanies(companies)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = companies.filter(company => 
      company.Name?.toLowerCase().includes(query) ||
      company.industry_c?.toLowerCase().includes(query) ||
      company.city_c?.toLowerCase().includes(query) ||
      company.Tags?.toLowerCase().includes(query)
    )
    setFilteredCompanies(filtered)
  }, [searchQuery, companies])

  const handleAddCompany = async (companyData) => {
    const newCompany = await companyService.create(companyData)
    if (newCompany) {
      await fetchCompanies()
      setShowAddModal(false)
    }
  }

  const handleEditCompany = (company) => {
    setEditingCompany(company)
    setShowAddModal(true)
  }

  const handleUpdateCompany = async (companyData) => {
    if (editingCompany) {
      const updatedCompany = await companyService.update(editingCompany.Id, companyData)
      if (updatedCompany) {
        await fetchCompanies()
        setShowAddModal(false)
        setEditingCompany(null)
      }
    }
  }

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      const success = await companyService.delete(companyId)
      if (success) {
        await fetchCompanies()
      }
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingCompany(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <Header />
        <Loading className="mt-8" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <Header />
        <ErrorView 
          message={error}
          onRetry={fetchCompanies}
          className="mt-8"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
            <p className="text-gray-600 mt-1">
              Manage your company database and business relationships
            </p>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={20} />
            Add Company
          </Button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200/60">
            <SearchBar
              placeholder="Search companies..."
              onSearch={setSearchQuery}
              className="max-w-md"
            />
          </div>

          <div className="divide-y divide-gray-200/60">
            {filteredCompanies.length === 0 ? (
              <div className="p-12">
                {searchQuery ? (
                  <Empty
                    icon="Search"
                    title="No companies found"
                    description={`No companies match "${searchQuery}". Try adjusting your search.`}
                    action={
                      <Button
                        onClick={() => setSearchQuery('')}
                        variant="outline"
                        className="mt-4"
                      >
                        Clear search
                      </Button>
                    }
                  />
                ) : (
                  <Empty
                    icon="Building2"
                    title="No companies yet"
                    description="Get started by adding your first company to the database."
                    action={
                      <Button
                        onClick={() => setShowAddModal(true)}
                        className="mt-4 bg-primary hover:bg-primary/90 text-white"
                      >
                        <ApperIcon name="Plus" size={16} className="mr-2" />
                        Add Company
                      </Button>
                    }
                  />
                )}
              </div>
            ) : (
              filteredCompanies.map(company => (
                <CompanyListItem
                  key={company.Id}
                  company={company}
                  onEdit={() => handleEditCompany(company)}
                  onDelete={() => handleDeleteCompany(company.Id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Companies</p>
                <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building2" size={24} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Industries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(companies.filter(c => c.industry_c).map(c => c.industry_c)).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Factory" size={24} className="text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {companies.filter(c => {
                    const createdDate = new Date(c.CreatedOn)
                    const now = new Date()
                    return createdDate.getMonth() === now.getMonth() && 
                           createdDate.getFullYear() === now.getFullYear()
                  }).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" size={24} className="text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddCompanyModal
          isOpen={showAddModal}
          onClose={handleCloseModal}
          onSubmit={editingCompany ? handleUpdateCompany : handleAddCompany}
          company={editingCompany}
          title={editingCompany ? 'Edit Company' : 'Add New Company'}
        />
      )}
    </div>
  )
}

export default Companies