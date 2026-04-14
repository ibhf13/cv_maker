import type { UiState } from "@/types/ui"
import { DEFAULT_SECTION_ORDER, DEFAULT_CONTACT_ORDER } from "@/types/ui"
import { DEFAULT_THEME, DEFAULT_PHOTO } from "@/lib/theme-constants"

export const PERSIST_VERSION = 1 as const

export function defaultUiState(): UiState {
  return {
    templateId: 1,
    theme: { ...DEFAULT_THEME },
    photo: { ...DEFAULT_PHOTO },
    editorTab: "personal",
    locale: "de",
    sectionConfig: { order: [...DEFAULT_SECTION_ORDER], hidden: [], sidebar: ["skills", "certifications", "volunteer", "languages", "interests"] },
    contactOrder: [...DEFAULT_CONTACT_ORDER],
    hiddenTextLeft: "",
    hiddenTextRight: "",
    pdfSubject: "",
    pdfKeywords: "",
    pdfCreator: "",
    linkFont: false,
    linkSize: true,
    linkLineHeight: true,
  }
}

/** Merge partial persisted UI (e.g. missing fields) with defaults */
export function normalizeUi(ui: Partial<UiState> | undefined): UiState {
  const d = defaultUiState()
  if (!ui) return d
  return {
    ...d,
    ...ui,
    theme: { ...d.theme, ...ui.theme },
    photo: { ...d.photo, ...ui.photo },
    sectionConfig: ui.sectionConfig
      ? { ...d.sectionConfig, ...ui.sectionConfig, sidebar: (ui.sectionConfig as Partial<typeof d.sectionConfig>).sidebar ?? d.sectionConfig.sidebar }
      : d.sectionConfig,
    contactOrder: ui.contactOrder?.length ? ui.contactOrder : d.contactOrder,
  }
}
