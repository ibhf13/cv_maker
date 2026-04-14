import type { CvData } from "@/lib/cv-schema"
import type { CvLocale } from "@/types/ui"
import { sectionLabel } from "@/lib/locale"
import { ensureUrl } from "@/lib/url-helpers"
import { BreakSafeSection, periodStr } from "./shared"
import { cn } from "@/lib/utils"

export { Body, ContactBlock } from "./section-renderers-contact"

type SectionProps = {
  cvData: CvData
  locale: CvLocale
}

export function Summary({ cvData, locale }: SectionProps) {
  if (!cvData.summary.trim()) return null
  return (
    <BreakSafeSection title={sectionLabel("summary", locale)} className="mb-4">
      <p className="text-justify">{cvData.summary}</p>
    </BreakSafeSection>
  )
}

export function Exp({ cvData, locale }: SectionProps) {
  if (!cvData.experience.length) return null
  return (
    <BreakSafeSection title={sectionLabel("experience", locale)} className="mb-4">
      <div className="space-y-3">
        {cvData.experience.map((ex) => (
          <div key={ex.id} className="break-inside-avoid">
            <div className="font-semibold" style={{ fontFamily: "var(--cv-font-heading)" }}>
              {ex.title}
            </div>
            <div className="text-sm text-zinc-600">
              {[ex.company, ex.location, periodStr(ex.period, locale)].filter(Boolean).join(" · ")}
            </div>
            <ul className="mt-1 list-disc pl-4">
              {ex.description.map((d, j) => (
                <li key={j}>{d}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </BreakSafeSection>
  )
}

export function Edu({ cvData, locale }: SectionProps) {
  if (!cvData.education.length) return null
  return (
    <BreakSafeSection title={sectionLabel("education", locale)} className="mb-4">
      <div className="space-y-3">
        {cvData.education.map((e) => (
          <div key={e.id} className="break-inside-avoid">
            <div className="font-semibold" style={{ fontFamily: "var(--cv-font-heading)" }}>{e.degree}</div>
            <div className="text-sm text-zinc-600">
              {e.institution} · {e.location} · {e.period.start} – {e.period.end}
            </div>
            {e.thesis ? <p className="mt-1 text-sm">Thesis: {e.thesis}</p> : null}
            {e.grade ? <p className="mt-0.5 text-sm text-zinc-600">Note: {e.grade}</p> : null}
          </div>
        ))}
      </div>
    </BreakSafeSection>
  )
}

export function SkillsInline({
  cvData,
  light,
}: {
  cvData: CvData
  light?: boolean
}) {
  const groups = cvData.skills.filter((g) => g.items.length)
  if (!groups.length) return null
  return (
    <div className={cn("space-y-1 text-xs", light && "text-white")}>
      {groups.map((g) => (
        <div key={g.category}>
          <span className="font-semibold">{g.category}: </span>
          {g.items.join(", ")}
        </div>
      ))}
    </div>
  )
}

export function SkillsSection({ cvData, locale }: SectionProps) {
  if (!cvData.skills.some((g) => g.items.length)) return null
  return (
    <BreakSafeSection title={sectionLabel("skills", locale)} className="mb-4">
      <SkillsInline cvData={cvData} />
    </BreakSafeSection>
  )
}

export function Certs({ cvData, locale }: SectionProps) {
  if (!cvData.certifications.length) return null
  return (
    <BreakSafeSection title={sectionLabel("certifications", locale)} className="mb-4">
      <ul className="list-disc pl-4">
        {cvData.certifications.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </BreakSafeSection>
  )
}

export function Projects({ cvData, locale }: SectionProps) {
  if (!cvData.projects.length) return null
  return (
    <BreakSafeSection title={sectionLabel("projects", locale)} className="mb-4">
      <div className="space-y-2">
        {cvData.projects.map((p) => (
          <div key={p.id}>
            {p.url ? (
              <a href={ensureUrl(p.url)} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--cv-accent,theme(colors.zinc.900))] no-underline" style={{ fontFamily: "var(--cv-font-heading)" }}>{p.name}</a>
            ) : (
              <span className="font-semibold" style={{ fontFamily: "var(--cv-font-heading)" }}>{p.name}</span>
            )}
            {p.description ? <div className="text-xs text-zinc-700 mt-0.5">{p.description}</div> : null}
            {p.tech_stack.length > 0 ? <div className="text-xs text-zinc-500">{p.tech_stack.join(", ")}</div> : null}
          </div>
        ))}
      </div>
    </BreakSafeSection>
  )
}

export function Lang({ cvData, locale }: SectionProps) {
  if (!cvData.languages.length) return null
  return (
    <BreakSafeSection title={sectionLabel("languages", locale)} className="mb-4">
      <ul className="list-disc pl-4">
        {cvData.languages.map((l) => (
          <li key={l.id}>
            {l.language} — {l.level}
            {l.cefr ? ` (${l.cefr})` : ""}
          </li>
        ))}
      </ul>
    </BreakSafeSection>
  )
}

export function Volunteer({ cvData, locale }: SectionProps) {
  if (!cvData.volunteer.length) return null
  return (
    <BreakSafeSection title={sectionLabel("volunteer", locale)} className="mb-4">
      <div className="space-y-3">
        {cvData.volunteer.map((v) => (
          <div key={v.id} className="break-inside-avoid">
            <div className="font-semibold" style={{ fontFamily: "var(--cv-font-heading)" }}>
              {v.role}
            </div>
            <div className="text-sm text-zinc-600">
              {v.organization} · {periodStr(v.period, locale)}
            </div>
            {v.description ? <p className="mt-1 text-sm">{v.description}</p> : null}
          </div>
        ))}
      </div>
    </BreakSafeSection>
  )
}

export function Interests({ cvData, locale }: SectionProps) {
  if (!cvData.interests.length) return null
  return (
    <BreakSafeSection title={sectionLabel("interests", locale)} className="mb-4">
      <p>{cvData.interests.join(", ")}</p>
    </BreakSafeSection>
  )
}

export function Signature({ cvData }: { cvData: CvData }) {
  if (!cvData.signature) return null
  const { city, date, image } = cvData.signature
  if (!city && !date && !image) return null
  return (
    <div className="mt-8 break-inside-avoid border-t border-zinc-200 pt-4">
      <p className="text-sm text-zinc-700">
        {[city, date].filter(Boolean).join(", ")}
      </p>
      {image ? (
        <img
          src={image}
          alt="Signature"
          className="mt-2 h-16 w-auto object-contain"
        />
      ) : (
        <div className="mt-6 w-48 border-t border-zinc-400" />
      )}
    </div>
  )
}
