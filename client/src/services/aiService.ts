import { API_BASE_URL } from './api'

function assertNonEmptyText(text: string): void {
  if (!text.trim()) {
    throw new Error('Document text is required')
  }
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const data = (await response.json()) as { error?: string }
    return data.error || fallback
  } catch {
    return fallback
  }
}

export async function summarizeDocument(text: string): Promise<string> {
  assertNonEmptyText(text)

  const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Failed to summarize document')
    throw new Error(message)
  }

  const data = (await response.json()) as { summary?: string }
  const summary = data.summary?.trim()
  if (!summary) throw new Error('AI summary response is empty')
  return summary
}

export async function suggestCategory(text: string): Promise<string> {
  assertNonEmptyText(text)

  const response = await fetch(`${API_BASE_URL}/ai/suggest-category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response, 'Failed to suggest category')
    throw new Error(message)
  }

  const data = (await response.json()) as { category?: string }
  const category = data.category?.trim()
  if (!category) throw new Error('AI category response is empty')
  return category
}
