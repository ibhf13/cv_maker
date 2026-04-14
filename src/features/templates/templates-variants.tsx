// Layout-variant templates — non-standard header/column shapes.
//   Template06  Editorial (large name, caps sections)
//   Template07  Accent skills (inline skill emphasis, ATS-safe)
//   Template08  DIN (strict caps + hairline)
//   Template09  Photo-right column
//   Template10  Two-column body with optional sidebar

import type { CvTemplateProps } from "./shared"
import { CvPhoto, SectionStyleProvider, themeVars } from "./shared"
import { Body, ContactBlock, Signature } from "./section-renderers"
import { OrderedSections, isSectionVisible } from "./ordered-sections"
import type { CvSectionKey } from "@/types/ui"
import { visibleSectionKeys } from "@/lib/section-order"
import {
  Summary, Exp, Edu, SkillsSection, Certs, Projects, Lang, Volunteer, Interests,
} from "./section-renderers"

/** Section map for Template 10 (break-inside-avoid wrappers) */
const T10_MAP: Record<CvSectionKey, React.FC<{ cvData: CvTemplateProps["cvData"]; locale: CvTemplateProps["locale"] }>> = {
  summary: Summary, experience: Exp, education: Edu, skills: SkillsSection,
  certifications: Certs, projects: Projects, languages: Lang, volunteer: Volunteer, interests: Interests,
}

/** Editorial — large name, refined hierarchy, caps section headers */
export function Template06({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  return (
    <div className="bg-white p-10 text-[length:var(--tw-text,11px)]" style={themeVars(theme)}>
      <div
        className="mb-8 flex items-end justify-between gap-6 pb-5"
        style={{ borderBottom: "1px solid var(--cv-accent)" }}
      >
        <div className="flex-1">
          <h1
            className="text-[2.6rem] font-normal leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--cv-font-heading)", color: "var(--cv-accent)" }}
          >
            {cvData.personal_info.name}
          </h1>
          <div className="mt-3">
            <ContactBlock p={cvData.personal_info} contactOrder={contactOrder} />
          </div>
        </div>
        <CvPhoto photo={photo} className="size-40 shrink-0" />
      </div>
      <Body>
        <SectionStyleProvider style="caps">
          <OrderedSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} />
        </SectionStyleProvider>
      </Body>
    </div>
  )
}

/** Akzent Skills — typographic skill emphasis instead of colored pills (ATS-safe) */
export function Template07({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  const flat = cvData.skills.flatMap((g) => g.items)
  const showSkills = flat.length > 0 && isSectionVisible("skills", sectionConfig)
  return (
    <div className="bg-white p-10 text-[length:var(--tw-text,11px)]" style={themeVars(theme)}>
      <header className="mb-6 flex items-start gap-6 pb-4 border-b border-zinc-200">
        <CvPhoto photo={photo} className="size-36 shrink-0" />
        <div className="flex-1">
          <h1
            className="text-[1.85rem] font-semibold tracking-tight"
            style={{ fontFamily: "var(--cv-font-heading)", color: "var(--cv-accent)" }}
          >
            {cvData.personal_info.name}
          </h1>
          <div className="mt-2">
            <ContactBlock p={cvData.personal_info} contactOrder={contactOrder} />
          </div>
        </div>
      </header>
      {showSkills && (
        <section className="mb-6 break-inside-avoid">
          <p className="text-sm leading-relaxed">
            {flat.map((t, i) => (
              <span key={t}>
                <span className="font-semibold" style={{ color: "var(--cv-accent)" }}>{t}</span>
                {i < flat.length - 1 ? <span className="text-zinc-400"> · </span> : null}
              </span>
            ))}
          </p>
        </section>
      )}
      <Body>
        <SectionStyleProvider style="caps">
          <OrderedSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} excludeKeys={["skills"]} />
        </SectionStyleProvider>
      </Body>
    </div>
  )
}

/** DIN — strict, minimal; hairline dividers, tabellarisch rendering */
export function Template08({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  return (
    <div className="bg-white p-10 text-[length:var(--tw-text,11px)]" style={themeVars(theme)}>
      <header className="mb-7 flex items-start justify-between gap-6 pb-5 border-b border-zinc-300">
        <div className="flex-1">
          <h1
            className="text-[1.3rem] font-medium uppercase tracking-[0.22em] text-zinc-900"
            style={{ fontFamily: "var(--cv-font-heading)" }}
          >
            {cvData.personal_info.name}
          </h1>
          <div className="mt-3">
            <ContactBlock p={cvData.personal_info} contactOrder={contactOrder} />
          </div>
        </div>
        <CvPhoto photo={photo} className="size-32 shrink-0" />
      </header>
      <Body>
        <SectionStyleProvider style="caps">
          <OrderedSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} />
        </SectionStyleProvider>
      </Body>
    </div>
  )
}

/** Split photo right — polished proportions, German-correct photo placement */
export function Template09({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  return (
    <div
      className="grid min-h-full grid-cols-1 bg-white md:grid-cols-[1fr_12rem] text-[length:var(--tw-text,11px)]"
      style={themeVars(theme)}
    >
      <div className="p-10">
        <Body>
          <div className="mb-6 pb-4 border-b-2" style={{ borderColor: "var(--cv-accent)" }}>
            <h1
              className="text-[1.9rem] font-semibold leading-tight tracking-tight"
              style={{ fontFamily: "var(--cv-font-heading)", color: "var(--cv-accent)" }}
            >
              {cvData.personal_info.name}
            </h1>
            <div className="mt-2">
              <ContactBlock p={cvData.personal_info} contactOrder={contactOrder} />
            </div>
          </div>
          <SectionStyleProvider style="default">
            <OrderedSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} />
          </SectionStyleProvider>
        </Body>
      </div>
      <div className="hidden bg-zinc-50 p-5 md:block border-l border-zinc-200">
        <CvPhoto photo={photo} className="aspect-[3/4] w-full" />
      </div>
    </div>
  )
}

/** Two-column body — refined header, caps section style */
export function Template10({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  const sidebarSet = new Set(sectionConfig.sidebar)
  const visibleKeys = visibleSectionKeys(sectionConfig)
  const leftKeys = visibleKeys.filter((k) => !sidebarSet.has(k))
  const rightKeys = visibleKeys.filter((k) => sidebarSet.has(k))

  return (
    <div className="bg-white p-10 text-[length:var(--tw-text,11px)]" style={themeVars(theme)}>
      <header className="mb-7 flex items-start justify-between gap-6 pb-5 border-b border-zinc-200">
        <div className="flex-1">
          <h1
            className="text-[1.9rem] font-semibold tracking-tight"
            style={{ fontFamily: "var(--cv-font-heading)", color: "var(--cv-accent)" }}
          >
            {cvData.personal_info.name}
          </h1>
          <div className="mt-2">
            <ContactBlock p={cvData.personal_info} contactOrder={contactOrder} />
          </div>
        </div>
        <CvPhoto photo={photo} className="size-36 shrink-0" />
      </header>
      <Body>
        <SectionStyleProvider style="caps">
          {rightKeys.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_14rem]">
              <div>
                {leftKeys.map((k) => { const C = T10_MAP[k]; return C ? <div key={k}><C cvData={cvData} locale={locale} /></div> : null })}
                <Signature cvData={cvData} />
              </div>
              <div className="md:border-l md:border-zinc-200 md:pl-6">
                {rightKeys.map((k) => { const C = T10_MAP[k]; return C ? <div key={k}><C cvData={cvData} locale={locale} /></div> : null })}
              </div>
            </div>
          ) : (
            <div className="columns-1 gap-8 md:columns-2">
              {visibleKeys.map((k) => { const C = T10_MAP[k]; return C ? <div key={k}><C cvData={cvData} locale={locale} /></div> : null })}
              <div className="break-inside-avoid"><Signature cvData={cvData} /></div>
            </div>
          )}
        </SectionStyleProvider>
      </Body>
    </div>
  )
}
