import type { FC, ReactNode } from "react"
import type { CvData } from "@/lib/cv-schema"
import type { CvLocale, CvSectionKey, SectionConfig } from "@/types/ui"
import { sectionLabel } from "@/lib/locale"
import { visibleSectionKeys } from "@/lib/section-order"
import { BreakSafeSection, periodStr } from "./shared"
import {
  Summary,
  SkillsSection,
  Certs,
  Projects,
  Lang,
  Interests,
  Signature,
} from "./section-renderers"

type SectionProps = {
  cvData: CvData
  locale: CvLocale
}

/**
 * Date-left, content-right row — the iconic layout of the German
 * tabellarischer Lebenslauf. The date column is narrow and left-aligned so
 * the reader can scan the timeline at a glance.
 */
function TabRow({ period, children }: { period: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 break-inside-avoid">
      <div
        className="pt-0.5 text-sm font-medium tabular-nums text-zinc-600"
        style={{ fontFamily: "var(--cv-font-heading)" }}
      >
        {period}
      </div>
      <div>{children}</div>
    </div>
  )
}

export function ExpTabellarisch({ cvData, locale }: SectionProps) {
  if (!cvData.experience.length) return null
  return (
    <BreakSafeSection title={sectionLabel("experience", locale)} className="mb-5">
      <div className="space-y-3">
        {cvData.experience.map((ex) => (
          <TabRow key={ex.id} period={periodStr(ex.period, locale)}>
            <div className="font-semibold text-zinc-900" style={{ fontFamily: "var(--cv-font-heading)" }}>
              {ex.title}
            </div>
            <div className="text-sm text-zinc-600">
              {[ex.company, ex.location].filter(Boolean).join(" · ")}
            </div>
            {ex.description.length > 0 ? (
              <ul className="mt-1 list-disc space-y-0.5 pl-4">
                {ex.description.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            ) : null}
          </TabRow>
        ))}
      </div>
    </BreakSafeSection>
  )
}

export function EduTabellarisch({ cvData, locale }: SectionProps) {
  if (!cvData.education.length) return null
  return (
    <BreakSafeSection title={sectionLabel("education", locale)} className="mb-5">
      <div className="space-y-3">
        {cvData.education.map((e) => {
          const period = [e.period.start, e.period.end].filter(Boolean).join(" – ")
          return (
            <TabRow key={e.id} period={period}>
              <div className="font-semibold text-zinc-900" style={{ fontFamily: "var(--cv-font-heading)" }}>
                {e.degree}
              </div>
              <div className="text-sm text-zinc-600">
                {[e.institution, e.location].filter(Boolean).join(" · ")}
              </div>
              {e.thesis ? <p className="mt-1 text-sm">Thesis: {e.thesis}</p> : null}
              {e.grade ? <p className="mt-0.5 text-sm text-zinc-600">Note: {e.grade}</p> : null}
            </TabRow>
          )
        })}
      </div>
    </BreakSafeSection>
  )
}

export function VolunteerTabellarisch({ cvData, locale }: SectionProps) {
  if (!cvData.volunteer.length) return null
  return (
    <BreakSafeSection title={sectionLabel("volunteer", locale)} className="mb-5">
      <div className="space-y-3">
        {cvData.volunteer.map((v) => (
          <TabRow key={v.id} period={periodStr(v.period, locale)}>
            <div className="font-semibold text-zinc-900" style={{ fontFamily: "var(--cv-font-heading)" }}>
              {v.role}
            </div>
            <div className="text-sm text-zinc-600">{v.organization}</div>
            {v.description ? <p className="mt-1 text-sm">{v.description}</p> : null}
          </TabRow>
        ))}
      </div>
    </BreakSafeSection>
  )
}

const TABELLARISCH_MAP: Record<CvSectionKey, FC<SectionProps>> = {
  summary: Summary,
  experience: ExpTabellarisch,
  education: EduTabellarisch,
  skills: SkillsSection,
  certifications: Certs,
  projects: Projects,
  languages: Lang,
  volunteer: VolunteerTabellarisch,
  interests: Interests,
}

export function OrderedSectionsTabellarisch({
  cvData,
  locale,
  sectionConfig,
}: {
  cvData: CvData
  locale: CvLocale
  sectionConfig: SectionConfig
}) {
  return (
    <>
      {visibleSectionKeys(sectionConfig).map((k) => {
        const C = TABELLARISCH_MAP[k]
        return C ? <C key={k} cvData={cvData} locale={locale} /> : null
      })}
      <Signature cvData={cvData} />
    </>
  )
}
