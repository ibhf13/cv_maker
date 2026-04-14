import { useCvStore } from "@/stores/cv-store"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const IDEAL_MIN = 150
const IDEAL_MAX = 400

export function SummaryTab() {
  const summary = useCvStore((s) => s.cvData.summary)
  const setCvData = useCvStore((s) => s.setCvData)
  const len = summary.length

  const hint =
    len === 0
      ? "2–4 sentences recommended (150–400 characters)"
      : len < IDEAL_MIN
        ? `${len} / ${IDEAL_MIN}+ chars — add more detail`
        : len > IDEAL_MAX
          ? `${len} chars — consider trimming (ideal: ${IDEAL_MIN}–${IDEAL_MAX})`
          : `${len} chars — good length`

  const color =
    len === 0
      ? "text-muted-foreground"
      : len >= IDEAL_MIN && len <= IDEAL_MAX
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-amber-600 dark:text-amber-400"

  return (
    <div>
      <Label>Summary</Label>
      <Textarea
        className="min-h-[160px]"
        value={summary}
        onChange={(e) => setCvData((d) => ({ ...d, summary: e.target.value }))}
      />
      <p className={`mt-1 text-xs ${color}`}>{hint}</p>
    </div>
  )
}
