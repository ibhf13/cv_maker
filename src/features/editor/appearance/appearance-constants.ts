import type { FontKey } from "@/types/ui"

export type FontPreset = {
  label: string
  heading: FontKey
  body: FontKey
  bodyPt: number
  headingPt: number
  lineHeight: number
  headingLineHeight: number
  recommended?: boolean
}

// Size + line-height values follow DIN 5008 / German HR best practice
// for Lebenslauf: body 11 pt minimum, headings 14–16 pt, line height 1.15–1.5.
export const FONT_PRESETS: FontPreset[] = [
  {
    label: "Corporate",
    heading: "arimo", body: "arimo",
    bodyPt: 11, headingPt: 14,
    lineHeight: 1.15, headingLineHeight: 1.15,
    recommended: true,
  },
  {
    label: "Professional",
    heading: "lato", body: "lato",
    bodyPt: 11, headingPt: 14,
    lineHeight: 1.2, headingLineHeight: 1.15,
    recommended: true,
  },
  {
    label: "Traditional",
    heading: "libre-baskerville", body: "source-sans",
    bodyPt: 11, headingPt: 15,
    lineHeight: 1.25, headingLineHeight: 1.2,
    recommended: true,
  },
  {
    label: "Modern Tech",
    heading: "montserrat", body: "roboto",
    bodyPt: 11, headingPt: 14,
    lineHeight: 1.3, headingLineHeight: 1.2,
  },
]

export const ACCENT_PRESETS = [
  "#1e40af", "#0f766e", "#7c3aed", "#be123c",
  "#c2410c", "#15803d", "#475569", "#1e293b",
] as const
