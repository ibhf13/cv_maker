import { describe, expect, it } from "vitest"
import { detectGaps } from "./gap-detect"
import type { CvData } from "./cv-schema"

type Exp = CvData["experience"][number]

function entry(start: string, end: string | null, current = false): Exp {
  return { id: "test", title: "", company: "", location: "", period: { start, end, current }, description: [] }
}

describe("detectGaps", () => {
  it("returns empty for contiguous entries", () => {
    const exps = [entry("01.2020", "06.2021"), entry("07.2021", "12.2022")]
    expect(detectGaps(exps)).toEqual([])
  })

  it("detects a gap between two entries", () => {
    const exps = [entry("01.2020", "03.2021"), entry("10.2021", "12.2022")]
    const gaps = detectGaps(exps)
    expect(gaps).toHaveLength(1)
    expect(gaps[0].from).toBe("03.2021")
    expect(gaps[0].to).toBe("10.2021")
    expect(gaps[0].months).toBe(7)
  })

  it("handles current role without error", () => {
    const exps = [entry("01.2020", "06.2021"), entry("08.2023", null, true)]
    const gaps = detectGaps(exps)
    expect(gaps.length).toBeGreaterThanOrEqual(1)
  })

  it("returns empty for a single entry", () => {
    expect(detectGaps([entry("01.2020", "12.2022")])).toEqual([])
  })

  it("returns empty for empty array", () => {
    expect(detectGaps([])).toEqual([])
  })

  it("ignores entries with invalid dates", () => {
    const exps = [entry("invalid", "12.2022"), entry("01.2023", "06.2023")]
    expect(detectGaps(exps)).toEqual([])
  })

  it("does not flag overlapping entries", () => {
    const exps = [entry("01.2020", "12.2021"), entry("06.2021", "12.2022")]
    expect(detectGaps(exps)).toEqual([])
  })

  it("sorts entries with the same start date deterministically by end date", () => {
    // Two jobs starting the same month; the shorter-ending one should sort first.
    // Without the tiebreaker, the order is non-deterministic and gap detection can flip.
    const exps = [entry("01.2020", "12.2020"), entry("01.2020", "06.2020"), entry("09.2021", "12.2022")]
    const gaps = detectGaps(exps)
    // The gap is measured from the later of the two 2020 ends (12.2020) to 09.2021.
    expect(gaps).toHaveLength(1)
    expect(gaps[0].from).toBe("12.2020")
    expect(gaps[0].to).toBe("09.2021")
  })
})
