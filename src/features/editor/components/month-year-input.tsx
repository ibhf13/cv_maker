import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useCvStore } from "@/stores/cv-store"
import { editorLabel } from "@/lib/editor-labels"
import { parseMonthYear, formatMonthYear } from "./month-year-utils"

const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))

function currentYear() {
  return new Date().getFullYear()
}

const YEARS = Array.from({ length: 35 }, (_, i) => String(currentYear() + 5 - i))

type MonthYearInputProps = {
  value: string
  onChange: (formatted: string) => void
  disabled?: boolean
  /** Optional visible label reference (id) — if supplied, aria-labelledby takes precedence over the default aria-label. */
  labelledBy?: string
}

export function MonthYearInput({ value, onChange, disabled, labelledBy }: MonthYearInputProps) {
  const locale = useCvStore((s) => s.ui.locale)
  const { month, year } = parseMonthYear(value)

  function update(m: string, y: string) {
    onChange(formatMonthYear(m, y))
  }

  const groupProps = labelledBy
    ? { "aria-labelledby": labelledBy }
    : { "aria-label": editorLabel("monthYearGroupLabel", locale) }

  return (
    <div role="group" className="flex gap-1.5" {...groupProps}>
      <Select value={month} disabled={disabled} onValueChange={(v) => update(v, year)}>
        <SelectTrigger className="w-[5.5rem]" aria-label={editorLabel("monthSelectLabel", locale)}>
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={year} disabled={disabled} onValueChange={(v) => update(month, v)}>
        <SelectTrigger className="w-[6rem]" aria-label={editorLabel("yearSelectLabel", locale)}>
          <SelectValue placeholder="YYYY" />
        </SelectTrigger>
        <SelectContent>
          {YEARS.map((y) => (
            <SelectItem key={y} value={y}>{y}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
