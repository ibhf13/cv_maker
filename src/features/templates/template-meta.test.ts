import { describe, expect, it } from "vitest"
import { getTemplateMeta, isAtsSafe } from "./template-meta"

describe("template-meta", () => {
  it("returns metadata for known templates", () => {
    const m2 = getTemplateMeta(2)
    expect(m2.atsSafe).toBe(true)
    expect(m2.docxParity).toBe(true)
  })

  it("marks multi-column templates as not ATS-safe", () => {
    expect(isAtsSafe(1)).toBe(false)
    expect(isAtsSafe(9)).toBe(false)
    expect(isAtsSafe(10)).toBe(false)
  })

  it("marks single-column templates as ATS-safe", () => {
    expect(isAtsSafe(2)).toBe(true)
    expect(isAtsSafe(3)).toBe(true)
    expect(isAtsSafe(4)).toBe(true)
    expect(isAtsSafe(5)).toBe(true)
    expect(isAtsSafe(6)).toBe(true)
    expect(isAtsSafe(7)).toBe(true)
    expect(isAtsSafe(8)).toBe(true)
  })

  it("returns safe default for unknown template IDs", () => {
    const m = getTemplateMeta(99)
    expect(m.atsSafe).toBe(false)
    expect(m.docxParity).toBe(false)
  })
})
