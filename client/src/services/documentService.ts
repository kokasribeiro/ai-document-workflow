import { apiRequest } from './api'
import type { DocumentCreatePayload, DocumentItem } from '../types/document'

export async function getDocuments(): Promise<DocumentItem[]> {
  return apiRequest<DocumentItem[]>('/documents')
}

export async function getDocumentById(id: string): Promise<DocumentItem> {
  return apiRequest<DocumentItem>(`/documents/${id}`)
}

export async function createDocument(payload: DocumentCreatePayload): Promise<DocumentItem> {
  return apiRequest<DocumentItem>('/documents', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateDocument(
  id: string,
  payload: Partial<Omit<DocumentItem, 'id'>>
): Promise<DocumentItem> {
  return apiRequest<DocumentItem>(`/documents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export async function deleteDocument(id: string): Promise<void> {
  await apiRequest<void>(`/documents/${id}`, {
    method: 'DELETE',
  })
}
