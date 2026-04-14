import type { CvData } from "@/lib/cv-schema"
import { cvSchema } from "@/lib/cv-schema"
import { backfillIds } from "@/lib/id"
import type { CvLocale } from "@/types/ui"
import { downloadBlob } from "./shared"

const JSON_SCHEMA_VERSION = 1

type CvJsonExport = {
  version: number
  locale: CvLocale
  exportedAt: string
  cvData: CvData
}

export function downloadCvJson(
  cvData: CvData,
  filename = "cv-data.json",
  locale: CvLocale = "de",
) {
  const payload: CvJsonExport = {
    version: JSON_SCHEMA_VERSION,
    locale,
    exportedAt: new Date().toISOString(),
    cvData,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  })
  downloadBlob(blob, filename)
}

/** Parse imported JSON — supports versioned wrapper or raw cvData */
export function parseImportedJson(raw: unknown): {
  success: true
  data: CvData
} | {
  success: false
  error: string
} {
  if (!raw || typeof raw !== "object") {
    return { success: false, error: "Expected a JSON object." }
  }

  const obj = raw as Record<string, unknown>

  // Versioned wrapper: { version, cvData }
  if ("version" in obj && "cvData" in obj) {
    const result = cvSchema.safeParse(obj.cvData)
    if (result.success) return { success: true, data: backfillIds(result.data) }
    const msg = result.error.issues
      .slice(0, 8)
      .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
      .join("\n")
    return { success: false, error: msg }
  }

  // Legacy: raw cvData object (no wrapper)
  const result = cvSchema.safeParse(raw)
  if (result.success) return { success: true, data: backfillIds(result.data) }
  const msg = result.error.issues
    .slice(0, 8)
    .map((i) => `${i.path.join(".") || "root"}: ${i.message}`)
    .join("\n")
  return { success: false, error: msg }
}
