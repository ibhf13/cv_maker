import { Paragraph, Table } from "docx"
import type { CvData } from "@/lib/cv-schema"
import type { CvLocale, CvSectionKey, ThemeTokens } from "@/types/ui"
import { presentLabel } from "@/lib/locale"
import { visibleSectionKeys } from "@/lib/section-order"
import { bodyRun, bodyPara, sectionHeader } from "./docx-helpers"
import { lineTwentieths, type SectionVariant } from "./docx-style"

type DocxChild = Paragraph | Table

export type SectionBuilder = () => DocxChild[]

export function sectionBuilders(
  cvData: CvData,
  locale: CvLocale,
  theme: ThemeTokens,
  variant: SectionVariant,
): Record<CvSectionKey, SectionBuilder> {
  const line = lineTwentieths(theme)
  const header = (key: string) => sectionHeader(key, locale, theme, variant)

  return {
    summary: () => {
      if (!cvData.summary.trim()) return []
      return [header("summary"), bodyPara(cvData.summary, theme, { justify: true })]
    },
    experience: () => {
      if (!cvData.experience.length) return []
      const out: DocxChild[] = [header("experience")]
      for (const ex of cvData.experience) {
        const period = ex.period.current
          ? `${ex.period.start} – ${presentLabel(locale)}`
          : `${ex.period.start} – ${ex.period.end ?? ""}`
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(ex.title, theme, { bold: true })] }))
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun([ex.company, ex.location, period].filter(Boolean).join(" · "), theme)] }))
        for (const l of ex.description) out.push(new Paragraph({ spacing: { line }, bullet: { level: 0 }, children: [bodyRun(l, theme)] }))
        out.push(new Paragraph({ text: "" }))
      }
      return out
    },
    education: () => {
      if (!cvData.education.length) return []
      const out: DocxChild[] = [header("education")]
      for (const ed of cvData.education) {
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(ed.degree, theme, { bold: true })] }))
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun([ed.institution, ed.location, `${ed.period.start} – ${ed.period.end}`].filter(Boolean).join(" · "), theme)] }))
        if (ed.thesis.trim()) out.push(new Paragraph({ spacing: { line }, children: [bodyRun(`Thesis: ${ed.thesis}`, theme)] }))
        if (ed.grade.trim()) out.push(new Paragraph({ spacing: { line }, children: [bodyRun(`Note: ${ed.grade}`, theme)] }))
        out.push(new Paragraph({ text: "" }))
      }
      return out
    },
    skills: () => {
      const groups = cvData.skills.filter((g) => g.items.length)
      if (!groups.length) return []
      const out: DocxChild[] = [header("skills")]
      for (const g of groups) {
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(`${g.category}: `, theme, { bold: true }), bodyRun(g.items.join(", "), theme)] }))
      }
      return out
    },
    certifications: () => {
      if (!cvData.certifications.length) return []
      return [header("certifications"), ...cvData.certifications.map((c) => new Paragraph({ spacing: { line }, bullet: { level: 0 }, children: [bodyRun(c, theme)] }))]
    },
    projects: () => {
      if (!cvData.projects.length) return []
      const out: DocxChild[] = [header("projects")]
      for (const p of cvData.projects) {
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(p.name, theme, { bold: true }), ...(p.url ? [bodyRun(` — ${p.url}`, theme)] : [])] }))
        if (p.description) out.push(new Paragraph({ spacing: { line }, children: [bodyRun(p.description, theme)] }))
        if (p.tech_stack.length) out.push(new Paragraph({ spacing: { line }, children: [bodyRun(p.tech_stack.join(", "), theme, { italics: true })] }))
      }
      return out
    },
    languages: () => {
      if (!cvData.languages.length) return []
      return [header("languages"), ...cvData.languages.map((l) => {
        const bits = [l.language, l.level, l.cefr].filter(Boolean).join(" — ")
        return new Paragraph({ spacing: { line }, bullet: { level: 0 }, children: [bodyRun(bits, theme)] })
      })]
    },
    volunteer: () => {
      if (!cvData.volunteer.length) return []
      const out: DocxChild[] = [header("volunteer")]
      for (const v of cvData.volunteer) {
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun(v.role, theme, { bold: true })] }))
        const period = v.period.current ? `${v.period.start} – ${presentLabel(locale)}` : `${v.period.start} – ${v.period.end ?? ""}`
        out.push(new Paragraph({ spacing: { line }, children: [bodyRun([v.organization, period].filter(Boolean).join(" · "), theme)] }))
        if (v.description.trim()) out.push(new Paragraph({ spacing: { line }, children: [bodyRun(v.description, theme)] }))
        out.push(new Paragraph({ text: "" }))
      }
      return out
    },
    interests: () => {
      if (!cvData.interests.length) return []
      return [header("interests"), bodyPara(cvData.interests.join(", "), theme)]
    },
  }
}

/** Render sections in user-defined order, skipping hidden and any excluded keys */
export function orderedSections(
  builders: Record<CvSectionKey, SectionBuilder>,
  order: CvSectionKey[],
  hidden: CvSectionKey[],
  exclude: CvSectionKey[] = [],
): DocxChild[] {
  const out: DocxChild[] = []
  for (const key of visibleSectionKeys({ order, hidden }, exclude)) {
    out.push(...builders[key]())
  }
  return out
}
