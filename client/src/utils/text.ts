/** Max characters sent to AI endpoints from the browser (aligned with server-side caps). */
export const MAX_CLIENT_AI_INPUT_CHARS = 12000

export function compactWhitespace(text: string, maxChars: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > maxChars ? normalized.slice(0, maxChars) : normalized
}
