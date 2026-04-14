/** Safari before 15.4 may lack crypto.randomUUID */
export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  return `id_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
}

/** Walk all array item fields on a CvData-shaped object and fill missing ids. */
export function backfillIds<T extends Record<string, unknown>>(data: T): T {
  const ARRAY_KEYS = [
    "experience",
    "education",
    "skills",
    "projects",
    "languages",
    "volunteer",
  ] as const

  for (const key of ARRAY_KEYS) {
    const arr = data[key]
    if (!Array.isArray(arr)) continue
    for (const item of arr) {
      if (typeof item === "object" && item !== null && !("id" in item && (item as Record<string, unknown>).id)) {
        ;(item as Record<string, unknown>).id = createId()
      }
    }
  }
  return data
}
