export type DocumentStatus = 'Draft' | 'Review' | 'Approved' | 'Rejected'

export interface DocumentItem {
  id: string
  title: string
  description: string
  category: string
  status: DocumentStatus
  createdAt: string
  updatedAt: string
  aiSummary?: string
  aiSuggestedCategory?: string
}
