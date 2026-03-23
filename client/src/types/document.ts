import type { DOCUMENT_STATUSES } from '../constants/documents'

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

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

/** Fields sent when creating a document (server sets timestamps). */
export type DocumentCreatePayload = Pick<
  DocumentItem,
  'title' | 'description' | 'category' | 'status'
> & {
  aiSummary?: string
  aiSuggestedCategory?: string
}
