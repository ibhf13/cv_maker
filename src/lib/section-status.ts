import type { CvData } from "@/lib/cv-schema"
import type { EditorSectionTab } from "@/types/ui"

export type SectionStatus = "empty" | "partial" | "complete"

export function sectionStatus(tab: EditorSectionTab, cvData: CvData): SectionStatus {
  switch (tab) {
    case "personal": {
      const pi = cvData.personal_info
      const filled = [pi.name, pi.email, pi.phone].filter((v) => v.trim()).length
      if (filled === 0) return "empty"
      return filled === 3 ? "complete" : "partial"
    }
    case "summary": {
      const len = cvData.summary.trim().length
      if (len === 0) return "empty"
      return len >= 150 ? "complete" : "partial"
    }
    case "experience": {
      if (!cvData.experience.length) return "empty"
      const avgBullets =
        cvData.experience.reduce((s, e) => s + e.description.filter((b) => b.trim()).length, 0) /
        cvData.experience.length
      return avgBullets >= 3 ? "complete" : "partial"
    }
    case "education":
      return cvData.education.length ? "complete" : "empty"
    case "skills": {
      if (!cvData.skills.length || cvData.skills.every((g) => !g.items.length)) return "empty"
      return cvData.skills.some((g) => g.items.length >= 3) ? "complete" : "partial"
    }
    case "languages":
      return cvData.languages.length ? "complete" : "empty"
    case "projects":
      if (!cvData.projects.length) return "empty"
      return cvData.projects.some((p) => p.name.trim()) ? "complete" : "partial"
    case "extra": {
      const hasCerts = cvData.certifications.length > 0
      const hasInterests = cvData.interests.length > 0
      if (!hasCerts && !hasInterests) return "empty"
      return hasCerts && hasInterests ? "complete" : "partial"
    }
  }
}
