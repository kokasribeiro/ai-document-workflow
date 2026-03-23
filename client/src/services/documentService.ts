import { API_BASE_URL } from './api'
import type { DocumentItem } from '../types/document'

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string }
    return data.error || fallback
  } catch {
    return fallback
  }
}

export async function getDocuments(): Promise<DocumentItem[]> {
  const response = await fetch(`${API_BASE_URL}/documents`)
  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Failed to fetch documents')
    throw new Error(message)
  }
  return response.json()
}

export async function getDocumentById(id: string): Promise<DocumentItem> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`)
  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Failed to fetch document')
    throw new Error(message)
  }
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

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Failed to create document')
    throw new Error(message)
  }
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

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Failed to update document')
    throw new Error(message)
  }
  return response.json()
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Failed to delete document')
    throw new Error(message)
  }
}
