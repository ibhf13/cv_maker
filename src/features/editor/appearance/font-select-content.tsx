import { SelectContent, SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select"
import type { FontKey } from "@/types/ui"
import { fontFamilyFor } from "@/lib/theme-fonts"

const ATS_FONTS = new Set<FontKey>(["lato", "roboto", "open-sans", "source-sans", "arimo", "libre-baskerville", "ibm-plex"])

const TOP_PICKS: { value: FontKey; label: string }[] = [
  { value: "lato", label: "Lato" },
  { value: "arimo", label: "Arimo" },
  { value: "libre-baskerville", label: "Libre Baskerville" },
]

const MORE_FONTS: { value: FontKey; label: string }[] = [
  { value: "roboto", label: "Roboto" },
  { value: "open-sans", label: "Open Sans" },
  { value: "source-sans", label: "Source Sans 3" },
  { value: "dm-sans", label: "DM Sans" },
  { value: "ibm-plex", label: "IBM Plex Sans" },
  { value: "montserrat", label: "Montserrat" },
]


function AtsBadge() {
  return <span className="rounded bg-primary px-1 py-px text-xs font-medium text-primary-foreground">ATS</span>
}

export function FontSelectContent() {
  return (
    <SelectContent>
      <SelectGroup>
        <SelectLabel className="text-xs text-muted-foreground">Top picks</SelectLabel>
        {TOP_PICKS.map((f) => (
          <SelectItem key={f.value} value={f.value}>
            <span className="flex items-center gap-1.5" style={{ fontFamily: fontFamilyFor(f.value) }}>
              {f.label}{ATS_FONTS.has(f.value) && <AtsBadge />}
            </span>
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectGroup>
        <SelectLabel className="text-xs text-muted-foreground">More</SelectLabel>
        {MORE_FONTS.map((f) => (
          <SelectItem key={f.value} value={f.value}>
            <span className="flex items-center gap-1.5" style={{ fontFamily: fontFamilyFor(f.value) }}>
              {f.label}{ATS_FONTS.has(f.value) && <AtsBadge />}
            </span>
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  )
}
