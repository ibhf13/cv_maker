import type { CvLocale } from "@/types/ui"
import { LABELS_DE } from "./editor-labels.de"
import { LABELS_EN } from "./editor-labels.en"

const LABELS = { de: LABELS_DE, en: LABELS_EN } as const

export type EditorLabelKey = keyof typeof LABELS_DE

export function editorLabel(key: EditorLabelKey, locale: CvLocale): string {
  return LABELS[locale]?.[key] ?? LABELS.en[key] ?? key
}
