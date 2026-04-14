import { useState } from "react"
import { toast } from "sonner"
import { useCvStore } from "@/stores/cv-store"
import { downloadBlob } from "@/features/export/shared"
import { editorLabel } from "@/lib/editor-labels"

function fileSlug(name: string, locale: string, ext: string) {
  const base = name.trim().replace(/\s+/g, "-").toLowerCase()
  const prefix = editorLabel("cvPrefix", locale as "de" | "en")
  return base ? `${prefix}_${base}.${ext}` : `${prefix}.${ext}`
}

export function useDownloadActions(
  printRef: React.RefObject<HTMLDivElement | null>,
  isLg: boolean,
  onDownloadSuccess?: () => void,
) {
  const cvData = useCvStore((s) => s.cvData)
  const locale = useCvStore((s) => s.ui.locale)
  const theme = useCvStore((s) => s.ui.theme)
  const photo = useCvStore((s) => s.ui.photo)
  const templateId = useCvStore((s) => s.ui.templateId)
  const sectionConfig = useCvStore((s) => s.ui.sectionConfig)
  const contactOrder = useCvStore((s) => s.ui.contactOrder)
  const hiddenTextLeft = useCvStore((s) => s.ui.hiddenTextLeft)
  const hiddenTextRight = useCvStore((s) => s.ui.hiddenTextRight)
  const pdfSubject = useCvStore((s) => s.ui.pdfSubject)
  const pdfKeywords = useCvStore((s) => s.ui.pdfKeywords)
  const pdfCreator = useCvStore((s) => s.ui.pdfCreator)

  const [pdfBusy, setPdfBusy] = useState(false)
  const [atsPdfBusy, setAtsPdfBusy] = useState(false)
  const [docxBusy, setDocxBusy] = useState(false)

  async function onPdf() {
    const el = printRef.current
    if (!el) { toast.info(isLg ? "Preview is not ready yet." : "Switch to Preview tab first."); return }
    setPdfBusy(true)
    try {
      await document.fonts.ready
      const { exportCvPdf } = await import("@/features/export/pdf")
      const blob = await exportCvPdf(el, { hiddenTextLeft, hiddenTextRight, templateId, subject: pdfSubject, keywords: pdfKeywords, creator: pdfCreator })
      downloadBlob(blob, fileSlug(cvData.personal_info.name, locale, "pdf"))
      onDownloadSuccess?.()
    } catch (err) { console.error(err); toast.error("PDF export failed.") }
    finally { setPdfBusy(false) }
  }

  async function onPrintPdf() {
    const el = printRef.current
    if (!el) { toast.info(isLg ? "Preview is not ready yet." : "Switch to Preview tab first."); return }
    try {
      await document.fonts.ready
      const { printCvPdf } = await import("@/features/export/pdf-print")
      printCvPdf(el, { hiddenTextLeft, hiddenTextRight, templateId })
      onDownloadSuccess?.()
    } catch (err) { console.error(err); toast.error(err instanceof Error ? err.message : "Print export failed.") }
  }

  async function onAtsPdf() {
    setAtsPdfBusy(true)
    try {
      const { buildAtsPdf } = await import("@/features/export/pdf-ats")
      const blob = await buildAtsPdf(cvData, locale, sectionConfig, { hiddenTextLeft, hiddenTextRight, templateId, subject: pdfSubject, keywords: pdfKeywords, creator: pdfCreator })
      downloadBlob(blob, fileSlug(cvData.personal_info.name, locale, "pdf"))
      onDownloadSuccess?.()
    } catch (err) { console.error(err); toast.error("ATS PDF export failed.") }
    finally { setAtsPdfBusy(false) }
  }

  async function onDocx() {
    setDocxBusy(true)
    try {
      const { buildCvDocx } = await import("@/features/export/docx")
      const blob = await buildCvDocx(cvData, locale, theme, photo, templateId, sectionConfig, contactOrder)
      downloadBlob(blob, fileSlug(cvData.personal_info.name, locale, "docx"))
      onDownloadSuccess?.()
    } catch (err) { console.error(err); toast.error("Word export failed.") }
    finally { setDocxBusy(false) }
  }

  async function onJson() {
    const { downloadCvJson } = await import("@/features/export/json")
    const slug = cvData.personal_info.name.trim().replace(/\s+/g, "-").toLowerCase() || "cv-data"
    downloadCvJson(cvData, `${slug}.json`, locale)
    onDownloadSuccess?.()
  }

  return {
    onPdf, onPrintPdf, onAtsPdf, onDocx, onJson,
    pdfBusy, atsPdfBusy, docxBusy,
    exportBusy: pdfBusy || atsPdfBusy || docxBusy,
  }
}
