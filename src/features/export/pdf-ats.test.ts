import { describe, expect, it } from "vitest"
import { sanitizeWinAnsi } from "./pdf-ats"

describe("sanitizeWinAnsi", () => {
  it("passes through plain ASCII + Latin-1", () => {
    expect(sanitizeWinAnsi("Hello World")).toBe("Hello World")
    expect(sanitizeWinAnsi("Münchner Straße")).toBe("Münchner Straße")
    expect(sanitizeWinAnsi("Ärzte über Öl")).toBe("Ärzte über Öl")
  })

  it("converts smart quotes to ASCII equivalents", () => {
    expect(sanitizeWinAnsi("\u201CQuote\u201D")).toBe('"Quote"')
    expect(sanitizeWinAnsi("\u2018Single\u2019")).toBe("'Single'")
  })

  it("replaces ellipsis with three dots", () => {
    expect(sanitizeWinAnsi("Wait\u2026")).toBe("Wait...")
  })

  it("strips zero-width characters", () => {
    expect(sanitizeWinAnsi("a\u200Bb\uFEFFc")).toBe("abc")
  })

  it("strips characters outside Latin-1 range", () => {
    expect(sanitizeWinAnsi("Hello \u4e16\u754c")).toBe("Hello ")
    expect(sanitizeWinAnsi("React \u2764 TS")).toBe("React  TS")
  })

  it("converts en-dash and em-dash to ASCII hyphens", () => {
    expect(sanitizeWinAnsi("2020\u20132023")).toBe("2020-2023")
    expect(sanitizeWinAnsi("A\u2014B")).toBe("A--B")
  })

  it("replaces non-breaking space with regular space", () => {
    expect(sanitizeWinAnsi("a\u00A0b")).toBe("a b")
  })
})
