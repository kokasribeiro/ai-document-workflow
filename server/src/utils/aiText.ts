/** Normalizes whitespace and caps length before sending text to the LLM. */
export function prepareAiInput(raw: string, maxChars: number): string {
  const normalized = raw.replace(/\s+/g, ' ').trim()
  return normalized.length > maxChars ? normalized.slice(0, maxChars) : normalized
}
