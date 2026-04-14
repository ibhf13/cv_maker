// Single-column templates — the default layout family for ATS-friendly CVs.
//   Template02  Centered typography
//   Template03  Accent-strip header
//   Template04  Tabellarisch (classic German date-left / content-right)
//   Template05  Executive small-caps

import type { CvTemplateProps } from "./shared"
import { CvPhoto, SectionStyleProvider, themeVars } from "./shared"
import { Body, ContactBlock } from "./section-renderers"
import { OrderedSections } from "./ordered-sections"
import { OrderedSectionsTabellarisch } from "./section-tabellarisch"

/** Centered — refined typographic hierarchy, hairline separator */
export function Template02({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  return (
    <div className="mx-auto max-w-[48rem] bg-white p-10 text-[length:var(--tw-text,11px)]" style={themeVars(theme)}>
      <div className="mb-8 flex flex-col items-center text-center">
        <CvPhoto photo={photo} className="mb-4 size-36" />
        <h1
          className="text-[1.9rem] font-semibold tracking-tight"
          style={{ fontFamily: "var(--cv-font-heading)", color: "var(--cv-accent)" }}
        >
          {cvData.personal_info.name}
        </h1>
        <div
          className="mt-3 mb-4 h-px w-16"
          style={{ backgroundColor: "var(--cv-accent)" }}
          aria-hidden
        />
        <ContactBlock p={cvData.personal_info} contactOrder={contactOrder} />
      </div>
      <Body>
        <SectionStyleProvider style="caps">
          <OrderedSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} />
        </SectionStyleProvider>
      </Body>
    </div>
  )
}

/** Akzent Strip — thin accent rule under name (ATS-safe, German-friendly) */
export function Template03({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  return (
    <div className="bg-white p-10 text-[length:var(--tw-text,11px)]" style={themeVars(theme)}>
      <header className="mb-6 flex items-start justify-between gap-6 pb-4" style={{ borderBottom: "3px solid var(--cv-accent)" }}>
        <div className="flex-1">
          <h1
            className="text-[2rem] font-semibold leading-tight tracking-tight"
            style={{ fontFamily: "var(--cv-font-heading)", color: "var(--cv-accent)" }}
          >
            {cvData.personal_info.name}
          </h1>
          <div className="mt-3">
            <ContactBlock p={cvData.personal_info} contactOrder={contactOrder} />
          </div>
        </div>
        <CvPhoto photo={photo} className="size-36 shrink-0" />
      </header>
      <Body>
        <OrderedSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} />
      </Body>
    </div>
  )
}

/** Tabellarisch — classic German date-left / content-right layout */
export function Template04({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  return (
    <div className="bg-white p-10 text-[length:var(--tw-text,11px)]" style={themeVars(theme)}>
      <header className="mb-7 grid grid-cols-[7rem_1fr_auto] items-start gap-4 pb-5 border-b border-zinc-200">
        <div
          className="pt-1 text-xs font-semibold uppercase tracking-[0.16em]"
          style={{ fontFamily: "var(--cv-font-heading)", color: "var(--cv-accent)" }}
        >
          Lebenslauf
        </div>
        <div>
          <h1
            className="text-[1.85rem] font-semibold leading-tight tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--cv-font-heading)" }}
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
        <SectionStyleProvider style="rule">
          <OrderedSectionsTabellarisch cvData={cvData} locale={locale} sectionConfig={sectionConfig} />
        </SectionStyleProvider>
      </Body>
    </div>
  )
}

/** Executive — small-caps name, hairline rule, subtle metadata strip (ATS-safe) */
export function Template05({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  return (
    <div className="bg-white text-[length:var(--tw-text,11px)]" style={themeVars(theme)}>
      <header className="px-10 pt-10 pb-5">
        <div className="flex items-end justify-between gap-6">
          <div className="flex-1">
            <h1
              className="text-[1.35rem] font-semibold uppercase tracking-[0.22em] text-zinc-900"
              style={{ fontFamily: "var(--cv-font-heading)" }}
            >
              {cvData.personal_info.name}
            </h1>
            <div
              className="mt-3 h-[2px] w-12"
              style={{ backgroundColor: "var(--cv-accent)" }}
              aria-hidden
            />
            <div className="mt-3">
              <ContactBlock p={cvData.personal_info} contactOrder={contactOrder} />
            </div>
          </div>
          <CvPhoto photo={photo} className="size-32 shrink-0" />
        </div>
      </header>
      <div className="border-t border-zinc-200" aria-hidden />
      <div className="px-10 py-6">
        <Body>
          <SectionStyleProvider style="caps">
            <OrderedSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} />
          </SectionStyleProvider>
        </Body>
      </div>
    </div>
  )
}
