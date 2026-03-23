import { apiRequest } from './api'
const MAX_CLIENT_AI_INPUT_CHARS = 12000

function assertNonEmptyText(text: string): void {
  if (!text.trim()) {
    throw new Error('Document text is required')
  }
}

function compactText(text: string): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > MAX_CLIENT_AI_INPUT_CHARS
    ? normalized.slice(0, MAX_CLIENT_AI_INPUT_CHARS)
    : normalized
}

export async function summarizeDocument(text: string): Promise<string> {
  assertNonEmptyText(text)
  const prepared = compactText(text)
  const data = await apiRequest<{ summary?: string }>('/ai/summarize', {
    method: 'POST',
    body: JSON.stringify({ text: prepared }),
  })
  const summary = data.summary?.trim()
  if (!summary) throw new Error('AI summary response is empty')
  return summary
}

export async function suggestCategory(text: string): Promise<string> {
  assertNonEmptyText(text)
  const prepared = compactText(text)
  const data = await apiRequest<{ category?: string }>('/ai/suggest-category', {
    method: 'POST',
    body: JSON.stringify({ text: prepared }),
  })
  const category = data.category?.trim()
  if (!category) throw new Error('AI category response is empty')
  return category
}
