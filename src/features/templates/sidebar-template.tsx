import type { CvTemplateProps } from "./shared"
import { CvPhoto, themeVars } from "./shared"
import { Body, ContactBlock } from "./section-renderers"
import { OrderedSections } from "./ordered-sections"
import { SidebarSections } from "./sidebar-sections"
import type { CvSectionKey } from "@/types/ui"

/** Two-column sidebar */
export function Template01({ cvData, theme, photo, locale, sectionConfig, contactOrder }: CvTemplateProps) {
  const s = themeVars(theme)
  const sidebarKeys: CvSectionKey[] = sectionConfig.sidebar.length ? sectionConfig.sidebar : ["skills", "certifications", "volunteer", "languages", "interests"]
  return (
    <div
      className="grid min-h-[297mm] grid-cols-[17rem_1fr] items-stretch gap-0 bg-white text-[length:var(--tw-text,11px)]"
      style={s}
    >
      <aside
        className="flex min-h-[297mm] flex-col self-stretch p-5 pl-9 text-white"
        style={{ backgroundColor: "var(--cv-accent)" }}
      >
        <div>
          <CvPhoto photo={photo} className="my-4 size-44" />
          <h1
            className="mb-3 text-[1.6em] font-bold leading-tight"
            style={{ fontFamily: "var(--cv-font-heading)" }}
          >
            {cvData.personal_info.name || "Name"}
          </h1>
          <ContactBlock p={cvData.personal_info} inverted contactOrder={contactOrder} />
        </div>
        <SidebarSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} />
        <div className="min-h-0 flex-1" aria-hidden />
      </aside>
      <Body>
        <div className="p-6">
          <OrderedSections cvData={cvData} locale={locale} sectionConfig={sectionConfig} excludeKeys={sidebarKeys} />
        </div>
      </Body>
    </div>
  )
}
