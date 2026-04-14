import { useCvStore } from "@/stores/cv-store"

/**
 * Fine-grained selector hooks. Each subscribes to a single store slice so
 * components only re-render when that slice changes. Prefer these over
 * `useCvStore((s) => s.ui)` when a component reads just a few fields.
 */

export const useCvData = () => useCvStore((s) => s.cvData)

export const useLocale = () => useCvStore((s) => s.ui.locale)

export const useTemplateId = () => useCvStore((s) => s.ui.templateId)

export const useTheme = () => useCvStore((s) => s.ui.theme)

export const usePhoto = () => useCvStore((s) => s.ui.photo)

export const useActiveTab = () => useCvStore((s) => s.ui.editorTab)

export const useSectionConfig = () => useCvStore((s) => s.ui.sectionConfig)

export const useContactOrder = () => useCvStore((s) => s.ui.contactOrder)

export const useSetUi = () => useCvStore((s) => s.setUi)

export const useSetCvData = () => useCvStore((s) => s.setCvData)

export const useSetTheme = () => useCvStore((s) => s.setTheme)

export const useSetPhoto = () => useCvStore((s) => s.setPhoto)

export const useSetTemplateId = () => useCvStore((s) => s.setTemplateId)
