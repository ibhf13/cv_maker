import type { jsPDF } from "jspdf"
import type { CvLocale } from "@/types/ui"
import { sectionLabel } from "@/lib/locale"

const PAGE_H = 297
const ML = 25
const MR = 20
const MT = 20
const MB = 20
const PAGE_W = 210
const CONTENT_W = PAGE_W - ML - MR
const MAX_Y = PAGE_H - MB
const BULLET = "\u2022 "
const BULLET_INDENT = 5
const SZ = { name: 18, section: 12, body: 10.5, sub: 10 } as const
const LINE_H = SZ.body * 1.25 * 0.36

export const PDF_ATS_LAYOUT = {
  ML, MR, MT, MB, CONTENT_W, MAX_Y, PAGE_W, PAGE_H, SZ, LINE_H,
} as const

export function sanitizeWinAnsi(text: string): string {
  let s = text
  s = s.replace(/\u2018|\u2019|\u201A/g, "'")
  s = s.replace(/\u201C|\u201D|\u201E/g, '"')
  s = s.replace(/\u2013/g, "-")
  s = s.replace(/\u2014/g, "--")
  s = s.replace(/\u2026/g, "...")
  s = s.replace(/\u00A0/g, " ")
  s = s.replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")
  return s.replace(/[^\x20-\xFF\t\n\r]/g, "")
}

export type AtsWriter = {
  pageBreak(): void
  ensureSpace(mm: number): void
  adv(mm: number): void
  writeName(name: string): void
  writeInfo(text: string): void
  writeSectionHead(key: string): void
  writeBold(text: string): void
  writeSub(text: string): void
  writeBody(text: string): void
  writeBullet(text: string): void
  writeSkillGroup(label: string, items: string[]): void
  getY(): number
}

/** Stateful writer over jsPDF. Owns the `y` cursor so callers stay declarative. */
export function createAtsWriter(pdf: jsPDF, locale: CvLocale): AtsWriter {
  let y = MT

  const pageBreak = () => { pdf.addPage(); y = MT }
  const ensureSpace = (mm: number) => { if (y + mm > MAX_Y) pageBreak() }
  const adv = (mm: number) => {
    y += mm
    if (y > MAX_Y) pageBreak()
  }

  const writeName = (name: string) => {
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(SZ.name)
    pdf.text(sanitizeWinAnsi(name) || "Name", ML, y); adv(SZ.name * 0.4 + 2)
  }
  const writeInfo = (text: string) => {
    if (!text) return
    ensureSpace(SZ.sub * 0.4 + 1)
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(SZ.sub)
    pdf.text(sanitizeWinAnsi(text), ML, y); adv(SZ.sub * 0.4 + 1)
  }
  const writeSectionHead = (key: string) => {
    ensureSpace(SZ.section * 0.4 + 18)
    adv(4)
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(SZ.section)
    pdf.text(sectionLabel(key, locale), ML, y); adv(1)
    pdf.setDrawColor(100, 100, 100); pdf.setLineWidth(0.3)
    pdf.line(ML, y, ML + CONTENT_W, y); adv(3)
  }
  const writeBold = (text: string) => {
    ensureSpace(SZ.body * 0.4 + 1)
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(SZ.body)
    pdf.text(sanitizeWinAnsi(text), ML, y); adv(SZ.body * 0.4 + 1)
  }
  const writeSub = (text: string) => {
    if (!text) return
    ensureSpace(SZ.sub * 0.4 + 1)
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(SZ.sub)
    pdf.text(sanitizeWinAnsi(text), ML, y); adv(SZ.sub * 0.4 + 1)
  }
  const writeBody = (text: string) => {
    if (!text) return
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(SZ.body)
    for (const line of pdf.splitTextToSize(sanitizeWinAnsi(text), CONTENT_W)) {
      ensureSpace(LINE_H)
      pdf.text(line, ML, y); adv(LINE_H)
    }
    adv(1)
  }
  const writeBullet = (text: string) => {
    pdf.setFont("helvetica", "normal"); pdf.setFontSize(SZ.body)
    const lines = pdf.splitTextToSize(sanitizeWinAnsi(text), CONTENT_W - BULLET_INDENT)
    for (let k = 0; k < lines.length; k++) {
      ensureSpace(LINE_H)
      pdf.text((k === 0 ? BULLET : "  ") + lines[k], ML + BULLET_INDENT, y); adv(LINE_H)
    }
  }
  const writeSkillGroup = (label: string, items: string[]) => {
    if (!items.length) return
    ensureSpace(LINE_H)
    pdf.setFont("helvetica", "bold"); pdf.setFontSize(SZ.body)
    const safe = sanitizeWinAnsi(label)
    const lw = pdf.getTextWidth(`${safe}: `)
    pdf.text(`${safe}: `, ML, y)
    pdf.setFont("helvetica", "normal")
    const lines = pdf.splitTextToSize(sanitizeWinAnsi(items.join(", ")), CONTENT_W - lw)
    pdf.text(lines[0], ML + lw, y); adv(LINE_H)
    for (let k = 1; k < lines.length; k++) {
      ensureSpace(LINE_H)
      pdf.text(lines[k], ML, y); adv(LINE_H)
    }
  }

  return {
    pageBreak, ensureSpace, adv,
    writeName, writeInfo, writeSectionHead,
    writeBold, writeSub, writeBody, writeBullet, writeSkillGroup,
    getY: () => y,
  }
}
