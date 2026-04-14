export function parseMonthYear(value: string): { month: string; year: string } {
  const full = value.match(/^(\d{2})\.(\d{4})$/)
  if (full) return { month: full[1], year: full[2] }
  const monthOnly = value.match(/^(\d{2})\.$/)
  if (monthOnly) return { month: monthOnly[1], year: "" }
  const yearOnly = value.match(/^\.(\d{4})$/)
  if (yearOnly) return { month: "", year: yearOnly[1] }
  return { month: "", year: "" }
}

export function formatMonthYear(m: string, y: string): string {
  if (m && y) return `${m}.${y}`
  if (m) return `${m}.`
  if (y) return `.${y}`
  return ""
}
