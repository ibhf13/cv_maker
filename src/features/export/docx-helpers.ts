import {
  Paragraph,
  TextRun,
  ImageRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  BorderStyle,
  WidthType,
  AlignmentType,
  VerticalAlign,
  TableLayoutType,
} from "docx"
import type { CvData } from "@/lib/cv-schema"
import type { ThemeTokens, PhotoState, CvLocale, ContactFieldKey } from "@/types/ui"
import { DEFAULT_CONTACT_ORDER } from "@/types/ui"
import { sectionLabel } from "@/lib/locale"
import { fontDocxSystemName } from "@/lib/theme-fonts"
import { formatAddress } from "./shared"
import {
  getTemplateStyle,
  lineTwentieths,
  headingLineTwentieths,
  headerBorder,
  type SectionVariant,
} from "./docx-style"

/** Convert pt to half-points (DOCX unit). Default 11pt → 22hp */
export function ptToHp(pt: number) {
  return Math.round(pt * 2)
}

export function bodySize(theme: ThemeTokens) {
  return ptToHp(theme.bodyPt)
}

export function headingSize(theme: ThemeTokens) {
  return ptToHp(theme.headingPt)
}

export function nameSize(theme: ThemeTokens, templateId: number) {
  return ptToHp(theme.bodyPt * getTemplateStyle(templateId).nameScale)
}

export function accentHex(theme: ThemeTokens) {
  return theme.accent.replace("#", "")
}

const DARK_NAME_HEX = "18181B"

export function bodyRun(
  text: string,
  theme: ThemeTokens,
  opts?: { bold?: boolean; italics?: boolean; color?: string },
) {
  return new TextRun({
    text,
    font: fontDocxSystemName(theme.fontBody),
    size: bodySize(theme),
    bold: opts?.bold,
    italics: opts?.italics,
    color: opts?.color,
  })
}

export function headingRun(
  text: string,
  theme: ThemeTokens,
  variant: SectionVariant,
) {
  const display = variant === "caps" ? text.toUpperCase() : text
  const color = variant === "rule" ? DARK_NAME_HEX : accentHex(theme)
  return new TextRun({
    text: display,
    font: fontDocxSystemName(theme.fontHeading),
    size: headingSize(theme),
    bold: true,
    color,
  })
}

export function nameRun(name: string, theme: ThemeTokens, templateId: number, overrideColor?: string) {
  const style = getTemplateStyle(templateId)
  const display = style.nameUppercase ? (name || "Your name").toUpperCase() : (name || "Your name")
  const color = overrideColor ?? (style.nameDark ? DARK_NAME_HEX : accentHex(theme))
  return new TextRun({
    text: display,
    font: fontDocxSystemName(theme.fontHeading),
    size: nameSize(theme, templateId),
    bold: true,
    color,
  })
}

export function sectionHeader(
  key: string,
  locale: CvLocale,
  theme: ThemeTokens,
  variant: SectionVariant = "default",
) {
  const border = headerBorder(variant, accentHex(theme))
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120, line: headingLineTwentieths(theme) },
    ...(border ? { border: { bottom: border } } : {}),
    children: [headingRun(sectionLabel(key, locale), theme, variant)],
  })
}

export function sidebarSectionLabel(text: string, theme: ThemeTokens) {
  return new Paragraph({
    spacing: { before: 240, after: 80, line: headingLineTwentieths(theme) },
    border: {
      bottom: { color: "FFFFFF", space: 2, style: BorderStyle.SINGLE, size: 4 },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: fontDocxSystemName(theme.fontHeading),
        size: ptToHp(Math.round(theme.bodyPt * 0.95)),
        bold: true,
        color: "FFFFFF",
      }),
    ],
  })
}

export function bodyPara(text: string, theme: ThemeTokens, opts?: { justify?: boolean }) {
  return new Paragraph({
    spacing: { line: lineTwentieths(theme) },
    ...(opts?.justify ? { alignment: AlignmentType.JUSTIFIED } : {}),
    children: [bodyRun(text, theme)],
  })
}

export { formatAddress }

export function parseDataUrl(dataUrl: string): { buf: Uint8Array; ext: "jpg" | "png" | "gif" } | null {
  const m = dataUrl.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/)
  if (!m) return null
  let binary: string
  try {
    binary = atob(m[2])
  } catch {
    return null
  }
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const ext = m[1] === "png" ? "png" : m[1] === "gif" ? "gif" : "jpg"
  return { buf: bytes, ext }
}

export const NO_BORDER = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }
export const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER }

export function photoImageRun(photo: PhotoState, w = 140, h = 140) {
  const img = photo.dataUrl ? parseDataUrl(photo.dataUrl) : null
  if (!img) return null
  return new ImageRun({ data: img.buf, transformation: { width: w, height: h }, type: img.ext })
}

export function signatureBlock(cvData: CvData, theme: ThemeTokens): Paragraph[] {
  if (!cvData.signature) return []
  const { city, date, image } = cvData.signature
  const sigText = [city, date].filter(Boolean).join(", ")
  if (!sigText && !image) return []

  const line = lineTwentieths(theme)
  const out: Paragraph[] = []
  if (sigText) {
    out.push(new Paragraph({ spacing: { before: 400, line }, children: [bodyRun(sigText, theme)] }))
  }
  const img = image ? parseDataUrl(image) : null
  if (img) {
    out.push(
      new Paragraph({
        spacing: { before: 200 },
        children: [
          new ImageRun({ data: img.buf, transformation: { width: 160, height: 60 }, type: img.ext }),
        ],
      }),
    )
  } else {
    out.push(new Paragraph({ spacing: { before: 300 }, children: [bodyRun("_".repeat(30), theme)] }))
  }
  return out
}

function contactFieldText(key: ContactFieldKey, pi: CvData["personal_info"]): string {
  switch (key) {
    case "personalLine":
      return [pi.date_of_birth, pi.place_of_birth, pi.nationality, pi.marital_status, pi.driving_license].filter(Boolean).join(" · ")
    case "email": return pi.email
    case "phone": return pi.phone
    case "address": return formatAddress(pi.address)
    case "website": return pi.website
    case "linkedin": return pi.linkedin
    case "xing": return pi.xing
  }
}

/** Header contact block honoring user-configured order */
export function contactParagraphs(
  pi: CvData["personal_info"],
  theme: ThemeTokens,
  contactOrder: ContactFieldKey[] = DEFAULT_CONTACT_ORDER,
  color?: string,
): Paragraph[] {
  const line = lineTwentieths(theme)
  const out: Paragraph[] = []
  for (const key of contactOrder) {
    const text = contactFieldText(key, pi)
    if (!text) continue
    out.push(new Paragraph({ spacing: { line }, children: [bodyRun(text, theme, color ? { color } : undefined)] }))
  }
  return out
}

export function buildHeaderWithPhoto(
  pi: CvData["personal_info"],
  squarePhoto: PhotoState,
  theme: ThemeTokens,
  templateId: number,
  contactOrder?: ContactFieldKey[],
): Paragraph[] | Table {
  const line = lineTwentieths(theme)
  const infoParagraphs = [
    new Paragraph({ spacing: { line }, children: [nameRun(pi.name, theme, templateId)] }),
    ...contactParagraphs(pi, theme, contactOrder),
  ]

  const imgRun = photoImageRun(squarePhoto, 140, 140)
  if (!imgRun) return infoParagraphs

  return new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 2200, type: WidthType.DXA },
            verticalAlign: VerticalAlign.CENTER,
            borders: NO_BORDERS,
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [imgRun] })],
          }),
          new TableCell({
            verticalAlign: VerticalAlign.CENTER,
            borders: NO_BORDERS,
            children: infoParagraphs,
          }),
        ],
      }),
    ],
    width: { size: 100, type: WidthType.PERCENTAGE },
  })
}

export { Table, TableRow, TableCell, Paragraph, WidthType, VerticalAlign, AlignmentType, BorderStyle, TableLayoutType }
