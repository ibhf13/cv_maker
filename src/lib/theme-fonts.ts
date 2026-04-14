import type { FontKey } from "@/types/ui"

/** CSS font-family stacks for loaded Google fonts */
export const FONT_STACKS: Record<FontKey, string> = {
  lato: '"Lato", system-ui, sans-serif',
  roboto: '"Roboto", system-ui, sans-serif',
  "source-sans": '"Source Sans 3", system-ui, sans-serif',
  "dm-sans": '"DM Sans", system-ui, sans-serif',
  "libre-baskerville": '"Libre Baskerville", Georgia, serif',
  "ibm-plex": '"IBM Plex Sans", system-ui, sans-serif',
  "open-sans": '"Open Sans", system-ui, sans-serif',
  montserrat: '"Montserrat", system-ui, sans-serif',
  arimo: '"Arimo", Arial, sans-serif',
}

export function fontFamilyFor(key: FontKey): string {
  return FONT_STACKS[key] ?? FONT_STACKS["source-sans"]
}

/** Primary font name for DOCX run properties (no fallback stack). */
const DOCX_NAMES: Record<FontKey, string> = {
  lato: "Lato",
  roboto: "Roboto",
  "source-sans": "Source Sans 3",
  "dm-sans": "DM Sans",
  "libre-baskerville": "Libre Baskerville",
  "ibm-plex": "IBM Plex Sans",
  "open-sans": "Open Sans",
  montserrat: "Montserrat",
  arimo: "Arimo",
}

export function fontDocxName(key: FontKey): string {
  return DOCX_NAMES[key] ?? DOCX_NAMES["lato"]
}

/** System-safe font names for DOCX export — guaranteed to render on HR systems */
const DOCX_SYSTEM_NAMES: Record<FontKey, string> = {
  lato: "Calibri",
  roboto: "Arial",
  "source-sans": "Calibri",
  "dm-sans": "Calibri",
  "libre-baskerville": "Georgia",
  "ibm-plex": "Arial",
  "open-sans": "Calibri",
  montserrat: "Arial",
  arimo: "Arial",
}

export function fontDocxSystemName(key: FontKey): string {
  return DOCX_SYSTEM_NAMES[key] ?? "Calibri"
}
