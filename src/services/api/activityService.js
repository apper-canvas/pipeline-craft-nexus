import activitiesData from "@/services/mockData/activities.json"

// In-memory storage simulation
let activities = [...activitiesData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const activityService = {
  async getAll() {
    await delay(250)
    return [...activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async getById(id) {
    await delay(200)
    const activity = activities.find(a => a.Id === parseInt(id))
    if (!activity) {
      throw new Error("Activity not found")
    }
    return { ...activity }
  },

  async create(activityData) {
    await delay(300)
    
    // Generate new ID
    const maxId = activities.length > 0 ? Math.max(...activities.map(a => a.Id)) : 0
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    }
    
    activities.push(newActivity)
    return { ...newActivity }
  },

  async getByDealId(dealId) {
    await delay(200)
    return activities
      .filter(a => a.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  },

  async delete(id) {
    await delay(250)
    
    const index = activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Activity not found")
    }
    
    activities.splice(index, 1)
    return true
  }
}