import type { PhotoState, ThemeTokens } from "@/types/ui"

export const DEFAULT_THEME: ThemeTokens = {
  accent: "#1e3a5f",
  fontHeading: "lato",
  fontBody: "source-sans",
  bodyPt: 11,
  lineHeight: 1.15,
  headingPt: 13,
  headingLineHeight: 1.2,
}

export const DEFAULT_PHOTO: PhotoState = {
  dataUrl: null,
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  borderRadius: 8,
}
