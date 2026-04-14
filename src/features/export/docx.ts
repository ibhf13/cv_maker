import { Document, Packer, Paragraph, Table, PageOrientation } from "docx"
import type { CvData } from "@/lib/cv-schema"
import type { CvLocale, ThemeTokens, PhotoState, SectionConfig, ContactFieldKey } from "@/types/ui"
import { DEFAULT_SECTION_ORDER, DEFAULT_CONTACT_ORDER } from "@/types/ui"
import {
  buildHeaderWithPhoto,
  signatureBlock,
} from "./docx-helpers"
import { getTemplateStyle } from "./docx-style"
import { sectionBuilders, orderedSections } from "./docx-sections"
import {
  buildSidebarLayout,
  buildPhotoRightLayout,
  buildTwoColBodyLayout,
} from "./docx-layouts"
import { processPhotos, type ProcessedPhotos } from "./docx-photo"

const SIDEBAR_TEMPLATES = new Set([1])
const PHOTO_RIGHT_TEMPLATES = new Set([9])
const TWO_COL_TEMPLATES = new Set([10])

function buildSingleColChildren(
  cvData: CvData, locale: CvLocale, theme: ThemeTokens, photos: ProcessedPhotos,
  cfg: SectionConfig, templateId: number, contactOrder: ContactFieldKey[],
): (Paragraph | Table)[] {
  const variant = getTemplateStyle(templateId).sectionVariant
  const builders = sectionBuilders(cvData, locale, theme, variant)
  const children: (Paragraph | Table)[] = []

  const header = buildHeaderWithPhoto(cvData.personal_info, photos.square, theme, templateId, contactOrder)
  if (header instanceof Table) children.push(header)
  else children.push(...header)

  children.push(...orderedSections(builders, cfg.order, cfg.hidden))
  children.push(...signatureBlock(cvData, theme))
  return children
}

export async function buildCvDocx(
  cvData: CvData,
  locale: CvLocale = "de",
  theme: ThemeTokens = { accent: "#1e3a5f", fontHeading: "lato", fontBody: "lato", bodyPt: 11, lineHeight: 1.15, headingPt: 13, headingLineHeight: 1.2 },
  photo: PhotoState = { dataUrl: null, offsetX: 0, offsetY: 0, scale: 1, borderRadius: 8 },
  templateId = 2,
  sectionConfig?: SectionConfig,
  contactOrder: ContactFieldKey[] = DEFAULT_CONTACT_ORDER,
): Promise<Blob> {
  const cfg = sectionConfig ?? { order: [...DEFAULT_SECTION_ORDER], hidden: [], sidebar: ["skills"] }
  const photos = await processPhotos(photo)
  let children: (Paragraph | Table)[]

  if (SIDEBAR_TEMPLATES.has(templateId)) {
    children = buildSidebarLayout(cvData, locale, theme, photos, cfg, contactOrder)
  } else if (PHOTO_RIGHT_TEMPLATES.has(templateId)) {
    children = buildPhotoRightLayout(cvData, locale, theme, photos, cfg, contactOrder)
  } else if (TWO_COL_TEMPLATES.has(templateId)) {
    children = buildTwoColBodyLayout(cvData, locale, theme, photos, cfg, contactOrder)
  } else {
    children = buildSingleColChildren(cvData, locale, theme, photos, cfg, templateId, contactOrder)
  }

  // A4: 210mm × 297mm = 11906 × 16838 twips (1mm = 56.6929 twips)
  // Sidebar templates bleed to the page edge; others use 0.6" margins.
  const edgeToEdge = SIDEBAR_TEMPLATES.has(templateId)
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838, orientation: PageOrientation.PORTRAIT },
          margin: edgeToEdge
            ? { top: 720, right: 0, bottom: 720, left: 0 }
            : { top: 864, right: 864, bottom: 864, left: 864 },
        },
      },
      children,
    }],
  })
  return Packer.toBlob(doc)
}
