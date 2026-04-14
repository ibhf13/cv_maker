import { describe, it, expect } from "vitest"
import { sectionStatus } from "./section-status"
import { createEmptyCvData } from "./cv-defaults"

describe("sectionStatus", () => {
  it("returns empty for blank personal section", () => {
    expect(sectionStatus("personal", createEmptyCvData())).toBe("empty")
  })

  it("returns partial when only name is filled", () => {
    const data = createEmptyCvData()
    data.personal_info.name = "Max"
    expect(sectionStatus("personal", data)).toBe("partial")
  })

  it("returns empty for blank summary", () => {
    expect(sectionStatus("summary", createEmptyCvData())).toBe("empty")
  })

  it("returns complete for long summary", () => {
    const data = createEmptyCvData()
    data.summary = "A".repeat(200)
    expect(sectionStatus("summary", data)).toBe("complete")
  })

  it("returns empty for no experience", () => {
    expect(sectionStatus("experience", createEmptyCvData())).toBe("empty")
  })

  it("returns empty for no skills", () => {
    expect(sectionStatus("skills", createEmptyCvData())).toBe("empty")
  })
})
