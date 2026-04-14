import type { CvLocale } from "@/types/ui"

const LABELS: Record<CvLocale, Record<string, string>> = {
  de: {
    summary: "Profil",
    experience: "Berufserfahrung",
    education: "Ausbildung",
    skills: "Kenntnisse",
    certifications: "Zertifikate",
    projects: "Projekte",
    languages: "Sprachen",
    volunteer: "Ehrenamt",
    interests: "Interessen",
    signature: "Ort, Datum, Unterschrift",
    personal: "Kontakt",
    present: "heute",
  },
  en: {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    certifications: "Certifications",
    projects: "Projects",
    languages: "Languages",
    volunteer: "Volunteer Work",
    interests: "Interests",
    signature: "Place, Date, Signature",
    personal: "Contact",
    present: "Present",
  },
}

export function sectionLabel(key: string, locale: CvLocale): string {
  return LABELS[locale]?.[key] ?? LABELS.en[key] ?? key
}

export function presentLabel(locale: CvLocale): string {
  return LABELS[locale].present
}
