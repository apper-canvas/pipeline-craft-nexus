import { format, formatDistanceToNow } from "date-fns"

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date) => {
  return format(new Date(date), "MMM dd, yyyy")
}

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const getDaysInStage = (movedToStageAt) => {
  const now = new Date()
  const movedDate = new Date(movedToStageAt)
  const diffTime = Math.abs(now - movedDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}