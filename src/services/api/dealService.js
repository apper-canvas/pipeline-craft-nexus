import dealsData from "@/services/mockData/deals.json"

// In-memory storage simulation
let deals = [...dealsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const dealService = {
  async getAll() {
    await delay(350)
    return [...deals]
  },

  async getById(id) {
    await delay(200)
    const deal = deals.find(d => d.Id === parseInt(id))
    if (!deal) {
      throw new Error("Deal not found")
    }
    return { ...deal }
  },

  async create(dealData) {
    await delay(500)
    
    // Generate new ID
    const maxId = deals.length > 0 ? Math.max(...deals.map(d => d.Id)) : 0
    const now = new Date().toISOString()
    
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: now,
      updatedAt: now,
      movedToStageAt: now
    }
    
    deals.push(newDeal)
    return { ...newDeal }
  },

  async update(id, updates) {
    await delay(400)
    
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    
    deals[index] = {
      ...deals[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...deals[index] }
  },

  async delete(id) {
    await delay(300)
    
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Deal not found")
    }
    
    deals.splice(index, 1)
    return true
  },

  async getByContactId(contactId) {
    await delay(250)
    return deals.filter(d => d.contactId === parseInt(contactId))
  },

  async getByStage(stage) {
    await delay(250)
    return deals.filter(d => d.stage === stage)
  }
}