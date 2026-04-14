import { beforeEach, describe, expect, it } from "vitest"
import { useCvStore } from "./cv-store"
import { createEmptyCvData } from "@/lib/cv-defaults"
import { DEFAULT_THEME } from "@/lib/theme-constants"

describe("cv-store mutations", () => {
  beforeEach(() => {
    useCvStore.setState({
      cvData: createEmptyCvData(),
      ui: useCvStore.getState().ui,
    })
    useCvStore.getState().resetAll()
    // Clear any undo/redo history left over from previous tests.
    useCvStore.temporal.getState().clear()
  })

  describe("setCvData", () => {
    it("updates a nested field immutably", () => {
      useCvStore.getState().setCvData((d) => ({
        ...d,
        personal_info: { ...d.personal_info, name: "Ada Lovelace" },
      }))
      expect(useCvStore.getState().cvData.personal_info.name).toBe("Ada Lovelace")
    })

    it("does not mutate previous snapshots (zundo temporal)", () => {
      const before = useCvStore.getState().cvData
      useCvStore.getState().setCvData((d) => ({
        ...d,
        personal_info: { ...d.personal_info, name: "Ada" },
      }))
      expect(before.personal_info.name).toBe("")
    })
  })

  describe("setUi / setTheme / setPhoto / setTemplateId", () => {
    it("setUi merges a partial update", () => {
      useCvStore.getState().setUi((u) => ({ ...u, locale: "en" }))
      expect(useCvStore.getState().ui.locale).toBe("en")
      expect(useCvStore.getState().ui.templateId).toBe(1)
    })

    it("setTheme patches only the provided fields", () => {
      useCvStore.getState().setTheme({ accent: "#ff0000" })
      expect(useCvStore.getState().ui.theme.accent).toBe("#ff0000")
      expect(useCvStore.getState().ui.theme.fontBody).toBe(DEFAULT_THEME.fontBody)
    })

    it("setPhoto patches offsetX without clobbering dataUrl", () => {
      useCvStore.getState().setPhoto({ dataUrl: "data:image/jpeg;base64,AAA" })
      useCvStore.getState().setPhoto({ offsetX: 42 })
      expect(useCvStore.getState().ui.photo.dataUrl).toBe("data:image/jpeg;base64,AAA")
      expect(useCvStore.getState().ui.photo.offsetX).toBe(42)
    })

    it("setTemplateId replaces templateId only", () => {
      useCvStore.getState().setTemplateId(7)
      expect(useCvStore.getState().ui.templateId).toBe(7)
      expect(useCvStore.getState().ui.locale).toBe("de")
    })
  })

  describe("resetAll", () => {
    it("restores defaults for cvData and ui", () => {
      useCvStore.getState().setCvData((d) => ({
        ...d, personal_info: { ...d.personal_info, name: "X" },
      }))
      useCvStore.getState().setTheme({ accent: "#abc123" })
      useCvStore.getState().resetAll()
      expect(useCvStore.getState().cvData.personal_info.name).toBe("")
      expect(useCvStore.getState().ui.theme.accent).toBe(DEFAULT_THEME.accent)
    })
  })

  describe("temporal (undo/redo)", () => {
    it("records cvData changes and undo reverts them", () => {
      useCvStore.getState().setCvData((d) => ({
        ...d, personal_info: { ...d.personal_info, name: "First" },
      }))
      useCvStore.getState().setCvData((d) => ({
        ...d, personal_info: { ...d.personal_info, name: "Second" },
      }))
      expect(useCvStore.getState().cvData.personal_info.name).toBe("Second")

      useCvStore.temporal.getState().undo()
      expect(useCvStore.getState().cvData.personal_info.name).toBe("First")

      useCvStore.temporal.getState().redo()
      expect(useCvStore.getState().cvData.personal_info.name).toBe("Second")
    })

    it("undoing a ui-only change after a cvData change keeps the last cvData value", () => {
      useCvStore.getState().setCvData((d) => ({
        ...d, personal_info: { ...d.personal_info, name: "Kept" },
      }))
      // UI mutation after the cvData mutation shouldn't be able to undo the name.
      useCvStore.getState().setTheme({ accent: "#112233" })
      useCvStore.temporal.getState().undo()
      expect(useCvStore.getState().cvData.personal_info.name).toBe("Kept")
    })
  })
})
