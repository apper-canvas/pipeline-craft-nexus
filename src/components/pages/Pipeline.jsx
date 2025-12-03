import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { activityService } from "@/services/api/activityService";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import ContactDetail from "@/components/organisms/ContactDetail";
import Header from "@/components/organisms/Header";

const Pipeline = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [selectedDeals, setSelectedDeals] = useState([])
  const [contactActivities, setContactActivities] = useState([])
  const [showContactDetail, setShowContactDetail] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    setLoading(true)
    setError("")
    
    try {
const [dealsData, contactsData, activitiesData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll(),
        activityService.getAll()
      ])
      
      setDeals(dealsData)
      setContacts(contactsData)
      setActivities(activitiesData)
    } catch (err) {
      setError("Failed to load pipeline data. Please try again.")
      console.error("Load data error:", err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (query) => {
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
    const contactDeals = deals.filter(deal => deal.contactId === contact.Id)
    const contactActivitiesFiltered = activities.filter(activity => 
      contactDeals.some(deal => deal.Id === activity.dealId)
    )
    
    setSelectedContact(contact)
    setSelectedDeals(contactDeals)
    setContactActivities(contactActivitiesFiltered)
    setShowContactDetail(true)
    setSearchResults([])
  }
  
  const handleDealClick = (deal, contact) => {
    if (contact) {
      handleSearchResultClick(contact)
    }
  }
  
const handleStageChange = async (dealId, newStage) => {
    const deal = deals.find(d => d.Id === dealId)
    if (!deal) return
    
    try {
      const oldStage = deal.stage
      
      // Update deal stage
      const updatedDeal = await dealService.update(dealId, { 
        stage: newStage,
        movedToStageAt: new Date().toISOString()
      })
      
      // Create activity record
      await activityService.create({
        dealId: dealId,
        type: "stage_changed",
        fromStage: oldStage,
        toStage: newStage
      })
      
      // Update local state
      setDeals(prev => prev.map(d => 
        d.Id === dealId ? updatedDeal : d
      ))
      
      // Reload activities
      const updatedActivities = await activityService.getAll()
      setActivities(updatedActivities)
      
      toast.success(`Deal moved to ${newStage}`)
    } catch (error) {
      toast.error("Failed to update deal stage")
      console.error("Stage change error:", error)
    }
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
        onContactAdded={handleContactAdded}
        onDealAdded={handleDealAdded}
      />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Sales Pipeline
          </h1>
          <p className="text-gray-600">
            Track and manage your deals through the sales process
          </p>
        </div>
        
        <PipelineBoard
          deals={deals}
          contacts={contacts}
          onDealClick={handleDealClick}
          onStageChange={handleStageChange}
          onAddDeal={() => {
            // Trigger add deal modal through header
            document.querySelector('button[data-action="add-deal"]')?.click()
          }}
        />
      </main>
      
      <ContactDetail
        contact={selectedContact}
        deals={selectedDeals}
        activities={contactActivities}
        isOpen={showContactDetail}
        onClose={() => setShowContactDetail(false)}
        onEditContact={(contact) => {
          // Navigate to contacts page with selected contact
          navigate("/contacts", { state: { selectedContact: contact } })
        }}
      />
    </div>
  )
}

export default Pipeline