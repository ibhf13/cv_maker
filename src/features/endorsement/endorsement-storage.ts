const STORAGE_KEY = "cv-maker-endorsement"

export const DOWNLOAD_THRESHOLD = 3

export type EndorsementOutcome = "dismissed" | "starred" | "donated"

export type EndorsementState = {
  downloadCount: number
  shown: boolean
  outcome: EndorsementOutcome | null
}

const DEFAULT_STATE: EndorsementState = {
  downloadCount: 0,
  shown: false,
  outcome: null,
}

function isEndorsementState(v: unknown): v is EndorsementState {
  if (!v || typeof v !== "object") return false
  const o = v as Record<string, unknown>
  return (
    typeof o.downloadCount === "number"
    && typeof o.shown === "boolean"
    && (o.outcome === null || o.outcome === "dismissed" || o.outcome === "starred" || o.outcome === "donated")
  )
}

export function readEndorsement(): EndorsementState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_STATE }
    const parsed = JSON.parse(raw) as unknown
    if (!isEndorsementState(parsed)) return { ...DEFAULT_STATE }
    return parsed
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function writeEndorsement(state: EndorsementState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or unavailable — silently drop; worst case is we re-prompt.
  }
}

export function incrementDownloadCount(): EndorsementState {
  const next = { ...readEndorsement() }
  next.downloadCount += 1
  writeEndorsement(next)
  return next
}

export function markShown(): void {
  writeEndorsement({ ...readEndorsement(), shown: true })
}

export function markOutcome(outcome: EndorsementOutcome): void {
  writeEndorsement({ ...readEndorsement(), outcome })
}

export function shouldShowEndorsement(state: EndorsementState): boolean {
  return state.downloadCount >= DOWNLOAD_THRESHOLD && !state.shown
}
