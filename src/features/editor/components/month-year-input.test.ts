import { describe, it, expect } from "vitest"
import { parseMonthYear, formatMonthYear } from "./month-year-utils"

describe("parseMonthYear", () => {
  it("parses full MM.YYYY", () => {
    expect(parseMonthYear("03.2024")).toEqual({ month: "03", year: "2024" })
    expect(parseMonthYear("12.1990")).toEqual({ month: "12", year: "1990" })
  })

  it("parses month-only (MM.)", () => {
    expect(parseMonthYear("03.")).toEqual({ month: "03", year: "" })
    expect(parseMonthYear("11.")).toEqual({ month: "11", year: "" })
  })

  it("parses year-only (.YYYY)", () => {
    expect(parseMonthYear(".2024")).toEqual({ month: "", year: "2024" })
    expect(parseMonthYear(".1995")).toEqual({ month: "", year: "1995" })
  })

  it("returns empty for empty string", () => {
    expect(parseMonthYear("")).toEqual({ month: "", year: "" })
  })

  it("returns empty for invalid formats", () => {
    expect(parseMonthYear("2024")).toEqual({ month: "", year: "" })
    expect(parseMonthYear("03")).toEqual({ month: "", year: "" })
    expect(parseMonthYear("3.2024")).toEqual({ month: "", year: "" })
    expect(parseMonthYear("03.24")).toEqual({ month: "", year: "" })
    expect(parseMonthYear("hello")).toEqual({ month: "", year: "" })
  })
})

describe("formatMonthYear", () => {
  it("formats full month and year", () => {
    expect(formatMonthYear("03", "2024")).toBe("03.2024")
  })

  it("formats month only", () => {
    expect(formatMonthYear("03", "")).toBe("03.")
  })

  it("formats year only", () => {
    expect(formatMonthYear("", "2024")).toBe(".2024")
  })

  it("returns empty when both empty", () => {
    expect(formatMonthYear("", "")).toBe("")
  })
})

describe("round-trip: format then parse preserves values", () => {
  it("month selected first, then year", () => {
    // User selects month
    const afterMonth = formatMonthYear("06", "")
    const parsed1 = parseMonthYear(afterMonth)
    expect(parsed1).toEqual({ month: "06", year: "" })

    // User then selects year
    const afterYear = formatMonthYear(parsed1.month, "2025")
    const parsed2 = parseMonthYear(afterYear)
    expect(parsed2).toEqual({ month: "06", year: "2025" })
  })

  it("year selected first, then month", () => {
    // User selects year
    const afterYear = formatMonthYear("", "2025")
    const parsed1 = parseMonthYear(afterYear)
    expect(parsed1).toEqual({ month: "", year: "2025" })

    // User then selects month
    const afterMonth = formatMonthYear("09", parsed1.year)
    const parsed2 = parseMonthYear(afterMonth)
    expect(parsed2).toEqual({ month: "09", year: "2025" })
  })

  it("full value survives re-parse", () => {
    const formatted = formatMonthYear("01", "2020")
    expect(parseMonthYear(formatted)).toEqual({ month: "01", year: "2020" })
  })
})
