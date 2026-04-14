/**
 * Shared utilities used across all export formats (PDF, DOCX, JSON).
 * Consolidates duplicated download, address formatting, and period formatting.
 */

import type { CvData } from "@/lib/cv-schema"
import type { CvLocale } from "@/types/ui"
import { presentLabel } from "@/lib/locale"

/** Trigger a browser file download from a Blob. */
export function downloadBlob(blob: Blob, filename: string) {
  const anchor = document.createElement("a")
  anchor.href = URL.createObjectURL(blob)
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(anchor.href)
}

/** Format a personal address into a single-line string. */
export function formatAddress(address: CvData["personal_info"]["address"]): string {
  return [address.street, [address.plz, address.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ")
}

/** Set PDF metadata and inject hidden margin text using pdf-lib. */
export async function setPdfMetadata(
  blob: Blob,
  options?: {
    hiddenTextLeft?: string
    hiddenTextRight?: string
    templateId?: number
    subject?: string
    keywords?: string
    creator?: string
  },
): Promise<Blob> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib")
  const pdfDoc = await PDFDocument.load(await blob.arrayBuffer())

  const subject = options?.subject?.trim()
  if (subject) pdfDoc.setSubject(subject)

  const keywords = options?.keywords
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean)
  if (keywords?.length) pdfDoc.setKeywords(keywords)

  const creator = options?.creator?.trim()
  if (creator) pdfDoc.setCreator(creator)

  const leftText = options?.hiddenTextLeft?.trim()
  const rightText = options?.hiddenTextRight?.trim()

  if (leftText || rightText) {
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontSize = 8
    const lineHeight = fontSize * 1.2
    const black = rgb(0, 0, 0)

    const breakLongWord = (word: string, maxWidth: number): string[] => {
      const pieces: string[] = []
      let buffer = ""
      for (const char of word) {
        const candidate = buffer + char
        if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
          buffer = candidate
        } else {
          if (buffer) pieces.push(buffer)
          buffer = char
        }
      }
      if (buffer) pieces.push(buffer)
      return pieces
    }

    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = text.split(/\s+/).filter(Boolean)
      const lines: string[] = []
      let current = ""
      for (const word of words) {
        const tokens = font.widthOfTextAtSize(word, fontSize) > maxWidth
          ? breakLongWord(word, maxWidth)
          : [word]
        for (const token of tokens) {
          const candidate = current ? `${current} ${token}` : token
          if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
            current = candidate
          } else {
            if (current) lines.push(current)
            current = token
          }
        }
      }
      if (current) lines.push(current)
      return lines
    }

    const MM_TO_PT = 72 / 25.4
    const SIDEBAR_COL_MM = 72
    const SIDEBAR_GUTTER_PT = 4
    const isTemplate1 = options?.templateId === 1
    const sidebarColPt = SIDEBAR_COL_MM * MM_TO_PT

    for (const page of pdfDoc.getPages()) {
      const { width: pageWidth, height: pageHeight } = page.getSize()
      const defaultBlockWidth = pageWidth / 2 - 6
      const leftWidth = isTemplate1 ? sidebarColPt - SIDEBAR_GUTTER_PT : defaultBlockWidth
      const rightWidth = isTemplate1 ? pageWidth - sidebarColPt - SIDEBAR_GUTTER_PT : defaultBlockWidth
      const topY = pageHeight - fontSize

      if (leftText) {
        const lines = wrapText(leftText, leftWidth)
        let y = topY
        for (const line of lines) {
          page.drawText(line, { x: 2, y, size: fontSize, font, color: black, opacity: 0 })
          y -= lineHeight
        }
      }
      if (rightText) {
        const lines = wrapText(rightText, rightWidth)
        let y = topY
        for (const line of lines) {
          const w = font.widthOfTextAtSize(line, fontSize)
          const x = isTemplate1 ? sidebarColPt + 2 + (rightWidth - w) : pageWidth - w - 2
          page.drawText(line, { x, y, size: fontSize, font, color: black, opacity: 0 })
          y -= lineHeight
        }
      }
    }
  }

  const bytes = await pdfDoc.save()
  return new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })
}

/** Format an experience/volunteer period as "start – end" or "start – Present". */
export function formatPeriod(
  period: { start: string; end: string | null; current: boolean },
  locale: CvLocale,
): string {
  if (period.current) return `${period.start} – ${presentLabel(locale)}`
  return `${period.start} – ${period.end ?? ""}`
}
