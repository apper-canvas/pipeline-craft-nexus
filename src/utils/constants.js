export const DEAL_STAGES = {
  LEAD: "Lead",
  QUALIFIED: "Qualified", 
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED: "Closed"
}

export const STAGE_COLORS = {
  [DEAL_STAGES.LEAD]: "blue",
  [DEAL_STAGES.QUALIFIED]: "indigo",
  [DEAL_STAGES.PROPOSAL]: "purple", 
  [DEAL_STAGES.NEGOTIATION]: "amber",
  [DEAL_STAGES.CLOSED]: "green"
}

export const ACTIVITY_TYPES = {
  DEAL_CREATED: "deal_created",
  STAGE_CHANGED: "stage_changed",
  CONTACT_UPDATED: "contact_updated"
}