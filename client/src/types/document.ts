export type DocumentStatus = 'draft' | 'processing' | 'completed' | 'error'

export interface DocumentItem {
  id: string
  title: string
  category: string
  status: DocumentStatus
  createdAt: string
  summary?: string
}

export interface DocumentFilters {
  query: string
  status: DocumentStatus | 'all'
  category: string | 'all'
}
