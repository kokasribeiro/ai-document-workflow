import type { Request, Response } from 'express'

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2:1b'

async function ollamaChat(system: string, user: string): Promise<string> {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      stream: false,
    }),
  })

  if (!response.ok) throw new Error('Ollama request failed')
  const data = (await response.json()) as { message?: { content?: string } }
  return data.message?.content?.trim() ?? ''
}

export async function summarizeDocument(req: Request, res: Response): Promise<void> {
  try {
    const text = String(req.body?.text ?? '').trim()
    if (!text) {
      res.status(400).json({ error: 'text is required' })
      return
    }
    const summary = await ollamaChat(
      'You summarize enterprise documents in 2 short business sentences.',
      text
    )
    res.json({ summary })
  } catch {
    res.status(500).json({ error: 'Failed to summarize document' })
  }
}

export async function suggestCategory(req: Request, res: Response): Promise<void> {
  try {
    const text = String(req.body?.text ?? '').trim()
    if (!text) {
      res.status(400).json({ error: 'text is required' })
      return
    }
    const category = await ollamaChat(
      'Classify the document into exactly one of these categories: Invoice, Contract, Report, HR. Return only the category name.',
      text
    )
    res.json({ category })
  } catch {
    res.status(500).json({ error: 'Failed to suggest category' })
  }
}
