import { describe, expect, it } from "vitest"
import { migrate } from "./cv-store"
import { createEmptyCvData } from "@/lib/cv-defaults"

describe("cv-store migrate", () => {
  it("returns defaults for null/undefined persisted state", () => {
    const r = migrate(null, 0)
    expect(r.cvData).toEqual(createEmptyCvData())
    expect(r.ui.locale).toBe("de")
  })

  it("falls back to empty cvData when the persisted cvData fails schema validation", () => {
    const corrupted = { cvData: { personal_info: "not an object" }, ui: undefined }
    const r = migrate(corrupted, 1)
    expect(r.cvData).toEqual(createEmptyCvData())
  })

  it("preserves valid persisted cvData and normalizes partial ui", () => {
    const valid = createEmptyCvData()
    valid.personal_info.name = "Ada Lovelace"
    const r = migrate({ cvData: valid, ui: { locale: "en" } }, 1)
    expect(r.cvData.personal_info.name).toBe("Ada Lovelace")
    expect(r.ui.locale).toBe("en")
    expect(r.ui.templateId).toBe(1)
  })
})
