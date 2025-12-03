import contactsData from "@/services/mockData/contacts.json"

// In-memory storage simulation
let contacts = [...contactsData]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const contactService = {
  async getAll() {
    await delay(300)
    return [...contacts]
  },

  async getById(id) {
    await delay(200)
    const contact = contacts.find(c => c.Id === parseInt(id))
    if (!contact) {
      throw new Error("Contact not found")
    }
    return { ...contact }
  },

  async create(contactData) {
    await delay(400)
    
    // Generate new ID
    const maxId = contacts.length > 0 ? Math.max(...contacts.map(c => c.Id)) : 0
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    contacts.push(newContact)
    return { ...newContact }
  },

  async update(id, updates) {
    await delay(400)
    
    const index = contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    
    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...contacts[index] }
  },

  async delete(id) {
    await delay(300)
    
    const index = contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Contact not found")
    }
    
    contacts.splice(index, 1)
    return true
  }
}