import type { DocumentItem } from '../types/document'

const mockDocuments: DocumentItem[] = [
  {
    id: 'doc-1',
    title: 'Invoice March',
    category: 'finance',
    status: 'completed',
    createdAt: new Date().toISOString(),
    summary: 'Monthly invoice with totals.',
  },
  {
    id: 'doc-2',
    title: 'Employment Contract',
    category: 'legal',
    status: 'processing',
    createdAt: new Date().toISOString(),
  },
]

export async function getDocuments(): Promise<DocumentItem[]> {
  return Promise.resolve(mockDocuments)
}

export async function getDocumentById(id: string): Promise<DocumentItem | undefined> {
  return Promise.resolve(mockDocuments.find((doc) => doc.id === id))
}

export async function createDocument(input: Pick<DocumentItem, 'title' | 'category'>): Promise<DocumentItem> {
  const nextDocument: DocumentItem = {
    id: `doc-${Date.now()}`,
    title: input.title,
    category: input.category,
    status: 'draft',
    createdAt: new Date().toISOString(),
  }
  mockDocuments.unshift(nextDocument)
  return Promise.resolve(nextDocument)
}
