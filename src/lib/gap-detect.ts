import type { CvData } from "@/lib/cv-schema"

export type GapInfo = {
  from: string
  to: string
  months: number
}

function parseMonthYear(s: string): Date | null {
  const m = s.match(/^(\d{2})\.(\d{4})$/)
  if (!m) return null
  return new Date(Number(m[2]), Number(m[1]) - 1)
}

export function detectGaps(experience: CvData["experience"]): GapInfo[] {
  const entries = experience
    .map((ex) => ({
      start: parseMonthYear(ex.period.start),
      end: ex.period.current ? new Date() : parseMonthYear(ex.period.end ?? ""),
    }))
    .filter((e): e is { start: Date; end: Date } => e.start !== null && e.end !== null)
    .sort((a, b) => a.start.getTime() - b.start.getTime() || a.end.getTime() - b.end.getTime())

  const gaps: GapInfo[] = []
  for (let i = 1; i < entries.length; i++) {
    const prevEnd = entries[i - 1].end
    const currStart = entries[i].start
    const diffMonths =
      (currStart.getFullYear() - prevEnd.getFullYear()) * 12 +
      currStart.getMonth() -
      prevEnd.getMonth()
    if (diffMonths > 1) {
      const fromMonth = String(prevEnd.getMonth() + 1).padStart(2, "0")
      const toMonth = String(currStart.getMonth() + 1).padStart(2, "0")
      gaps.push({
        from: `${fromMonth}.${prevEnd.getFullYear()}`,
        to: `${toMonth}.${currStart.getFullYear()}`,
        months: diffMonths,
      })
    }
  }
  return gaps
}
