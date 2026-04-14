export type FontKey =
  | "lato"
  | "roboto"
  | "source-sans"
  | "dm-sans"
  | "libre-baskerville"
  | "ibm-plex"
  | "open-sans"
  | "montserrat"
  | "arimo"

export type CvLocale = "de" | "en"

export type ThemeTokens = {
  accent: string
  fontHeading: FontKey
  fontBody: FontKey
  /** Body text size in pt (9–13, default 11) */
  bodyPt: number
  /** Line height multiplier (1.0–1.5, default 1.15) */
  lineHeight: number
  /** Section heading size in pt (11–20, default 13) */
  headingPt: number
  /** Section heading line height multiplier (1.0–1.5, default 1.2) */
  headingLineHeight: number
}

export type PhotoState = {
  dataUrl: string | null
  offsetX: number
  offsetY: number
  /** Zoom inside clip 1 = fit */
  scale: number
  /** Border radius percentage 0 = square, 50 = circle */
  borderRadius: number
}

/** Content editor tabs — synced when clicking sections in the live preview */
export type EditorSectionTab =
  | "personal"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "projects"
  | "extra"

export type ContactFieldKey =
  | "personalLine"
  | "email"
  | "phone"
  | "address"
  | "website"
  | "linkedin"
  | "xing"

export const DEFAULT_CONTACT_ORDER: ContactFieldKey[] = [
  "personalLine", "email", "phone", "address", "website", "linkedin", "xing",
]

export type CvSectionKey =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "certifications"
  | "projects"
  | "languages"
  | "volunteer"
  | "interests"

export type SectionConfig = {
  order: CvSectionKey[]
  hidden: CvSectionKey[]
  /** Sections assigned to the sidebar/left column in two-column templates */
  sidebar: CvSectionKey[]
}

export const DEFAULT_SECTION_ORDER: CvSectionKey[] = [
  "summary", "experience", "education", "projects",
  "skills", "certifications", "volunteer", "languages", "interests",
]

export type UiState = {
  templateId: number
  theme: ThemeTokens
  photo: PhotoState
  /** Active field group in the content panel */
  editorTab: EditorSectionTab
  /** CV output language — controls section headers and date labels */
  locale: CvLocale
  /** Section visibility and render order */
  sectionConfig: SectionConfig
  /** Contact field display order in the personal info block */
  contactOrder: ContactFieldKey[]
  /** Hidden text injected into PDF margins (same color as background, font size 1) */
  hiddenTextLeft: string
  hiddenTextRight: string
  /** PDF metadata — Subject (empty = skip) */
  pdfSubject: string
  /** PDF metadata — Keywords as comma-separated string (empty = skip) */
  pdfKeywords: string
  /** PDF metadata — Creator (empty = skip) */
  pdfCreator: string
  /** When true, body font follows heading font */
  linkFont: boolean
  /** When true, body font size follows heading font size */
  linkSize: boolean
  /** When true, body line height follows heading line height */
  linkLineHeight: boolean
}
