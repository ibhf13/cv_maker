/* eslint-disable react-refresh/only-export-components -- shared template helpers */
import type { FC } from "react"
import type { CvData } from "@/lib/cv-schema"
import type { CvLocale, CvSectionKey, SectionConfig } from "@/types/ui"
import { visibleSectionKeys } from "@/lib/section-order"
import {
  Summary,
  Exp,
  Edu,
  SkillsSection,
  Certs,
  Projects,
  Lang,
  Volunteer,
  Interests,
  Signature,
} from "./section-renderers"

type SectionProps = { cvData: CvData; locale: CvLocale }

const SECTION_MAP: Record<CvSectionKey, FC<SectionProps>> = {
  summary: Summary,
  experience: Exp,
  education: Edu,
  skills: SkillsSection,
  certifications: Certs,
  projects: Projects,
  languages: Lang,
  volunteer: Volunteer,
  interests: Interests,
}

type OrderedSectionsProps = {
  cvData: CvData
  locale: CvLocale
  sectionConfig: SectionConfig
  excludeKeys?: CvSectionKey[]
}

export function OrderedSections({
  cvData,
  locale,
  sectionConfig,
  excludeKeys,
}: OrderedSectionsProps) {
  return (
    <>
      {visibleSectionKeys(sectionConfig, excludeKeys).map((k) => {
        const C = SECTION_MAP[k]
        return C ? <C key={k} cvData={cvData} locale={locale} /> : null
      })}
      <Signature cvData={cvData} />
    </>
  )
}

export function isSectionVisible(key: CvSectionKey, config: SectionConfig): boolean {
  return !config.hidden.includes(key)
}
