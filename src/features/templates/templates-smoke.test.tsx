import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { TemplateById } from "./template-by-id"
import { GERMAN_EXAMPLE_CV } from "@/lib/example-cv"
import { DEFAULT_THEME, DEFAULT_PHOTO } from "@/lib/theme-constants"
import { DEFAULT_SECTION_ORDER, DEFAULT_CONTACT_ORDER } from "@/types/ui"
import { createEmptyCvData } from "@/lib/cv-defaults"

const TEMPLATE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

const baseProps = {
  cvData: GERMAN_EXAMPLE_CV,
  theme: DEFAULT_THEME,
  photo: DEFAULT_PHOTO,
  locale: "de" as const,
  sectionConfig: {
    order: [...DEFAULT_SECTION_ORDER],
    hidden: [],
    sidebar: ["skills" as const, "certifications" as const, "volunteer" as const, "languages" as const, "interests" as const],
  },
  contactOrder: [...DEFAULT_CONTACT_ORDER],
}

describe("templates — smoke render", () => {
  for (const id of TEMPLATE_IDS) {
    it(`Template ${id} renders with the example CV without throwing`, () => {
      const html = renderToStaticMarkup(<TemplateById id={id} {...baseProps} />)
      expect(html.length).toBeGreaterThan(500)
      expect(html).toContain(GERMAN_EXAMPLE_CV.personal_info.name)
    })
  }

  it("renders every template with an empty CV without throwing", () => {
    const empty = createEmptyCvData()
    for (const id of TEMPLATE_IDS) {
      const html = renderToStaticMarkup(<TemplateById id={id} {...baseProps} cvData={empty} />)
      expect(html.length).toBeGreaterThan(100)
    }
  })

  it("falls back to Template01 for an unknown id", () => {
    const html = renderToStaticMarkup(<TemplateById id={999} {...baseProps} />)
    expect(html).toContain(GERMAN_EXAMPLE_CV.personal_info.name)
  })

  it("renders templates with an English locale", () => {
    const html = renderToStaticMarkup(<TemplateById id={1} {...baseProps} locale="en" />)
    expect(html).toContain(GERMAN_EXAMPLE_CV.personal_info.name)
  })

  it("renders templates with every section hidden", () => {
    const allHidden = { ...baseProps.sectionConfig, hidden: [...DEFAULT_SECTION_ORDER] }
    const html = renderToStaticMarkup(<TemplateById id={1} {...baseProps} sectionConfig={allHidden} />)
    expect(html).toContain(GERMAN_EXAMPLE_CV.personal_info.name)
  })
})
