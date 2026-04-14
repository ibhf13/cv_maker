import { describe, expect, it } from "vitest"
import { GERMAN_EXAMPLE_CV, GERMAN_EXAMPLE_UI } from "./example-cv"
import { cvSchema } from "./cv-schema"

describe("example-cv", () => {
  it("parses against cvSchema", () => {
    const r = cvSchema.safeParse(GERMAN_EXAMPLE_CV)
    expect(r.success).toBe(true)
  })

  it("respects current⇒end=null invariant", () => {
    for (const ex of GERMAN_EXAMPLE_CV.experience) {
      if (ex.period.current) expect(ex.period.end).toBeNull()
    }
  })

  it("has German-localized content", () => {
    expect(GERMAN_EXAMPLE_CV.personal_info.nationality).toBe("Deutsch")
    const blob = JSON.stringify(GERMAN_EXAMPLE_CV)
    expect(blob).toMatch(/[äöüÄÖÜß]/)
  })

  it("ships sensible UI defaults for DE market", () => {
    expect(GERMAN_EXAMPLE_UI.locale).toBe("de")
    expect(GERMAN_EXAMPLE_UI.templateId).toBe(2)
    expect(GERMAN_EXAMPLE_UI.theme?.accent).toMatch(/^#[0-9a-f]{6}$/i)
  })
})
