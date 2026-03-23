import type { Request, Response } from 'express'

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama3.2:1b'
const MAX_AI_INPUT_CHARS = Number(process.env.AI_MAX_INPUT_CHARS ?? 8000)
const ENTERPRISE_BASE_PROMPT =
  'You are a professional enterprise document assistant inside a business workflow application. Be concise, reliable, and consistent. Use only the user-provided content. Never invent facts. Write in clear, simple business English. Keep responses short, structured, and professional. Do not use casual language or unnecessary text.'

function prepareText(raw: string): string {
  const normalized = raw.replace(/\s+/g, ' ').trim()
  return normalized.length > MAX_AI_INPUT_CHARS
    ? normalized.slice(0, MAX_AI_INPUT_CHARS)
    : normalized
}

async function ollamaChat(system: string, user: string, numPredict: number): Promise<string> {
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
      options: {
        num_predict: numPredict,
        temperature: 0.2,
      },
    }),
  })

  if (!response.ok) throw new Error('Ollama request failed')
  const data = (await response.json()) as { message?: { content?: string } }
  return data.message?.content?.trim() ?? ''
}

export async function summarizeDocument(req: Request, res: Response): Promise<void> {
  try {
    const text = prepareText(String(req.body?.text ?? ''))
    if (!text) {
      res.status(400).json({ error: 'text is required' })
      return
    }
    const summary = await ollamaChat(
      `${ENTERPRISE_BASE_PROMPT} For summaries: explain the main purpose of the document with an appropriate length based on the content. Mention important obligations, dates, costs, or risks when present. If the text is too short, vague, or unclear, explicitly say there is not enough information.`,
      text,
      180
    )
    res.json({ summary })
  } catch {
    res.status(500).json({ error: 'Failed to summarize document' })
  }
}

export async function suggestCategory(req: Request, res: Response): Promise<void> {
  try {
    const text = prepareText(String(req.body?.text ?? ''))
    if (!text) {
      res.status(400).json({ error: 'text is required' })
      return
    }
    const category = await ollamaChat(
      `${ENTERPRISE_BASE_PROMPT} Classify the document into exactly one category from this list only: Invoice, Contract, Report, HR. Return only the category name. Do not explain.`,
      text,
      12
    )
    res.json({ category })
  } catch {
    res.status(500).json({ error: 'Failed to suggest category' })
  }
}
