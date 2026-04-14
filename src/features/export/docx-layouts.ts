import type { CvData } from "@/lib/cv-schema"
import type { CvLocale, ThemeTokens, SectionConfig, ContactFieldKey, CvSectionKey } from "@/types/ui"
import { sectionLabel } from "@/lib/locale"
import { visibleSectionKeys } from "@/lib/section-order"
import {
  bodyRun,
  nameRun,
  sidebarSectionLabel,
  photoImageRun,
  accentHex,
  contactParagraphs,
  signatureBlock,
  Table,
  TableRow,
  TableCell,
  Paragraph,
  WidthType,
  VerticalAlign,
  AlignmentType,
  NO_BORDERS,
  TableLayoutType,
} from "./docx-helpers"
import { lineTwentieths, getTemplateStyle } from "./docx-style"
import { sectionBuilders, orderedSections } from "./docx-sections"
import type { ProcessedPhotos } from "./docx-photo"

type DocxChild = Paragraph | Table

/** Fallback sidebar keys when user hasn't chosen any */
const DEFAULT_T1_SIDEBAR: CvSectionKey[] = ["skills", "certifications", "volunteer", "languages", "interests"]

/** Template 01: accent sidebar (photo + name + contact + assigned sections), main right */
export function buildSidebarLayout(
  cvData: CvData, locale: CvLocale, theme: ThemeTokens, photos: ProcessedPhotos,
  cfg: SectionConfig, contactOrder?: ContactFieldKey[],
): DocxChild[] {
  const pi = cvData.personal_info
  const accent = accentHex(theme)
  const line = lineTwentieths(theme)
  const style = getTemplateStyle(1)
  const builders = sectionBuilders(cvData, locale, theme, style.sectionVariant)

  const sidebarKeys = (cfg.sidebar.length ? cfg.sidebar : DEFAULT_T1_SIDEBAR).filter((k) => !cfg.hidden.includes(k))

  const sidebarChildren: Paragraph[] = []
  const imgRun = photoImageRun(photos.square, 115, 115)
  if (imgRun) sidebarChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 200 }, children: [imgRun] }))
  sidebarChildren.push(new Paragraph({ spacing: { before: 120, after: 160, line }, children: [nameRun(pi.name, theme, 1, "FFFFFF")] }))
  sidebarChildren.push(...contactParagraphs(pi, theme, contactOrder, "FFFFFF"))

  for (const key of sidebarKeys) {
    const nested = renderSidebarSection(key, cvData, locale, theme)
    if (nested.length) sidebarChildren.push(...nested)
  }

  const mainKeys = cfg.order.filter((k) => !cfg.hidden.includes(k) && !sidebarKeys.includes(k))
  const mainChildren: DocxChild[] = orderedSections(builders, mainKeys, [])
  mainChildren.push(...signatureBlock(cvData, theme))

  // Fixed twip widths — Word/LibreOffice often ignore cell percentages and auto-fit
  // to content. A4 page = 11906 twips, sidebar templates use 0 L/R page margins.
  const PAGE_W = 11906
  const SIDEBAR_W = Math.round(PAGE_W * 0.40)
  const MAIN_W = PAGE_W - SIDEBAR_W

  const sidebarCell = new TableCell({
    width: { size: SIDEBAR_W, type: WidthType.DXA },
    verticalAlign: VerticalAlign.TOP,
    borders: NO_BORDERS,
    shading: { fill: accent },
    margins: { top: 400, bottom: 400, left: 400, right: 400 },
    children: sidebarChildren,
  })
  const mainCell = new TableCell({
    width: { size: MAIN_W, type: WidthType.DXA },
    verticalAlign: VerticalAlign.TOP,
    borders: NO_BORDERS,
    margins: { top: 500, bottom: 500, left: 500, right: 500 },
    children: mainChildren.length ? mainChildren : [new Paragraph({ text: "" })],
  })

  return [new Table({
    rows: [new TableRow({ children: [sidebarCell, mainCell] })],
    width: { size: PAGE_W, type: WidthType.DXA },
    columnWidths: [SIDEBAR_W, MAIN_W],
    layout: TableLayoutType.FIXED,
  })]
}

/** Flat, inverted-color rendering for the accent sidebar. Condensed form. */
function renderSidebarSection(
  key: CvSectionKey, cvData: CvData, locale: CvLocale, theme: ThemeTokens,
): Paragraph[] {
  const line = lineTwentieths(theme)
  const white = { color: "FFFFFF" }
  const dim = { color: "E5E7EB" }
  const out: Paragraph[] = []
  const label = (k: string) => sidebarSectionLabel(sectionLabel(k, locale), theme)

  switch (key) {
    case "skills": {
      const groups = cvData.skills.filter((g) => g.items.length)
      if (!groups.length) return []
      out.push(label("skills"))
      for (const g of groups) out.push(new Paragraph({ spacing: { line }, children: [bodyRun(`${g.category}: `, theme, { bold: true, ...white }), bodyRun(g.items.join(", "), theme, dim)] }))
      return out
    }
    case "languages": {
      if (!cvData.languages.length) return []
      out.push(label("languages"))
      for (const l of cvData.languages) {
        const bits = [l.language, l.level, l.cefr].filter(Boolean).join(" — ")
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(bits, theme, white)] }))
      }
      return out
    }
    case "certifications": {
      if (!cvData.certifications.length) return []
      out.push(label("certifications"))
      for (const c of cvData.certifications) out.push(new Paragraph({ spacing: { line }, children: [bodyRun(`• ${c}`, theme, white)] }))
      return out
    }
    case "interests": {
      if (!cvData.interests.length) return []
      out.push(label("interests"))
      out.push(new Paragraph({ spacing: { line }, children: [bodyRun(cvData.interests.join(", "), theme, white)] }))
      return out
    }
    case "volunteer": {
      if (!cvData.volunteer.length) return []
      out.push(label("volunteer"))
      for (const v of cvData.volunteer) {
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(v.role, theme, { bold: true, ...white })] }))
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(v.organization, theme, dim)] }))
      }
      return out
    }
    case "projects": {
      if (!cvData.projects.length) return []
      out.push(label("projects"))
      for (const p of cvData.projects) {
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(p.name, theme, { bold: true, ...white })] }))
        if (p.description) out.push(new Paragraph({ spacing: { line }, children: [bodyRun(p.description, theme, dim)] }))
      }
      return out
    }
    case "summary": {
      if (!cvData.summary.trim()) return []
      out.push(label("summary"))
      out.push(new Paragraph({ spacing: { line }, children: [bodyRun(cvData.summary, theme, white)] }))
      return out
    }
    case "experience":
    case "education":
      // Too content-heavy for a narrow sidebar — fall back to main column
      return []
  }
}

/** Template 09: main content left, photo column right (respects sectionConfig) */
export function buildPhotoRightLayout(
  cvData: CvData, locale: CvLocale, theme: ThemeTokens, photos: ProcessedPhotos,
  cfg: SectionConfig, contactOrder?: ContactFieldKey[],
): DocxChild[] {
  const pi = cvData.personal_info
  const line = lineTwentieths(theme)
  const style = getTemplateStyle(9)
  const builders = sectionBuilders(cvData, locale, theme, style.sectionVariant)

  const content: DocxChild[] = [
    new Paragraph({ spacing: { line }, children: [nameRun(pi.name, theme, 9)] }),
    ...contactParagraphs(pi, theme, contactOrder),
  ]
  const mainKeys = cfg.order.filter((k) => !cfg.hidden.includes(k))
  content.push(...orderedSections(builders, mainKeys, []))
  content.push(...signatureBlock(cvData, theme))

  const imgRun = photoImageRun(photos.portrait, 135, 180)
  if (!imgRun) return content

  const leftCell = new TableCell({
    width: { size: 78, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.TOP,
    borders: NO_BORDERS,
    children: content,
  })
  const rightCell = new TableCell({
    width: { size: 22, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.TOP,
    borders: NO_BORDERS,
    shading: { fill: "FAFAFA" },
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [imgRun] })],
  })

  return [new Table({ rows: [new TableRow({ children: [leftCell, rightCell] })], width: { size: 100, type: WidthType.PERCENTAGE } })]
}

/** Template 10: full-width header, then sectionConfig-driven left/right columns */
export function buildTwoColBodyLayout(
  cvData: CvData, locale: CvLocale, theme: ThemeTokens, photos: ProcessedPhotos,
  cfg: SectionConfig, contactOrder?: ContactFieldKey[],
): DocxChild[] {
  const pi = cvData.personal_info
  const line = lineTwentieths(theme)
  const style = getTemplateStyle(10)
  const builders = sectionBuilders(cvData, locale, theme, style.sectionVariant)

  const header: DocxChild[] = [
    new Paragraph({ spacing: { line }, children: [nameRun(pi.name, theme, 10)] }),
  ]
  const imgRun = photoImageRun(photos.square, 140, 140)
  if (imgRun) header.push(new Paragraph({ alignment: AlignmentType.LEFT, children: [imgRun] }))
  header.push(...contactParagraphs(pi, theme, contactOrder))

  const sidebarSet = new Set(cfg.sidebar)
  const visibleKeys = visibleSectionKeys(cfg)
  const leftKeys = visibleKeys.filter((k) => !sidebarSet.has(k))
  const rightKeys = visibleKeys.filter((k) => sidebarSet.has(k))

  // If nothing is assigned to the sidebar, split visible sections 50/50 by order.
  const leftFinal = rightKeys.length ? leftKeys : visibleKeys.slice(0, Math.ceil(visibleKeys.length / 2))
  const rightFinal = rightKeys.length ? rightKeys : visibleKeys.slice(Math.ceil(visibleKeys.length / 2))

  const leftCol: DocxChild[] = orderedSections(builders, leftFinal, [])
  leftCol.push(...signatureBlock(cvData, theme))

  const rightCol: DocxChild[] = orderedSections(builders, rightFinal, [])

  if (!leftCol.length) leftCol.push(new Paragraph({ text: "" }))
  if (!rightCol.length) rightCol.push(new Paragraph({ text: "" }))

  const table = new Table({
    rows: [new TableRow({
      children: [
        new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.TOP, borders: NO_BORDERS, children: leftCol }),
        new TableCell({ width: { size: 50, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.TOP, borders: NO_BORDERS, children: rightCol }),
      ],
    })],
    width: { size: 100, type: WidthType.PERCENTAGE },
  })

  return [...header, table]
}
