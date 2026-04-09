import { apiRequest } from './api'

export interface Comment {
  id: string
  text: string
  documentId: string
  authorId: string
  author: { id: string; username: string; email: string; role: string }
  createdAt: string
}

export async function getComments(documentId: string): Promise<Comment[]> {
  return apiRequest<Comment[]>(`/documents/${documentId}/comments`)
}

export async function addComment(documentId: string, text: string): Promise<Comment> {
  return apiRequest<Comment>(`/documents/${documentId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}
