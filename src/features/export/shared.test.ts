import { describe, it, expect } from "vitest"
import { formatAddress, formatPeriod } from "./shared"

describe("formatAddress", () => {
  it("formats full address", () => {
    expect(formatAddress({ street: "Musterstr. 1", plz: "10115", city: "Berlin" }))
      .toBe("Musterstr. 1, 10115 Berlin")
  })

  it("handles missing street", () => {
    expect(formatAddress({ street: "", plz: "10115", city: "Berlin" }))
      .toBe("10115 Berlin")
  })

  it("handles all empty", () => {
    expect(formatAddress({ street: "", plz: "", city: "" })).toBe("")
  })
})

describe("formatPeriod", () => {
  it("formats standard period", () => {
    expect(formatPeriod({ start: "01.2020", end: "06.2023", current: false }, "en"))
      .toBe("01.2020 – 06.2023")
  })

  it("formats current period in German", () => {
    expect(formatPeriod({ start: "03.2022", end: null, current: true }, "de"))
      .toBe("03.2022 – heute")
  })

  it("formats current period in English", () => {
    expect(formatPeriod({ start: "03.2022", end: null, current: true }, "en"))
      .toBe("03.2022 – Present")
  })
})
