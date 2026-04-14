import { useCvStore } from "@/stores/cv-store"
import { computeScore, getScoreTier } from "@/lib/completeness-score"
import type { ScoreTier } from "@/lib/completeness-score"
import { CircleCheck, CircleAlert, TriangleAlert } from "lucide-react"
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip"

type TierStyle = { icon: React.ReactNode; stroke: string }

const TIER_STYLES: Record<ScoreTier, TierStyle> = {
  strong: {
    icon: <CircleCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.25} />,
    stroke: "stroke-emerald-600 dark:stroke-emerald-400",
  },
  moderate: {
    icon: <CircleAlert className="size-3.5 text-amber-600 dark:text-amber-400" strokeWidth={2.25} />,
    stroke: "stroke-amber-600 dark:stroke-amber-400",
  },
  weak: {
    icon: <TriangleAlert className="size-3.5 text-red-600 dark:text-red-400" strokeWidth={2.25} />,
    stroke: "stroke-red-600 dark:stroke-red-400",
  },
}

function BadgeContent({ score, style }: { score: number; style: TierStyle }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
      {style.icon}
      {score}%
    </span>
  )
}

export function CompletenessBadge() {
  const cvData = useCvStore((s) => s.cvData)
  const templateId = useCvStore((s) => s.ui.templateId)
  const { score, tips } = computeScore(cvData, templateId)
  const tierStyle = TIER_STYLES[getScoreTier(score)]

  if (tips.length === 0) {
    return <BadgeContent score={score} style={tierStyle} />
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button">
          <BadgeContent score={score} style={tierStyle} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="w-64 p-0 text-xs">
        <div className="flex items-center gap-3 border-b border-border/50 px-3 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">CV Completeness</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{score}% complete</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center">
            <svg viewBox="0 0 36 36" className="size-8">
              <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" className="stroke-border/40" />
              <circle
                cx="18" cy="18" r="15.5" fill="none" strokeWidth="3"
                strokeLinecap="round"
                className={tierStyle.stroke}
                strokeDasharray={`${score * 0.9738} 97.38`}
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
        </div>
        <ul className="space-y-0.5 px-3 py-2.5">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2 py-0.5 text-muted-foreground">
              <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-muted-foreground/40" />
              {tip}
            </li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  )
}
