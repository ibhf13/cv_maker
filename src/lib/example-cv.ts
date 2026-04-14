import type { CvData } from "@/lib/cv-schema"
import { cvSchema } from "@/lib/cv-schema"
import { backfillIds } from "@/lib/id"
import type { UiState } from "@/types/ui"

/** IDs are omitted here — backfillIds() assigns them after parse. */
const RAW = {
  personal_info: {
    name: "Max Mustermann",
    date_of_birth: "15.03.1992",
    place_of_birth: "München",
    nationality: "Deutsch",
    marital_status: "ledig",
    driving_license: "Klasse B",
    address: {
      street: "Marienplatz 1",
      plz: "80331",
      city: "München",
    },
    phone: "+49 151 23456789",
    email: "max.mustermann@example.de",
    website: "max-mustermann.de",
    linkedin: "linkedin.com/in/max-mustermann",
    xing: "xing.com/profile/max-mustermann",
  },
  summary:
    "Erfahrener Frontend-Entwickler mit über fünf Jahren Berufserfahrung in React, TypeScript und modernen Web-Technologien. Ich verbinde technische Präzision mit einem starken Gespür für Nutzererlebnis und liefere skalierbare, barrierearme Lösungen. Ich arbeite gerne in agilen, internationalen Teams und übernehme Verantwortung von der Architektur bis zum Release.",
  experience: [
    {
      title: "Senior Frontend Engineer",
      company: "Siemens AG",
      location: "München",
      period: { start: "08.2023", end: null, current: true },
      description: [
        "Leitung der Frontend-Architektur für ein Kundenportal mit über 40.000 aktiven Nutzern pro Monat.",
        "Einführung eines Design-Systems auf Basis von React, TypeScript und Tailwind CSS; Wiederverwendungsquote um 65 % gesteigert.",
        "Reduktion der Ladezeit der Hauptanwendung um 38 % durch Code-Splitting und Bildoptimierung.",
        "Mentoring von drei Junior-Entwicklerinnen sowie Aufbau interner Frontend-Guidelines.",
      ],
    },
    {
      title: "Frontend Engineer",
      company: "Zalando SE",
      location: "Berlin",
      period: { start: "06.2020", end: "07.2023", current: false },
      description: [
        "Entwicklung und Wartung von Kern-Features des Checkout-Prozesses in einer Micro-Frontend-Architektur.",
        "Erhöhung der Conversion Rate um 7,5 % durch A/B-Tests und inkrementelle UX-Verbesserungen.",
        "Einführung automatisierter Playwright-End-to-End-Tests; Regressionen um 40 % reduziert.",
        "Enger Austausch mit Product, Design und Backend in einem cross-funktionalen Scrum-Team.",
      ],
    },
    {
      title: "Werkstudent Softwareentwicklung",
      company: "Celonis SE",
      location: "München",
      period: { start: "10.2018", end: "05.2020", current: false },
      description: [
        "Umsetzung von Dashboards zur Prozessanalyse mit Angular und D3.js.",
        "Automatisierung wiederkehrender Datenimporte und Reduktion manueller Aufwände um 15 Stunden pro Woche.",
      ],
    },
  ],
  education: [
    {
      degree: "M.Sc. Informatik",
      institution: "Technische Universität München",
      location: "München",
      period: { start: "10.2018", end: "09.2020" },
      thesis:
        "Effiziente Refaktorisierung großer TypeScript-Codebasen mit statischer Analyse",
      grade: "1.3",
    },
    {
      degree: "B.Sc. Informatik",
      institution: "Friedrich-Alexander-Universität Erlangen-Nürnberg",
      location: "Erlangen",
      period: { start: "10.2014", end: "09.2018" },
      thesis: "Web-basierte Visualisierung von Sensordaten in Smart-Home-Systemen",
      grade: "1.7",
    },
  ],
  certifications: [
    "AWS Certified Developer – Associate (2024)",
    "Professional Scrum Master I (2023)",
    "Cambridge Certificate in Advanced English (C1)",
  ],
  skills: [
    {
      category: "IT-Kenntnisse",
      items: [
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "Node.js",
        "GraphQL",
        "Playwright",
        "Docker",
      ],
    },
    {
      category: "Methoden",
      items: ["Scrum", "Kanban", "Test-Driven Development", "Code Reviews", "CI/CD"],
    },
    {
      category: "Soft Skills",
      items: [
        "Lösungsorientiertes Arbeiten",
        "Teamführung",
        "Klare Kommunikation",
        "Eigenverantwortung",
      ],
    },
  ],
  projects: [
    {
      name: "OpenStadt – Bürgerportal",
      url: "github.com/mustermann/openstadt",
      tech_stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker"],
    },
    {
      name: "KlimaTrack – CO₂-Dashboard",
      url: "klimatrack.example.de",
      tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Recharts"],
    },
  ],
  languages: [
    { language: "Deutsch", level: "Muttersprache", cefr: null },
    { language: "Englisch", level: "Verhandlungssicher", cefr: "C1" },
    { language: "Französisch", level: "Gute Kenntnisse", cefr: "B1" },
  ],
  volunteer: [
    {
      role: "Mentor für Jugend-Coding-Workshops",
      organization: "CoderDojo München",
      period: { start: "03.2022", end: null, current: true },
      description: "Ehrenamtliche Betreuung von Web-Development-Kursen für Jugendliche (12–17 Jahre).",
    },
  ],
  interests: [
    "Open-Source-Beiträge",
    "Bergwandern im Alpenraum",
    "Fotografie",
    "Jazz-Konzerte",
    "Kochen",
  ],
  signature: {
    city: "München",
    date: "13.04.2026",
  },
}

const parsed = cvSchema.safeParse(RAW)
if (!parsed.success) {
  throw new Error(
    "example-cv: schema drift — " + JSON.stringify(parsed.error.issues),
  )
}

export const GERMAN_EXAMPLE_CV: CvData = backfillIds(parsed.data)

export const GERMAN_EXAMPLE_UI: Partial<UiState> = {
  templateId: 2,
  locale: "de",
  theme: {
    accent: "#1e3a5f",
    fontHeading: "lato",
    fontBody: "lato",
    bodyPt: 11,
    lineHeight: 1.15,
    headingPt: 13,
    headingLineHeight: 1.2,
  },
}
