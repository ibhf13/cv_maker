import { describe, it, expect } from "vitest"
import { cn, swapItems, luminance, contrastOnWhite } from "./utils"

describe("cn", () => {
  it("merges tailwind classes", () => {
    const result = cn("px-2 py-1", "px-4")
    expect(result).toContain("px-4")
    expect(result).toContain("py-1")
    expect(result).not.toContain("px-2")
  })

  it("handles undefined and false values", () => {
    expect(cn("base", undefined, null)).toBe("base")
  })
})

describe("swapItems", () => {
  it("swaps adjacent elements", () => {
    expect(swapItems([1, 2, 3], 0, 1)).toEqual([2, 1, 3])
    expect(swapItems([1, 2, 3], 1, -1)).toEqual([2, 1, 3])
  })

  it("returns same array if out of bounds", () => {
    const arr = [1, 2, 3]
    expect(swapItems(arr, 0, -1)).toBe(arr)
    expect(swapItems(arr, 2, 1)).toBe(arr)
  })
})

describe("luminance", () => {
  it("returns 0 for black", () => {
    expect(luminance("#000000")).toBeCloseTo(0, 4)
  })

  it("returns 1 for white", () => {
    expect(luminance("#ffffff")).toBeCloseTo(1, 2)
  })
})

describe("contrastOnWhite", () => {
  it("returns high contrast for black", () => {
    expect(contrastOnWhite("#000000")).toBeGreaterThan(20)
  })

  it("returns low contrast for white", () => {
    expect(contrastOnWhite("#ffffff")).toBeCloseTo(1, 1)
  })
})
