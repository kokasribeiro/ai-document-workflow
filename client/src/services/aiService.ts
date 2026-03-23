export async function summarizeDocument(text: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2:1b',
      messages: [
        {
          role: 'system',
          content:
            'You summarize enterprise documents in 2 short business sentences.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      stream: false,
    }),
  })

  if (!response.ok) throw new Error('Failed to summarize document')

  const data = await response.json()
  return data.message.content.trim()
}

export async function suggestCategory(text: string): Promise<string> {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3.2:1b',
      messages: [
        {
          role: 'system',
          content:
            'Classify the document into exactly one of these categories: Invoice, Contract, Report, HR. Return only the category name.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      stream: false,
    }),
  })

  if (!response.ok) throw new Error('Failed to suggest category')

  const data = await response.json()
  return data.message.content.trim()
}
