import { describe, expect, it } from "vitest"
import { cvSchema } from "./cv-schema"
import { createEmptyCvData } from "./cv-defaults"

describe("cvSchema", () => {
  it("accepts empty defaults", () => {
    const r = cvSchema.safeParse(createEmptyCvData())
    expect(r.success).toBe(true)
  })

  it("accepts education array with multiple items", () => {
    const d = createEmptyCvData()
    d.education = [
      {
        id: "edu-1",
        degree: "B.Sc. Informatik",
        institution: "TU München",
        location: "München",
        period: { start: "10.2016", end: "09.2020" },
        thesis: "",
        grade: "",
      },
      {
        id: "edu-2",
        degree: "M.Sc. Informatik",
        institution: "TU München",
        location: "München",
        period: { start: "10.2020", end: "03.2023" },
        thesis: "ML-based CV parsing",
        grade: "1.3",
      },
    ]
    const r = cvSchema.safeParse(d)
    expect(r.success).toBe(true)
  })

  it("accepts empty education array", () => {
    const d = createEmptyCvData()
    d.education = []
    const r = cvSchema.safeParse(d)
    expect(r.success).toBe(true)
  })

  it("validates structured address object", () => {
    const d = createEmptyCvData()
    d.personal_info.address = { street: "Musterstr. 1", plz: "80333", city: "München" }
    const r = cvSchema.safeParse(d)
    expect(r.success).toBe(true)
  })

  it("includes place_of_birth and nationality fields", () => {
    const d = createEmptyCvData()
    d.personal_info.place_of_birth = "Berlin"
    d.personal_info.nationality = "Deutsch"
    const r = cvSchema.safeParse(d)
    expect(r.success).toBe(true)
  })

  it("accepts flexible skills categories", () => {
    const d = createEmptyCvData()
    d.skills = [
      { id: "sk-1", category: "Frontend", items: ["React", "TypeScript"] },
      { id: "sk-2", category: "Backend", items: ["Node.js"] },
      { id: "sk-3", category: "Data Science", items: ["pandas", "DeepSeek"] },
    ]
    const r = cvSchema.safeParse(d)
    expect(r.success).toBe(true)
  })

  it("accepts empty skills array", () => {
    const d = createEmptyCvData()
    d.skills = []
    const r = cvSchema.safeParse(d)
    expect(r.success).toBe(true)
  })

  it("rejects current job with non-null end", () => {
    const d = createEmptyCvData()
    d.experience = [
      {
        id: "exp-1",
        title: "Dev",
        company: "Co",
        location: "X",
        period: { start: "01/2020", end: "01/2021", current: true },
        description: ["a"],
      },
    ]
    const r = cvSchema.safeParse(d)
    expect(r.success).toBe(false)
  })
})
