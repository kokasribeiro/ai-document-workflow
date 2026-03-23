import { API_BASE_URL } from './api'
import type { DocumentItem } from '../types/document'

export async function getDocuments(): Promise<DocumentItem[]> {
  const response = await fetch(`${API_BASE_URL}/documents`)
  if (!response.ok) throw new Error('Failed to fetch documents')
  return response.json()
}

export async function getDocumentById(id: string): Promise<DocumentItem> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`)
  if (!response.ok) throw new Error('Failed to fetch document')
  return response.json()
}

export async function createDocument(
  payload: Omit<DocumentItem, 'id'>
): Promise<DocumentItem> {
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('Failed to create document')
  return response.json()
}

export async function updateDocument(
  id: string,
  payload: Partial<Omit<DocumentItem, 'id'>>
): Promise<DocumentItem> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('Failed to update document')
  return response.json()
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) throw new Error('Failed to delete document')
}
