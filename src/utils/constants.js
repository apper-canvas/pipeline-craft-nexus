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

export const TASK_STATUSES = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress", 
  COMPLETED: "Completed",
  BLOCKED: "Blocked"
}

export const TASK_PRIORITIES = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High", 
  URGENT: "Urgent"
}

export const STATUS_COLORS = {
  [TASK_STATUSES.OPEN]: "gray",
  [TASK_STATUSES.IN_PROGRESS]: "blue",
  [TASK_STATUSES.COMPLETED]: "green",
  [TASK_STATUSES.BLOCKED]: "red"
}

export const PRIORITY_COLORS = {
  [TASK_PRIORITIES.LOW]: "gray",
  [TASK_PRIORITIES.NORMAL]: "blue",
  [TASK_PRIORITIES.HIGH]: "amber",
  [TASK_PRIORITIES.URGENT]: "red"
}

export const QUOTE_STATUSES = {
  DRAFT: "Draft",
  SENT: "Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected"
}

export const QUOTE_STATUS_COLORS = {
  [QUOTE_STATUSES.DRAFT]: "gray",
  [QUOTE_STATUSES.SENT]: "blue", 
  [QUOTE_STATUSES.ACCEPTED]: "green",
  [QUOTE_STATUSES.REJECTED]: "red"
}