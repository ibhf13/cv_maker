import type { CvData } from "@/lib/cv-schema"
import type { CvLocale, CvSectionKey, SectionConfig } from "@/types/ui"
import { sectionLabel } from "@/lib/locale"
import { ensureUrl } from "@/lib/url-helpers"
import { visibleSectionKeys } from "@/lib/section-order"
import { periodStr } from "./shared"

type Props = {
  cvData: CvData
  locale: CvLocale
  sectionConfig: SectionConfig
}

const ITEM_FS = { fontSize: "0.9em" } as const
const HEADING_FS = { fontSize: "0.9em" } as const

function SidebarHeading({ label }: { label: string }) {
  return (
    <h3
      className="mb-2 mt-4 border-b border-white/30 pb-1 font-bold uppercase tracking-wide text-white/90"
      style={HEADING_FS}
    >
      {label}
    </h3>
  )
}

function SidebarSection({ sectionKey, cvData, locale }: { sectionKey: CvSectionKey; cvData: CvData; locale: CvLocale }) {
  switch (sectionKey) {
    case "skills": {
      const groups = cvData.skills.filter((g) => g.items.length)
      if (!groups.length) return null
      return (<div><SidebarHeading label={sectionLabel("skills", locale)} />
        <div className="space-y-1" style={ITEM_FS}>{groups.map((g) => (
          <div key={g.category}><span className="font-semibold text-white">{g.category}: </span><span className="text-white/80">{g.items.join(", ")}</span></div>
        ))}</div></div>)
    }
    case "languages": {
      if (!cvData.languages.length) return null
      return (<div><SidebarHeading label={sectionLabel("languages", locale)} />
        <ul className="space-y-0.5 text-white/90" style={ITEM_FS}>{cvData.languages.map((l) => (
          <li key={l.id}>{l.language} — {l.level}{l.cefr ? ` (${l.cefr})` : ""}</li>
        ))}</ul></div>)
    }
    case "certifications": {
      if (!cvData.certifications.length) return null
      return (<div><SidebarHeading label={sectionLabel("certifications", locale)} />
        <ul className="list-disc space-y-0.5 pl-3 text-white/90" style={ITEM_FS}>{cvData.certifications.map((c, i) => (
          <li key={i}>{c}</li>
        ))}</ul></div>)
    }
    case "interests": {
      if (!cvData.interests.length) return null
      return (<div><SidebarHeading label={sectionLabel("interests", locale)} />
        <p className="text-white/90" style={ITEM_FS}>{cvData.interests.join(", ")}</p></div>)
    }
    case "summary": {
      if (!cvData.summary.trim()) return null
      return (<div><SidebarHeading label={sectionLabel("summary", locale)} />
        <p className="text-white/90" style={ITEM_FS}>{cvData.summary}</p></div>)
    }
    case "experience": {
      if (!cvData.experience.length) return null
      return (<div><SidebarHeading label={sectionLabel("experience", locale)} />
        <div className="space-y-2" style={ITEM_FS}>{cvData.experience.map((ex) => (
          <div key={ex.id}><div className="font-semibold text-white">{ex.title}</div>
            <div className="text-white/70">{ex.company} · {periodStr(ex.period, locale)}</div></div>
        ))}</div></div>)
    }
    case "education": {
      if (!cvData.education.length) return null
      return (<div><SidebarHeading label={sectionLabel("education", locale)} />
        <div className="space-y-2" style={ITEM_FS}>{cvData.education.map((ed) => (
          <div key={ed.id}><div className="font-semibold text-white">{ed.degree}</div>
            <div className="text-white/70">{ed.institution} · {ed.period.start} – {ed.period.end}</div></div>
        ))}</div></div>)
    }
    case "projects": {
      if (!cvData.projects.length) return null
      return (<div><SidebarHeading label={sectionLabel("projects", locale)} />
        <div className="space-y-1.5" style={ITEM_FS}>{cvData.projects.map((p) => (
          <div key={p.id} className="text-white/90">{p.url ? (
            <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" className="font-semibold text-white no-underline">{p.name}</a>
          ) : (
            <span className="font-semibold text-white">{p.name}</span>
          )}{p.description ? <div className="text-white/70 mt-0.5">{p.description}</div> : null}</div>
        ))}</div></div>)
    }
    case "volunteer": {
      if (!cvData.volunteer.length) return null
      return (<div><SidebarHeading label={sectionLabel("volunteer", locale)} />
        <div className="space-y-2" style={ITEM_FS}>{cvData.volunteer.map((v) => (
          <div key={v.id}><div className="font-semibold text-white">{v.role}</div>
            <div className="text-white/70">{v.organization}</div></div>
        ))}</div></div>)
    }
  }
}

export function SidebarSections({ cvData, locale, sectionConfig }: Props) {
  const sidebarSet = new Set(sectionConfig.sidebar)
  const sidebarKeys = visibleSectionKeys(sectionConfig).filter((k) => sidebarSet.has(k))

  if (!sidebarKeys.length) return null

  return (
    <>
      {sidebarKeys.map((key) => (
        <SidebarSection key={key} sectionKey={key} cvData={cvData} locale={locale} />
      ))}
    </>
  )
}
