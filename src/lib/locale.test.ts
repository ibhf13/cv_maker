import { describe, expect, it } from "vitest"
import { sectionLabel, presentLabel } from "./locale"

describe("sectionLabel", () => {
  it("returns German labels for de locale", () => {
    expect(sectionLabel("experience", "de")).toBe("Berufserfahrung")
    expect(sectionLabel("education", "de")).toBe("Ausbildung")
    expect(sectionLabel("skills", "de")).toBe("Kenntnisse")
    expect(sectionLabel("summary", "de")).toBe("Profil")
  })

  it("returns English labels for en locale", () => {
    expect(sectionLabel("experience", "en")).toBe("Experience")
    expect(sectionLabel("education", "en")).toBe("Education")
    expect(sectionLabel("skills", "en")).toBe("Skills")
  })

  it("falls back to key for unknown section", () => {
    expect(sectionLabel("unknown_section", "de")).toBe("unknown_section")
  })
})

describe("presentLabel", () => {
  it("returns heute for German", () => {
    expect(presentLabel("de")).toBe("heute")
  })

  it("returns Present for English", () => {
    expect(presentLabel("en")).toBe("Present")
  })
})
