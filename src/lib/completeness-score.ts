import type { CvData } from "@/lib/cv-schema"
import { isAtsSafe } from "@/features/templates/template-meta"
import { detectGaps } from "@/lib/gap-detect"

const SUMMARY_MIN_CHARS = 150
const MIN_EXPERIENCE_COUNT = 2
const MIN_BULLETS_PER_ROLE = 3
const MIN_SKILLS_PER_CATEGORY = 3
const DATE_FORMAT_REGEX = /^\d{2}\.\d{4}$/

type ScoreResult = { score: number; tips: string[] }

/**
 * Compute CV completeness score (0-100) with actionable tips.
 * Pure function — no React or store dependencies.
 */
export function computeScore(cvData: CvData, templateId: number): ScoreResult {
  const tips: string[] = []
  let earned = 0
  let total = 0

  // Name (required)
  total += 10
  if (cvData.personal_info.name.trim()) earned += 10
  else tips.push("Add your name")

  // Contact info
  total += 10
  const hasContact = cvData.personal_info.email.trim() || cvData.personal_info.phone.trim()
  if (hasContact) earned += 10
  else tips.push("Add email or phone")

  // Summary
  total += 10
  const summaryLength = cvData.summary.trim().length
  if (summaryLength >= SUMMARY_MIN_CHARS) earned += 10
  else if (summaryLength > 0) { earned += 5; tips.push(`Expand summary (${SUMMARY_MIN_CHARS}+ chars)`) }
  else tips.push("Add a summary")

  // Experience
  total += 20
  if (cvData.experience.length >= MIN_EXPERIENCE_COUNT) earned += 10
  else if (cvData.experience.length === 1) { earned += 5; tips.push("Add more experience") }
  else tips.push("Add work experience")
  const bulletAverage = cvData.experience.length
    ? cvData.experience.reduce((sum, entry) => sum + entry.description.filter((b) => b.trim()).length, 0) / cvData.experience.length
    : 0
  if (bulletAverage >= MIN_BULLETS_PER_ROLE) earned += 10
  else if (cvData.experience.length) tips.push(`Add ${MIN_BULLETS_PER_ROLE}+ bullets per role`)

  // Education
  total += 10
  if (cvData.education.length) earned += 10
  else tips.push("Add education")

  // Skills
  total += 10
  if (cvData.skills.some((group) => group.items.length >= MIN_SKILLS_PER_CATEGORY)) earned += 10
  else tips.push(`Add ${MIN_SKILLS_PER_CATEGORY}+ skills`)

  // Date format (MM.YYYY)
  total += 10
  const allDatesValid = cvData.experience.every(
    (entry) => DATE_FORMAT_REGEX.test(entry.period.start) && (entry.period.current || (entry.period.end !== null && DATE_FORMAT_REGEX.test(entry.period.end))),
  )
  if (cvData.experience.length && allDatesValid) earned += 10
  else if (cvData.experience.length) tips.push("Use MM.YYYY date format")

  // ATS-safe template
  total += 10
  if (isAtsSafe(templateId)) earned += 10
  else tips.push("Switch to an ATS-safe template")

  // Employment gaps
  const gaps = detectGaps(cvData.experience)
  if (gaps.length > 0) tips.push(`${gaps.length} employment gap(s) detected`)

  // Languages
  total += 5
  if (cvData.languages.length) earned += 5
  else tips.push("Add languages")

  // Photo (German market) — in UI state, not cvData; give neutral points
  total += 5
  earned += 5

  return { score: Math.round((earned / total) * 100), tips: tips.slice(0, 3) }
}

export type ScoreTier = "strong" | "moderate" | "weak"

const STRONG_THRESHOLD = 80
const MODERATE_THRESHOLD = 50

export function getScoreTier(score: number): ScoreTier {
  if (score >= STRONG_THRESHOLD) return "strong"
  if (score >= MODERATE_THRESHOLD) return "moderate"
  return "weak"
}
