import { beforeEach, describe, expect, it } from "vitest"
import {
  DOWNLOAD_THRESHOLD,
  incrementDownloadCount,
  markOutcome,
  markShown,
  readEndorsement,
  shouldShowEndorsement,
  writeEndorsement,
} from "./endorsement-storage"

const KEY = "cv-maker-endorsement"

describe("endorsement-storage", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("returns a default state when storage is empty", () => {
    expect(readEndorsement()).toEqual({ downloadCount: 0, shown: false, outcome: null })
  })

  it("falls back to default state when stored JSON is corrupt", () => {
    localStorage.setItem(KEY, "{not valid json")
    expect(readEndorsement()).toEqual({ downloadCount: 0, shown: false, outcome: null })
  })

  it("falls back to default state when stored shape is wrong", () => {
    localStorage.setItem(KEY, JSON.stringify({ foo: "bar" }))
    expect(readEndorsement()).toEqual({ downloadCount: 0, shown: false, outcome: null })
  })

  it("increments the download count across calls", () => {
    expect(incrementDownloadCount().downloadCount).toBe(1)
    expect(incrementDownloadCount().downloadCount).toBe(2)
    expect(incrementDownloadCount().downloadCount).toBe(3)
    expect(readEndorsement().downloadCount).toBe(3)
  })

  it("shouldShowEndorsement is false below the threshold", () => {
    expect(shouldShowEndorsement({ downloadCount: DOWNLOAD_THRESHOLD - 1, shown: false, outcome: null })).toBe(false)
  })

  it("shouldShowEndorsement is true at the threshold when not yet shown", () => {
    expect(shouldShowEndorsement({ downloadCount: DOWNLOAD_THRESHOLD, shown: false, outcome: null })).toBe(true)
  })

  it("shouldShowEndorsement is false once shown, even at higher counts", () => {
    expect(shouldShowEndorsement({ downloadCount: DOWNLOAD_THRESHOLD + 5, shown: true, outcome: null })).toBe(false)
    expect(shouldShowEndorsement({ downloadCount: DOWNLOAD_THRESHOLD, shown: true, outcome: "dismissed" })).toBe(false)
  })

  it("markShown persists the flag across reads", () => {
    writeEndorsement({ downloadCount: 3, shown: false, outcome: null })
    markShown()
    expect(readEndorsement().shown).toBe(true)
  })

  it("markOutcome persists each terminal state", () => {
    markOutcome("dismissed")
    expect(readEndorsement().outcome).toBe("dismissed")
    markOutcome("starred")
    expect(readEndorsement().outcome).toBe("starred")
    markOutcome("donated")
    expect(readEndorsement().outcome).toBe("donated")
  })

  it("uses DOWNLOAD_THRESHOLD, not a magic number", () => {
    expect(DOWNLOAD_THRESHOLD).toBe(3)
  })
})
