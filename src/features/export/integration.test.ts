import { describe, expect, it } from "vitest"
import { GERMAN_EXAMPLE_CV } from "@/lib/example-cv"
import { buildAtsPdf } from "./pdf-ats"
import { parseImportedJson } from "./json"
import { formatAddress, formatPeriod } from "./shared"
import { cvSchema } from "@/lib/cv-schema"

describe("export pipelines — integration", () => {
  describe("buildAtsPdf", () => {
    it("produces a non-empty PDF blob for a full German example CV", async () => {
      const blob = await buildAtsPdf(GERMAN_EXAMPLE_CV, "de")
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.type).toBe("application/pdf")
      expect(blob.size).toBeGreaterThan(1000)
    })

    it("accepts English locale without throwing", async () => {
      const blob = await buildAtsPdf(GERMAN_EXAMPLE_CV, "en")
      expect(blob.size).toBeGreaterThan(1000)
    })

    it("handles an empty CV (all sections zero-length)", async () => {
      const empty = cvSchema.parse({
        personal_info: { name: "", date_of_birth: "", place_of_birth: "", nationality: "",
          marital_status: "", driving_license: "",
          address: { street: "", plz: "", city: "" },
          phone: "", email: "", website: "", linkedin: "", xing: "" },
        summary: "",
        experience: [], education: [], skills: [], languages: [],
        projects: [], volunteer: [], certifications: [], interests: [],
      })
      const blob = await buildAtsPdf(empty, "de")
      expect(blob.type).toBe("application/pdf")
    })

    it("respects sectionConfig order and hidden", async () => {
      // Hide everything — PDF still builds; just header survives.
      const blob = await buildAtsPdf(GERMAN_EXAMPLE_CV, "de", {
        order: ["summary", "experience", "education", "skills", "languages",
          "projects", "volunteer", "interests", "certifications"],
        hidden: ["summary", "experience", "education", "skills", "languages",
          "projects", "volunteer", "interests", "certifications"],
        sidebar: [],
      })
      expect(blob.size).toBeGreaterThan(500)
    })
  })

  describe("JSON roundtrip", () => {
    it("parses a versioned JSON export wrapper back into the same cvData", () => {
      const wrapped = {
        version: 1,
        locale: "de" as const,
        exportedAt: new Date().toISOString(),
        cvData: GERMAN_EXAMPLE_CV,
      }
      const result = parseImportedJson(wrapped)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.personal_info.name).toBe(GERMAN_EXAMPLE_CV.personal_info.name)
        expect(result.data.experience).toHaveLength(GERMAN_EXAMPLE_CV.experience.length)
      }
    })

    it("parses a legacy raw cvData object (no wrapper)", () => {
      const result = parseImportedJson(GERMAN_EXAMPLE_CV)
      expect(result.success).toBe(true)
    })

    it("rejects a non-object payload", () => {
      const r1 = parseImportedJson(null)
      const r2 = parseImportedJson("string")
      const r3 = parseImportedJson(42)
      expect(r1.success).toBe(false)
      expect(r2.success).toBe(false)
      expect(r3.success).toBe(false)
    })

    it("rejects schema-violating payloads with a useful error message", () => {
      const result = parseImportedJson({ ...GERMAN_EXAMPLE_CV, personal_info: { name: 42 } })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.length).toBeGreaterThan(0)
      }
    })
  })

  describe("shared formatters — German market conventions", () => {
    it("formatAddress joins street, PLZ and city with DIN 5008 convention", () => {
      expect(formatAddress({ street: "Marienplatz 1", plz: "80331", city: "München" }))
        .toBe("Marienplatz 1, 80331 München")
    })

    it("formatPeriod uses 'heute' for current roles in German", () => {
      const s = formatPeriod({ start: "08.2023", end: null, current: true }, "de")
      expect(s).toContain("heute")
      expect(s).not.toContain("Present")
    })

    it("formatPeriod uses 'Present' for current roles in English", () => {
      const s = formatPeriod({ start: "08.2023", end: null, current: true }, "en")
      expect(s).toContain("Present")
    })
  })
})
