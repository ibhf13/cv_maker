import { BorderStyle, type IBorderOptions } from "docx"
import type { ThemeTokens } from "@/types/ui"

export type SectionVariant = "default" | "rule" | "caps"

export type TemplateStyle = {
  /** Section header style variant applied to main content */
  sectionVariant: SectionVariant
  /** Name font size scale, multiplied against bodyPt */
  nameScale: number
  /** When true, name is rendered UPPERCASE */
  nameUppercase: boolean
  /** When true, name uses dark zinc color; otherwise uses accent */
  nameDark: boolean
  /** Optional accent strip under header: "heavy" = 3px, "thin" = 1px, null = none */
  headerRule: "heavy" | "thin" | null
}

const STYLES: Record<number, TemplateStyle> = {
  1: { sectionVariant: "default", nameScale: 1.6, nameUppercase: false, nameDark: false, headerRule: null },
  2: { sectionVariant: "caps", nameScale: 1.9, nameUppercase: false, nameDark: false, headerRule: null },
  3: { sectionVariant: "default", nameScale: 2.0, nameUppercase: false, nameDark: false, headerRule: "heavy" },
  4: { sectionVariant: "rule", nameScale: 1.85, nameUppercase: false, nameDark: true, headerRule: "thin" },
  5: { sectionVariant: "caps", nameScale: 1.35, nameUppercase: true, nameDark: true, headerRule: "thin" },
  6: { sectionVariant: "caps", nameScale: 2.6, nameUppercase: false, nameDark: false, headerRule: "thin" },
  7: { sectionVariant: "caps", nameScale: 1.85, nameUppercase: false, nameDark: false, headerRule: "thin" },
  8: { sectionVariant: "caps", nameScale: 1.3, nameUppercase: true, nameDark: true, headerRule: "thin" },
  9: { sectionVariant: "default", nameScale: 1.9, nameUppercase: false, nameDark: false, headerRule: "heavy" },
  10: { sectionVariant: "caps", nameScale: 1.9, nameUppercase: false, nameDark: false, headerRule: "thin" },
}

const DEFAULT_STYLE: TemplateStyle = STYLES[2]

export function getTemplateStyle(templateId: number): TemplateStyle {
  return STYLES[templateId] ?? DEFAULT_STYLE
}

/** DOCX spacing.line value = lineHeight × 240 (twentieths of a point at 12pt base) */
export function lineTwentieths(theme: ThemeTokens): number {
  return Math.max(240, Math.round(theme.lineHeight * 240))
}

/** DOCX heading line spacing value — uses headingLineHeight */
export function headingLineTwentieths(theme: ThemeTokens): number {
  return Math.max(240, Math.round(theme.headingLineHeight * 240))
}

/** Section header bottom border — used by default/rule variants; caps returns null */
export function headerBorder(variant: SectionVariant, accentHex: string): IBorderOptions | null {
  if (variant === "caps") return null
  const size = variant === "default" ? 8 : 4
  return { color: accentHex, space: 1, style: BorderStyle.SINGLE, size }
}
