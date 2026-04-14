/** Normalize a user-entered URL by prepending `https://` when the scheme is missing. */
export function ensureUrl(raw: string): string {
  if (!raw) return ""
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw
  return `https://${raw}`
}
