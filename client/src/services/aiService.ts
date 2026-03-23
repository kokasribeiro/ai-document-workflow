import { apiRequest } from './api'

function assertNonEmptyText(text: string): void {
  if (!text.trim()) {
    throw new Error('Document text is required')
  }
}

export async function summarizeDocument(text: string): Promise<string> {
  assertNonEmptyText(text)
  const data = await apiRequest<{ summary?: string }>('/ai/summarize', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
  const summary = data.summary?.trim()
  if (!summary) throw new Error('AI summary response is empty')
  return summary
}

export async function suggestCategory(text: string): Promise<string> {
  assertNonEmptyText(text)
  const data = await apiRequest<{ category?: string }>('/ai/suggest-category', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
  const category = data.category?.trim()
  if (!category) throw new Error('AI category response is empty')
  return category
}
