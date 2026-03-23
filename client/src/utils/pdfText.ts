import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc

/**
 * Extracts readable text from a PDF file (browser, via pdf.js).
 * Rebuilds reading order from glyph positions and filters obvious noise lines.
 */
export async function extractPdfText(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const task = pdfjsLib.getDocument({ data: bytes })
  const pdf = await task.promise
  const pages: string[] = []

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const textContent = await page.getTextContent()
    const textItems = textContent.items
      .map((item) => item as { str?: string; transform?: number[] })
      .filter((item) => typeof item.str === 'string' && Array.isArray(item.transform)) as Array<{
      str: string
      transform: number[]
    }>

    const rows = new Map<number, Array<{ x: number; text: string }>>()
    for (const item of textItems) {
      const transform = item.transform
      if (!transform || transform.length < 6) continue
      const yRaw = transform[5]
      const xRaw = transform[4]
      if (typeof yRaw !== 'number' || typeof xRaw !== 'number') continue
      const y = Math.round(yRaw * 10) / 10
      const x = xRaw
      const bucket = rows.get(y) ?? []
      bucket.push({ x, text: item.str })
      rows.set(y, bucket)
    }

    const sortedY = [...rows.keys()].sort((a, b) => b - a)
    const lines = sortedY.map((y) => {
      const parts = (rows.get(y) ?? []).sort((a, b) => a.x - b.x)
      return parts
        .map((p) => p.text.trim())
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    })

    const cleanLines = lines.filter((line) => {
      if (!line) return false
      const hasLetters = /[A-Za-zÀ-ÿ]/.test(line)
      if (!hasLetters) return false
      const symbolDensity = (line.match(/[$_=|{}[\]<>]/g)?.length ?? 0) / line.length
      if (symbolDensity > 0.15) return false
      const longTokenNoise = line
        .split(/\s+/)
        .some((token) => token.length > 25 && !/[aeiouà-ÿ]/i.test(token))
      if (longTokenNoise) return false
      return true
    })

    const pageText = cleanLines.join('\n').trim()
    if (pageText) pages.push(pageText)
  }

  return pages.join('\n\n')
}
