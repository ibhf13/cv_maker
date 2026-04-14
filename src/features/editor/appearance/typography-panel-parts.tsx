import type { ReactNode } from "react"
import { useId } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { FontKey } from "@/types/ui"
import { fontFamilyFor } from "@/lib/theme-fonts"
import { FontSelectContent } from "./font-select-content"
import type { FontPreset } from "./appearance-constants"

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </div>
  )
}

type SectionHeaderProps = {
  title: string
  linked: boolean
  linkLabel: string
  linkHint: string
  trailing?: string
  onToggle: () => void
}

export function SectionHeader({
  title, linked, linkLabel, linkHint, trailing, onToggle,
}: SectionHeaderProps) {
  const id = useId()
  return (
    <div className="mb-2 flex items-center gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
      <div className="flex items-center gap-1.5" title={linkHint}>
        <Checkbox
          id={id}
          checked={linked}
          onCheckedChange={() => onToggle()}
          className="size-3.5"
        />
        <Label htmlFor={id} className="cursor-pointer text-[11px] font-normal text-muted-foreground">{linkLabel}</Label>
      </div>
      {trailing && <span className="ml-auto text-xs tabular-nums text-muted-foreground">{trailing}</span>}
    </div>
  )
}

export function PairedRow({ linked, children }: { linked: boolean; children: ReactNode }) {
  return <div className={cn("grid gap-2", !linked && "grid-cols-2")}>{children}</div>
}

export function FontPicker({ sublabel, value, onChange }: {
  sublabel?: string; value: FontKey; onChange: (v: FontKey) => void
}) {
  return (
    <div>
      {sublabel && <div className="mb-1 text-[11px] text-muted-foreground">{sublabel}</div>}
      <Select value={value} onValueChange={(v) => onChange(v as FontKey)}>
        <SelectTrigger className="h-8 text-xs" style={{ fontFamily: fontFamilyFor(value) }}>
          <SelectValue />
        </SelectTrigger>
        <FontSelectContent />
      </Select>
    </div>
  )
}

export function SubSlider({ label, value, unit = "", min, max, step, digits = 0, onChange }: {
  label: string; value: number; unit?: string; min: number; max: number;
  step: number; digits?: number; onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-xs tabular-nums text-muted-foreground">
          {value.toFixed(digits)}{unit && ` ${unit}`}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
    </div>
  )
}

export function PresetItem({ preset }: { preset: FontPreset }) {
  return (
    <SelectItem value={preset.label}>
      <span className="flex w-full items-center gap-2">
        <span className="inline-flex items-baseline gap-1 leading-none">
          <span className="text-sm" style={{ fontFamily: fontFamilyFor(preset.heading) }}>Aa</span>
          <span className="text-xs text-muted-foreground" style={{ fontFamily: fontFamilyFor(preset.body) }}>aa</span>
        </span>
        <span className="text-xs">{preset.label}</span>
        {preset.recommended && (
          <span className="rounded bg-primary px-1 py-px text-xs font-medium text-primary-foreground">Recommended</span>
        )}
      </span>
    </SelectItem>
  )
}
