import { jsPDF } from "jspdf"
import type { CvData } from "@/lib/cv-schema"
import type { CvLocale, SectionConfig, CvSectionKey } from "@/types/ui"
import { DEFAULT_SECTION_ORDER } from "@/types/ui"
import { presentLabel } from "@/lib/locale"
import { editorLabel } from "@/lib/editor-labels"
import { visibleSectionKeys } from "@/lib/section-order"
import { formatAddress, setPdfMetadata } from "./shared"
import { createAtsWriter, sanitizeWinAnsi, PDF_ATS_LAYOUT } from "./pdf-ats-writer"

export { sanitizeWinAnsi }

const { ML } = PDF_ATS_LAYOUT

function renderHeader(w: ReturnType<typeof createAtsWriter>, cvData: CvData) {
  const pi = cvData.personal_info
  w.writeName(pi.name)
  w.writeInfo([pi.date_of_birth, pi.place_of_birth, pi.nationality, pi.marital_status, pi.driving_license].filter(Boolean).join(" · "))

  const contactItems: string[] = []
  if (pi.email) contactItems.push(pi.email)
  if (pi.phone) contactItems.push(pi.phone)
  const addr = formatAddress(pi.address)
  if (addr) contactItems.push(addr)
  if (pi.website) contactItems.push(pi.website)
  if (pi.linkedin) contactItems.push(pi.linkedin)
  if (pi.xing) contactItems.push(pi.xing)
  if (contactItems.length) w.writeInfo(contactItems.join(" · "))
  w.adv(2)
}

function renderSignature(pdf: jsPDF, w: ReturnType<typeof createAtsWriter>, cvData: CvData) {
  if (!cvData.signature) return
  const { city, date, image } = cvData.signature
  const sigText = [city, date].filter(Boolean).join(", ")
  if (!sigText && !image) return
  w.ensureSpace(30)
  w.adv(8)
  if (sigText) w.writeInfo(sigText)
  if (!image) { w.adv(6); w.writeInfo("_".repeat(30)); return }
  try {
    const props = pdf.getImageProperties(image)
    const fmt = (props.fileType || "PNG").toUpperCase()
    const maxW = 50
    const maxH = 20
    const ratio = Math.min(maxW / props.width, maxH / props.height)
    const imgW = props.width * ratio
    const imgH = props.height * ratio
    w.ensureSpace(imgH + 2)
    w.adv(2)
    pdf.addImage(image, fmt, ML, w.getY(), imgW, imgH)
    w.adv(imgH)
  } catch (err) {
    if (import.meta.env.DEV) console.warn("pdf-ats: signature image embed failed", err)
    w.adv(6)
    w.writeInfo("_".repeat(30))
  }
}

function buildSectionDispatch(
  cvData: CvData,
  locale: CvLocale,
  w: ReturnType<typeof createAtsWriter>,
): Record<CvSectionKey, () => void> {
  return {
    summary: () => {
      if (!cvData.summary.trim()) return
      w.writeSectionHead("summary"); w.writeBody(cvData.summary)
    },
    experience: () => {
      if (!cvData.experience.length) return
      w.writeSectionHead("experience")
      for (const ex of cvData.experience) {
        w.writeBold(ex.title)
        const period = ex.period.current ? `${ex.period.start} – ${presentLabel(locale)}` : `${ex.period.start} – ${ex.period.end ?? ""}`
        w.writeSub([ex.company, ex.location, period].filter(Boolean).join(" · "))
        for (const line of ex.description) { if (line.trim()) w.writeBullet(line) }
        w.adv(2)
      }
    },
    education: () => {
      if (!cvData.education.length) return
      w.writeSectionHead("education")
      for (const ed of cvData.education) {
        w.writeBold(ed.degree)
        w.writeSub([ed.institution, ed.location, `${ed.period.start} – ${ed.period.end}`].filter(Boolean).join(" · "))
        if (ed.thesis.trim()) w.writeSub(`Thesis: ${ed.thesis}`)
        if (ed.grade.trim()) w.writeSub(`Note: ${ed.grade}`)
        w.adv(2)
      }
    },
    skills: () => {
      const sg = cvData.skills.filter((g) => g.items.length)
      if (!sg.length) return
      w.writeSectionHead("skills")
      for (const g of sg) w.writeSkillGroup(g.category, g.items)
    },
    certifications: () => {
      if (!cvData.certifications.length) return
      w.writeSectionHead("certifications")
      for (const c of cvData.certifications) w.writeBullet(c)
    },
    projects: () => {
      if (!cvData.projects.length) return
      w.writeSectionHead("projects")
      for (const p of cvData.projects) {
        w.writeBold(p.url ? `${p.name} — ${p.url}` : p.name)
        if (p.tech_stack.length) w.writeSub(p.tech_stack.join(", "))
        w.adv(1)
      }
    },
    languages: () => {
      if (!cvData.languages.length) return
      w.writeSectionHead("languages")
      for (const lang of cvData.languages) w.writeBullet([lang.language, lang.level, lang.cefr].filter(Boolean).join(" — "))
    },
    volunteer: () => {
      if (!cvData.volunteer.length) return
      w.writeSectionHead("volunteer")
      for (const v of cvData.volunteer) {
        w.writeBold(v.role)
        const period = v.period.current ? `${v.period.start} – ${presentLabel(locale)}` : `${v.period.start} – ${v.period.end ?? ""}`
        w.writeSub([v.organization, period].filter(Boolean).join(" · "))
        if (v.description.trim()) w.writeBody(v.description)
        w.adv(2)
      }
    },
    interests: () => {
      if (!cvData.interests.length) return
      w.writeSectionHead("interests"); w.writeBody(cvData.interests.join(", "))
    },
  }
}

export async function buildAtsPdf(
  cvData: CvData,
  locale: CvLocale = "de",
  sectionConfig?: SectionConfig,
  options?: {
    hiddenTextLeft?: string
    hiddenTextRight?: string
    templateId?: number
    subject?: string
    keywords?: string
    creator?: string
  },
): Promise<Blob> {
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })

  const name = sanitizeWinAnsi(cvData.personal_info.name) || "CV"
  const prefix = editorLabel("cvPrefix", locale)
  pdf.setDocumentProperties({ title: `${prefix} - ${name}`, author: name, subject: prefix })

  const w = createAtsWriter(pdf, locale)
  renderHeader(w, cvData)

  const builders = buildSectionDispatch(cvData, locale, w)
  const cfg = sectionConfig ?? { order: [...DEFAULT_SECTION_ORDER], hidden: [] }
  for (const key of visibleSectionKeys(cfg)) builders[key]()

  renderSignature(pdf, w, cvData)

  const raw = pdf.output("blob")
  return setPdfMetadata(raw, options)
}
