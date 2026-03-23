import type { DocumentItem } from '../types/document'

export async function getAiSummary(document: DocumentItem): Promise<string> {
  if (document.summary) return Promise.resolve(document.summary)
  return Promise.resolve(`Auto summary for "${document.title}".`)
}
