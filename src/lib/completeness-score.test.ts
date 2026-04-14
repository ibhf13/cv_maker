import { describe, it, expect } from "vitest"
import { computeScore, getScoreTier } from "./completeness-score"
import { createEmptyCvData } from "./cv-defaults"

describe("computeScore", () => {
  it("returns 0-range score for empty CV", () => {
    const empty = createEmptyCvData()
    const { score, tips } = computeScore(empty, 2)
    expect(score).toBeLessThan(30)
    expect(tips.length).toBeGreaterThan(0)
  })

  it("gives points for name", () => {
    const data = createEmptyCvData()
    data.personal_info.name = "Max Mustermann"
    const withName = computeScore(data, 2).score
    data.personal_info.name = ""
    const withoutName = computeScore(data, 2).score
    expect(withName).toBeGreaterThan(withoutName)
  })

  it("gives points for ATS-safe template", () => {
    const data = createEmptyCvData()
    data.personal_info.name = "Max"
    const atsSafe = computeScore(data, 2).score // template 2 is ATS-safe
    const notAtsSafe = computeScore(data, 1).score // template 1 is not
    expect(atsSafe).toBeGreaterThan(notAtsSafe)
  })

  it("caps tips at 3", () => {
    const { tips } = computeScore(createEmptyCvData(), 1)
    expect(tips.length).toBeLessThanOrEqual(3)
  })
})

describe("getScoreTier", () => {
  it("returns strong for 80+", () => {
    expect(getScoreTier(80)).toBe("strong")
    expect(getScoreTier(100)).toBe("strong")
  })

  it("returns moderate for 50-79", () => {
    expect(getScoreTier(50)).toBe("moderate")
    expect(getScoreTier(79)).toBe("moderate")
  })

  it("returns weak for below 50", () => {
    expect(getScoreTier(0)).toBe("weak")
    expect(getScoreTier(49)).toBe("weak")
  })
})
