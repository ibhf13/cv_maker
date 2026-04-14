import { describe, expect, it } from "vitest"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { GERMAN_EXAMPLE_CV } from "@/lib/example-cv"
import { cvSchema } from "@/lib/cv-schema"
import { buildCvDocx } from "./docx"
import { downloadCvJson, parseImportedJson } from "./json"
import { drawInvisibleTextOverlay, type TextSpan } from "./pdf"

/**
 * Guards every download path from silent regressions. The PDF overlay test
 * specifically covers the WinAnsi issue: StandardFonts.Helvetica cannot
 * encode emoji, arrows, checkmarks, etc. — one bad span must not abort
 * the whole export.
 */
describe("download exports", () => {
  describe("downloadCvJson", () => {
    it("triggers a browser download with a versioned JSON blob", async () => {
      let capturedBlob: Blob | null = null
      let capturedFilename: string | null = null
      const originalCreate = URL.createObjectURL
      const originalRevoke = URL.revokeObjectURL
      URL.createObjectURL = (b: Blob) => {
        capturedBlob = b
        return "blob:mock"
      }
      URL.revokeObjectURL = () => {}

      const originalClick = HTMLAnchorElement.prototype.click
      HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement) {
        capturedFilename = this.download
      }

      try {
        downloadCvJson(GERMAN_EXAMPLE_CV, "test.json", "de")
        expect(capturedFilename).toBe("test.json")
        expect(capturedBlob).not.toBeNull()
        expect(capturedBlob!.type).toBe("application/json")

        const text = await capturedBlob!.text()
        const parsed = JSON.parse(text)
        expect(parsed.version).toBe(1)
        expect(parsed.locale).toBe("de")
        expect(typeof parsed.exportedAt).toBe("string")
        expect(parsed.cvData.personal_info.name).toBe(GERMAN_EXAMPLE_CV.personal_info.name)
      } finally {
        URL.createObjectURL = originalCreate
        URL.revokeObjectURL = originalRevoke
        HTMLAnchorElement.prototype.click = originalClick
      }
    })

    it("roundtrips through parseImportedJson without data loss", async () => {
      let capturedBlob: Blob | null = null
      const originalCreate = URL.createObjectURL
      URL.createObjectURL = (b: Blob) => { capturedBlob = b; return "blob:mock" }
      URL.revokeObjectURL = () => {}
      const originalClick = HTMLAnchorElement.prototype.click
      HTMLAnchorElement.prototype.click = () => {}

      try {
        downloadCvJson(GERMAN_EXAMPLE_CV, "cv.json", "de")
        const raw = JSON.parse(await capturedBlob!.text())
        const result = parseImportedJson(raw)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.experience).toHaveLength(GERMAN_EXAMPLE_CV.experience.length)
          expect(result.data.personal_info.email).toBe(GERMAN_EXAMPLE_CV.personal_info.email)
        }
      } finally {
        URL.createObjectURL = originalCreate
        HTMLAnchorElement.prototype.click = originalClick
      }
    })
  })

  describe("buildCvDocx", () => {
    it("produces a valid DOCX blob for the full German example CV", async () => {
      const blob = await buildCvDocx(GERMAN_EXAMPLE_CV, "de")
      expect(blob).toBeInstanceOf(Blob)
      expect(blob.size).toBeGreaterThan(5000)
    })

    it("produces a valid DOCX blob for the empty CV", async () => {
      const empty = cvSchema.parse({
        personal_info: {
          name: "", date_of_birth: "", place_of_birth: "", nationality: "",
          marital_status: "", driving_license: "",
          address: { street: "", plz: "", city: "" },
          phone: "", email: "", website: "", linkedin: "", xing: "",
        },
        summary: "",
        experience: [], education: [], skills: [], languages: [],
        projects: [], volunteer: [], certifications: [], interests: [],
      })
      const blob = await buildCvDocx(empty, "de")
      expect(blob.size).toBeGreaterThan(1000)
    })

    it.each([1, 2, 9, 10])("produces DOCX for template %s layout", async (templateId) => {
      const blob = await buildCvDocx(GERMAN_EXAMPLE_CV, "de", undefined, undefined, templateId)
      expect(blob.size).toBeGreaterThan(5000)
    })

    it("accepts English locale without throwing", async () => {
      const blob = await buildCvDocx(GERMAN_EXAMPLE_CV, "en")
      expect(blob.size).toBeGreaterThan(5000)
    })
  })

  describe("drawInvisibleTextOverlay (WinAnsi guard)", () => {
    async function makePage() {
      const pdfDoc = await PDFDocument.create()
      const page = pdfDoc.addPage([595, 842])
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      return { pdfDoc, page, font }
    }

    const span = (text: string): TextSpan => ({ text, x: 10, y: 10, fontSize: 16, width: 200 })

    it("draws every span when all text is WinAnsi-encodable", async () => {
      const { page, font } = await makePage()
      const spans = [span("Hello World"), span("Münchner Straße"), span("Max Mustermann")]
      const drawn = drawInvisibleTextOverlay(page, font, spans, 0.5, rgb(0, 0, 0))
      expect(drawn).toBe(3)
    })

    it("skips spans with emoji without aborting the export", async () => {
      const { page, font } = await makePage()
      const spans = [span("Before"), span("Goal 🎯 achieved"), span("After")]
      const drawn = drawInvisibleTextOverlay(page, font, spans, 0.5, rgb(0, 0, 0))
      expect(drawn).toBe(2)
    })

    it("skips spans with arrows, checkmarks, and stars", async () => {
      const { page, font } = await makePage()
      const spans = [
        span("arrow →"),
        span("check ✓"),
        span("star ★"),
        span("plain text"),
      ]
      const drawn = drawInvisibleTextOverlay(page, font, spans, 0.5, rgb(0, 0, 0))
      expect(drawn).toBe(1)
    })

    it("skips spans with CJK characters", async () => {
      const { page, font } = await makePage()
      const spans = [span("Hello"), span("世界"), span("World")]
      const drawn = drawInvisibleTextOverlay(page, font, spans, 0.5, rgb(0, 0, 0))
      expect(drawn).toBe(2)
    })

    it("skips spans whose computed point size rounds below 1pt", async () => {
      const { page, font } = await makePage()
      const tiny: TextSpan = { text: "t", x: 0, y: 0, fontSize: 1, width: 10 }
      const drawn = drawInvisibleTextOverlay(page, font, [tiny], 0.1, rgb(0, 0, 0))
      expect(drawn).toBe(0)
    })

    it("completes for a mix of valid and invalid spans (regression)", async () => {
      const { pdfDoc, page, font } = await makePage()
      const spans: TextSpan[] = [
        span("Lebenslauf"),
        span("🎯 Ziele"),
        span("Fähigkeiten ✓"),
        span("Kontakt →"),
        span("Max Mustermann"),
      ]
      const drawn = drawInvisibleTextOverlay(page, font, spans, 0.5, rgb(0, 0, 0))
      expect(drawn).toBe(2)
      const bytes = await pdfDoc.save()
      expect(bytes.byteLength).toBeGreaterThan(100)
    })
  })
})
