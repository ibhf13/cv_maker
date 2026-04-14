import { describe, expect, it } from "vitest"
import { validateEmail, validatePhone, validatePLZ, validateDateDE } from "./validators"

describe("validateEmail", () => {
  it("accepts empty string", () => expect(validateEmail("").valid).toBe(true))
  it("accepts valid email", () => expect(validateEmail("a@b.de").valid).toBe(true))
  it("rejects missing @", () => expect(validateEmail("ab.de").valid).toBe(false))
})

describe("validatePhone", () => {
  it("accepts empty string", () => expect(validatePhone("").valid).toBe(true))
  it("accepts German number", () => expect(validatePhone("+49 170 1234567").valid).toBe(true))
  it("rejects letters", () => expect(validatePhone("abc").valid).toBe(false))
})

describe("validatePLZ", () => {
  it("accepts empty string", () => expect(validatePLZ("").valid).toBe(true))
  it("accepts 5-digit PLZ", () => expect(validatePLZ("80331").valid).toBe(true))
  it("rejects 4-digit", () => expect(validatePLZ("8033").valid).toBe(false))
  it("rejects letters", () => expect(validatePLZ("ABCDE").valid).toBe(false))
})

describe("validateDateDE", () => {
  it("accepts empty string", () => expect(validateDateDE("").valid).toBe(true))
  it("accepts valid date", () => expect(validateDateDE("15.03.1992").valid).toBe(true))
  it("rejects wrong format", () => expect(validateDateDE("1992-03-15").valid).toBe(false))
  it("rejects invalid day", () => expect(validateDateDE("31.02.2000").valid).toBe(false))
})
