import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ContactDetail from "@/components/organisms/ContactDetail";
import AddContactModal from "@/components/organisms/AddContactModal";
import Header from "@/components/organisms/Header";
import ContactListItem from "@/components/molecules/ContactListItem";

const Contacts = () => {
const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddContact, setShowAddContact] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")
  const [selectedContact, setSelectedContact] = useState(null)
  const [selectedDeals, setSelectedDeals] = useState([])
  const [contactActivities, setContactActivities] = useState([])
  const [showContactDetail, setShowContactDetail] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const location = useLocation()
  
  useEffect(() => {
    loadData()
    
    // Handle contact selection from navigation state
    if (location.state?.selectedContact) {
      setTimeout(() => {
        handleContactClick(location.state.selectedContact)
      }, 100)
    }
  }, [location.state])
  
  useEffect(() => {
    filterAndSortContacts()
  }, [contacts, searchQuery, sortBy, sortOrder])
  
  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
      setActivities(activitiesData)
    } catch (err) {
      setError("Failed to load contacts. Please try again.")
      console.error("Load data error:", err)
    } finally {
      setLoading(false)
    }
  }
  
const filterAndSortContacts = () => {
    let filtered = contacts
    
    if (searchQuery.trim()) {
      filtered = contacts.filter(contact =>
        (contact?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact?.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact?.email || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case "name":
          aValue = (a?.name || "").toLowerCase()
          bValue = (b?.name || "").toLowerCase()
          break
        case "company":
          aValue = (a?.company || "").toLowerCase()
          bValue = (b?.company || "").toLowerCase()
          break
        case "created":
          aValue = new Date(a?.createdAt || 0)
          bValue = new Date(b?.createdAt || 0)
          break
        default:
          aValue = (a?.name || "").toLowerCase()
          bValue = (b?.name || "").toLowerCase()
      }
      
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })
    
    setFilteredContacts(filtered)
  }
  
  const handleSearch = (query) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    
    const results = contacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      (contact.company && contact.company.toLowerCase().includes(query.toLowerCase())) ||
      (contact.email && contact.email.toLowerCase().includes(query.toLowerCase()))
    )
    
    setSearchResults(results)
  }
  
  const handleSearchResultClick = (contact) => {
    handleContactClick(contact)
    setSearchResults([])
  }
  
const handleContactClick = (contact) => {
    const contactDeals = deals.filter(deal => deal.contactId === contact.Id)
    const contactActivitiesFiltered = activities.filter(activity => 
      contactDeals.some(deal => deal.Id === activity.dealId)
    )
    
    setSelectedContact(contact)
    setSelectedDeals(contactDeals)
    setContactActivities(contactActivitiesFiltered)
    setShowContactDetail(true)
  }
  
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }
  
const getDealsForContact = (contactId) => {
    return deals.filter(deal => deal.contactId === contactId)
  }
  
  const handleContactAdded = async (contact) => {
    setContacts(prev => [...prev, contact])
  }
  
  const handleDealAdded = async (deal) => {
    setDeals(prev => [...prev, deal])
    
    // Create activity record
    try {
      await activityService.create({
        dealId: deal.Id,
        type: "deal_created",
        fromStage: "",
        toStage: deal.stage
      })
      
      const updatedActivities = await activityService.getAll()
      setActivities(updatedActivities)
    } catch (error) {
      console.error("Failed to create activity:", error)
    }
  }
  
  const getSortIcon = (field) => {
    if (sortBy !== field) return "ArrowUpDown"
    return sortOrder === "asc" ? "ArrowUp" : "ArrowDown"
  }
  
  if (loading) {
    return <Loading type="pipeline" />
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
<Header
        onSearch={handleSearch}
        searchResults={searchResults}
        onSearchResultClick={handleSearchResultClick}
      />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Contacts
          </h1>
          <p className="text-gray-600">
            Manage your customer relationships and contact information
          </p>
        </div>
        
        {contacts.length === 0 ? (
          <Empty
            icon="Users"
            title="No contacts yet"
            description="Start building your customer database by adding your first contact."
            action={() => {
setShowAddContact(true)
            }}
            actionLabel="Add Your First Contact"
          />
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
<div className="px-6 py-4 border-b border-gray-200/60 bg-gradient-to-r from-gray-50/80 to-white/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    All Contacts ({filteredContacts.length})
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="primary"
                    size="default"
                    onClick={() => setShowAddContact(true)}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="UserPlus" className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Contact</span>
                  </Button>
                  <div className="text-sm text-gray-500">
                    {searchQuery && `Filtered by "${searchQuery}"`}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/60">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("name")}
                        className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        <span>Contact</span>
                        <ApperIcon name={getSortIcon("name")} className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("company")}
                        className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        <span>Company</span>
                        <ApperIcon name={getSortIcon("company")} className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deals
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left">
                      <button
                        onClick={() => handleSort("created")}
                        className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
                      >
                        <span>Added</span>
                        <ApperIcon name={getSortIcon("created")} className="w-4 h-4" />
                      </button>
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/60">
                  {filteredContacts.map((contact) => (
                    <ContactListItem
                      key={contact.Id}
                      contact={contact}
                      deals={getDealsForContact(contact.Id)}
                      onClick={handleContactClick}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredContacts.length === 0 && searchQuery && (
              <div className="p-8 text-center">
                <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No contacts found
                </h3>
                <p className="text-gray-600">
                  No contacts match your search for "{searchQuery}". Try a different search term.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
<AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSuccess={(contact) => {
          handleContactAdded(contact)
          setShowAddContact(false)
        }}
      />
      <ContactDetail
        contact={selectedContact}
        deals={selectedDeals}
        activities={contactActivities}
        isOpen={showContactDetail}
        onClose={() => setShowContactDetail(false)}
        onEditContact={(contact) => {
          // Could open an edit modal here
          toast.info("Edit functionality coming soon!")
        }}
      />
    </div>
  )
}

export default Contacts