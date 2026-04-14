import { Slider } from "@/components/ui/slider"
import {
  Select, SelectContent, SelectGroup, SelectLabel,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import type { ThemeTokens } from "@/types/ui"
import { useCvStore } from "@/stores/cv-store"
import { FONT_PRESETS } from "./appearance-constants"
import {
  SectionLabel, SectionHeader, PairedRow, FontPicker, SubSlider, PresetItem,
} from "./typography-panel-parts"

type LinkKey = "linkFont" | "linkSize" | "linkLineHeight"

export function TypographyPanel() {
  const setUi = useCvStore((s) => s.setUi)
  const ui = useCvStore((s) => s.ui)
  const { linkFont, linkSize, linkLineHeight } = ui

  const activePreset = FONT_PRESETS.find(
    (p) =>
      p.heading === ui.theme.fontHeading
      && p.body === ui.theme.fontBody
      && p.bodyPt === ui.theme.bodyPt
      && p.headingPt === ui.theme.headingPt
      && p.lineHeight === ui.theme.lineHeight
      && p.headingLineHeight === ui.theme.headingLineHeight,
  )
  const recommended = FONT_PRESETS.filter((p) => p.recommended)
  const others = FONT_PRESETS.filter((p) => !p.recommended)

  /** Toggle a link flag; when enabling, reconcile the two fields via `onEnable`. */
  const toggleLink = (key: LinkKey, onEnable: (t: ThemeTokens) => ThemeTokens) => {
    setUi((u) => ({
      ...u,
      [key]: !u[key],
      theme: !u[key] ? onEnable(u.theme) : u.theme,
    }))
  }

  return (
    <div className="space-y-4">
      <section>
        <SectionLabel>Preset</SectionLabel>
        <Select
          value={activePreset?.label ?? ""}
          onValueChange={(v) => {
            const p = FONT_PRESETS.find((x) => x.label === v)
            if (!p) return
            setUi((u) => ({
              ...u,
              linkFont: p.heading === p.body,
              linkSize: p.bodyPt === p.headingPt,
              linkLineHeight: p.lineHeight === p.headingLineHeight,
              theme: {
                ...u.theme,
                fontHeading: p.heading,
                fontBody: p.body,
                bodyPt: p.bodyPt,
                headingPt: p.headingPt,
                lineHeight: p.lineHeight,
                headingLineHeight: p.headingLineHeight,
              },
            }))
          }}
        >
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Choose a preset…" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Empfohlen für deutsche Lebensläufe
              </SelectLabel>
              {recommended.map((p) => <PresetItem key={p.label} preset={p} />)}
            </SelectGroup>
            {others.length > 0 && (
              <SelectGroup>
                <SelectLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">More</SelectLabel>
                {others.map((p) => <PresetItem key={p.label} preset={p} />)}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      </section>

      <section>
        <SectionHeader
          title="Font family"
          linked={linkFont}
          linkLabel="Same font for heading & body"
          linkHint="Use one font family for both headings and body text"
          onToggle={() => toggleLink("linkFont", (t) => ({ ...t, fontBody: t.fontHeading }))}
        />
        <PairedRow linked={linkFont}>
          <FontPicker
            sublabel={linkFont ? undefined : "Heading"}
            value={ui.theme.fontHeading}
            onChange={(fk) => setUi((u) => ({
              ...u,
              theme: { ...u.theme, fontHeading: fk, ...(linkFont ? { fontBody: fk } : {}) },
            }))}
          />
          {!linkFont && (
            <FontPicker
              sublabel="Body"
              value={ui.theme.fontBody}
              onChange={(fk) => setUi((u) => ({ ...u, theme: { ...u.theme, fontBody: fk } }))}
            />
          )}
        </PairedRow>
      </section>

      <section>
        <SectionHeader
          title="Size"
          linked={linkSize}
          linkLabel="Same size for heading & body"
          linkHint="Use one font size for both headings and body text"
          trailing={linkSize ? `${ui.theme.bodyPt} pt` : undefined}
          onToggle={() => toggleLink("linkSize", (t) => ({ ...t, headingPt: t.bodyPt }))}
        />
        {linkSize ? (
          <Slider value={[ui.theme.bodyPt]} min={9} max={13} step={0.5}
            onValueChange={([v]) => setUi((u) => ({ ...u, theme: { ...u.theme, bodyPt: v, headingPt: v } }))} />
        ) : (
          <div className="space-y-2.5">
            <SubSlider label="Body" value={ui.theme.bodyPt} unit="pt" min={9} max={13} step={0.5}
              onChange={(v) => setUi((u) => ({ ...u, theme: { ...u.theme, bodyPt: v } }))} />
            <SubSlider label="Heading" value={ui.theme.headingPt} unit="pt" min={11} max={20} step={0.5}
              onChange={(v) => setUi((u) => ({ ...u, theme: { ...u.theme, headingPt: v } }))} />
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title="Line height"
          linked={linkLineHeight}
          linkLabel="Same line height for heading & body"
          linkHint="Use one line height for both headings and body text"
          trailing={linkLineHeight ? ui.theme.lineHeight.toFixed(2) : undefined}
          onToggle={() => toggleLink("linkLineHeight", (t) => ({ ...t, headingLineHeight: t.lineHeight }))}
        />
        {linkLineHeight ? (
          <Slider value={[ui.theme.lineHeight]} min={1.0} max={1.5} step={0.05}
            onValueChange={([v]) => setUi((u) => ({ ...u, theme: { ...u.theme, lineHeight: v, headingLineHeight: v } }))} />
        ) : (
          <div className="space-y-2.5">
            <SubSlider label="Body" value={ui.theme.lineHeight} min={1.0} max={1.5} step={0.05} digits={2}
              onChange={(v) => setUi((u) => ({ ...u, theme: { ...u.theme, lineHeight: v } }))} />
            <SubSlider label="Heading" value={ui.theme.headingLineHeight} min={1.0} max={1.5} step={0.05} digits={2}
              onChange={(v) => setUi((u) => ({ ...u, theme: { ...u.theme, headingLineHeight: v } }))} />
          </div>
        )}
      </section>
    </div>
  )
}
