export type ValidationResult = { valid: boolean; message?: string }

export function validateEmail(v: string): ValidationResult {
  if (!v.trim()) return { valid: true }
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  return ok ? { valid: true } : { valid: false, message: "Invalid email address" }
}

export function validatePhone(v: string): ValidationResult {
  if (!v.trim()) return { valid: true }
  const ok = /^\+?[\d\s\-()]{7,20}$/.test(v.trim())
  return ok ? { valid: true } : { valid: false, message: "Use format: +49 170 1234567" }
}

export function validatePLZ(v: string): ValidationResult {
  if (!v.trim()) return { valid: true }
  const ok = /^\d{5}$/.test(v.trim())
  return ok ? { valid: true } : { valid: false, message: "PLZ must be 5 digits" }
}

export function validateDateDE(v: string): ValidationResult {
  if (!v.trim()) return { valid: true }
  const m = v.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  if (!m) return { valid: false, message: "Use format: DD.MM.YYYY" }
  const [, ds, ms, ys] = m
  const d = Number(ds)
  const mo = Number(ms)
  const yr = Number(ys)
  if (mo < 1 || mo > 12) return { valid: false, message: "Invalid month" }
  if (d < 1 || d > 31) return { valid: false, message: "Invalid day" }
  const date = new Date(yr, mo - 1, d)
  const ok = date.getDate() === d && date.getMonth() === mo - 1
  return ok ? { valid: true } : { valid: false, message: "Invalid date" }
}
