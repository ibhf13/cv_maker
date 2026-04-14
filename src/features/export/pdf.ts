import { toCanvas } from "html-to-image"
import type { Color, PDFFont, PDFPage } from "pdf-lib"

const PDF_W_MM = 210
const PDF_H_MM = 297
/** Points per mm (PDF native unit) */
const PT_PER_MM = 72 / 25.4

export type TextSpan = {
  text: string
  x: number
  y: number
  fontSize: number
  width: number
}

/**
 * Draw invisible selectable text so the PDF is searchable/copy-pasteable.
 * Helvetica is WinAnsi-encoded; any out-of-range char (emoji, ✓, →, …)
 * would throw and abort the whole export. Skipping un-encodable spans
 * silently is the right call — the overlay is invisible anyway.
 * Returns the number of spans successfully drawn.
 */
export function drawInvisibleTextOverlay(
  page: PDFPage,
  font: PDFFont,
  spans: TextSpan[],
  scale: number,
  transparent: Color,
): number {
  const pageH = page.getHeight()
  let drawn = 0
  for (const span of spans) {
    const ptSize = span.fontSize * scale * 0.75 // px → pt conversion
    if (ptSize < 1) continue
    const x = span.x * scale
    const y = pageH - span.y * scale - ptSize
    try {
      page.drawText(span.text, {
        x,
        y,
        size: ptSize,
        font,
        color: transparent,
        opacity: 0,
        maxWidth: span.width * scale,
      })
      drawn++
    } catch {
      // Skip spans with characters Helvetica/WinAnsi can't encode.
    }
  }
  return drawn
}

/**
 * Walk the DOM and extract every visible text run with its bounding rect
 * relative to the container element.
 */
function extractTextSpans(root: HTMLElement): TextSpan[] {
  const spans: TextSpan[] = []
  const rootRect = root.getBoundingClientRect()
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT
      const el = node.parentElement
      if (!el) return NodeFilter.FILTER_REJECT
      const style = getComputedStyle(el)
      if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let node: Node | null
  while ((node = walker.nextNode())) {
    const el = node.parentElement!
    const range = document.createRange()
    range.selectNodeContents(node)
    const rects = range.getClientRects()
    const style = getComputedStyle(el)
    const fontSize = parseFloat(style.fontSize)

    for (const rect of rects) {
      const text = node.textContent?.trim()
      if (!text || rect.width < 1 || rect.height < 1) continue
      spans.push({
        text,
        x: rect.left - rootRect.left,
        y: rect.top - rootRect.top,
        fontSize,
        width: rect.width,
      })
    }
  }

  // Dedupe: when a text node word-wraps, `getClientRects()` emits one rect
  // per line but `node.textContent` is the full string — so naively pushing
  // every rect would stamp the full text onto every wrap line. Keep only
  // the first span per (rounded x, rounded y, text) tuple.
  const seen = new Set<string>()
  return spans.filter((s) => {
    const key = `${Math.round(s.x)}|${Math.round(s.y)}|${s.text}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Capture the preview as an image-based A4 PDF, then overlay invisible
 * selectable text so the content is searchable and copy-pasteable.
 */
export async function exportCvPdf(
  element: HTMLElement,
  options?: {
    hiddenTextLeft?: string
    hiddenTextRight?: string
    templateId?: number
    subject?: string
    keywords?: string
    creator?: string
  },
): Promise<Blob> {
  await document.fonts.ready
  await new Promise((r) => setTimeout(r, 80))

  const widthPx = element.offsetWidth
  const pageHpx = (widthPx * PDF_H_MM) / PDF_W_MM
  const rawH = Math.max(element.scrollHeight, element.offsetHeight)
  const heightPx = Math.min(rawH, pageHpx)

  // Extract text positions before rasterising (needs live DOM)
  const textSpans = extractTextSpans(element)

  const canvas = await toCanvas(element, {
    pixelRatio: 2,
    width: widthPx,
    height: heightPx,
    cacheBust: true,
    backgroundColor: "#ffffff",
  })

  // Build the PDF with pdf-lib so we can draw invisible text
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib")
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([PDF_W_MM * PT_PER_MM, PDF_H_MM * PT_PER_MM])
  const pageW = page.getWidth()
  const pageH = page.getHeight()

  // Embed the rasterised image
  const imgData = canvas.toDataURL("image/jpeg", 0.92)
  const imgBytes = Uint8Array.from(atob(imgData.split(",")[1]), (c) => c.charCodeAt(0))
  const img = await pdfDoc.embedJpg(imgBytes)
  const hPt = (heightPx / widthPx) * pageW
  page.drawImage(img, { x: 0, y: pageH - hPt, width: pageW, height: hPt })

  // Overlay invisible selectable text
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const scale = pageW / widthPx
  drawInvisibleTextOverlay(page, font, textSpans, scale, rgb(0, 0, 0))

  const { setPdfMetadata } = await import("./shared")
  const bytes = await pdfDoc.save()
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" })
  return setPdfMetadata(blob, options)
}
