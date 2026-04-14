export type TemplateMeta = {
  id: number
  atsSafe: boolean
  docxParity: boolean
  twoColumn: boolean
  label: string
  atsReason: string
}

const ATS_OK = "Single-column layout — parseable by all ATS systems"

const META: TemplateMeta[] = [
  { id: 1, atsSafe: false, docxParity: true, twoColumn: true, label: "Sidebar", atsReason: "Sidebar layout — ATS may read columns out of order" },
  { id: 2, atsSafe: true, docxParity: true, twoColumn: false, label: "Centered", atsReason: ATS_OK },
  { id: 3, atsSafe: true, docxParity: true, twoColumn: false, label: "Accent Strip", atsReason: ATS_OK },
  { id: 4, atsSafe: true, docxParity: true, twoColumn: false, label: "Tabellarisch", atsReason: ATS_OK },
  { id: 5, atsSafe: true, docxParity: true, twoColumn: false, label: "Executive", atsReason: ATS_OK },
  { id: 6, atsSafe: true, docxParity: true, twoColumn: false, label: "Editorial", atsReason: ATS_OK },
  { id: 7, atsSafe: true, docxParity: true, twoColumn: false, label: "Accent Skills", atsReason: ATS_OK },
  { id: 8, atsSafe: true, docxParity: true, twoColumn: false, label: "DIN Minimal", atsReason: ATS_OK },
  { id: 9, atsSafe: false, docxParity: true, twoColumn: false, label: "Photo Right", atsReason: "Split layout — content may be read out of order" },
  { id: 10, atsSafe: false, docxParity: true, twoColumn: true, label: "Two Column", atsReason: "Multi-column body — ATS reads columns sequentially" },
]

const META_MAP = new Map(META.map((m) => [m.id, m]))

export function getTemplateMeta(id: number): TemplateMeta {
  return META_MAP.get(id) ?? { id, atsSafe: false, docxParity: false, twoColumn: false, label: `Template ${id}`, atsReason: "Unknown layout" }
}

export function isAtsSafe(id: number): boolean {
  return getTemplateMeta(id).atsSafe
}
