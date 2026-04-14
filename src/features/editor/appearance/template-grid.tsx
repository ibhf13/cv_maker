import { useCvStore } from "@/stores/cv-store"
import { getTemplateMeta } from "@/features/templates/template-meta"
import { cn } from "@/lib/utils"
import { AlertTriangle } from "lucide-react"

const LINE = "h-[3px] rounded-full bg-zinc-300"
const LINE_SHORT = "h-[3px] w-3/4 rounded-full bg-zinc-300"

function Thumb({ id, accent }: { id: number; accent: string }) {
  const base = "flex h-[72px] w-[52px] overflow-hidden rounded border border-zinc-200 bg-white"

  switch (id) {
    case 1: return (
      <div className={base}>
        <div className="w-[35%] p-1" style={{ backgroundColor: accent }}>
          <div className="mb-1 h-2 w-full rounded-sm bg-white/40" />
          <div className="space-y-[2px]">
            <div className="h-[2px] w-full rounded-full bg-white/30" />
            <div className="h-[2px] w-3/4 rounded-full bg-white/30" />
          </div>
        </div>
        <div className="flex-1 space-y-1 p-1.5"><div className={LINE} /><div className={LINE_SHORT} /><div className={LINE} /><div className={LINE_SHORT} /></div>
      </div>
    )
    case 2: return (
      <div className={cn(base, "flex-col items-center p-1.5")}>
        <div className="mb-1 size-3 rounded-sm" style={{ backgroundColor: accent + "40" }} />
        <div className="mb-1 h-[3px] w-3/4 rounded-full" style={{ backgroundColor: accent }} />
        <div className="w-full space-y-[3px]"><div className={LINE} /><div className={LINE_SHORT} /><div className={LINE} /></div>
      </div>
    )
    case 3: return (
      <div className={cn(base, "flex-col")}>
        <div className="flex items-center gap-1 px-1.5 py-1" style={{ backgroundColor: accent }}>
          <div className="size-2.5 rounded-sm bg-white/40" />
          <div className="h-[3px] flex-1 rounded-full bg-white/50" />
        </div>
        <div className="flex-1 space-y-1 p-1.5"><div className={LINE} /><div className={LINE_SHORT} /><div className={LINE} /></div>
      </div>
    )
    case 4: return (
      <div className={cn(base, "flex-col")} style={{ borderLeft: `3px solid ${accent}` }}>
        <div className="flex gap-1 p-1.5">
          <div className="size-3 shrink-0 rounded-sm bg-zinc-200" />
          <div className="space-y-[2px] pt-0.5"><div className="h-[2px] w-6 rounded-full" style={{ backgroundColor: accent }} /><div className="h-[2px] w-4 rounded-full bg-zinc-300" /></div>
        </div>
        <div className="space-y-1 px-1.5"><div className={LINE} /><div className={LINE_SHORT} /><div className={LINE} /></div>
      </div>
    )
    case 5: return (
      <div className={cn(base, "flex-col")}>
        <div className="flex items-center justify-between bg-zinc-800 px-1.5 py-1">
          <div className="h-[3px] w-5 rounded-full bg-zinc-400" />
          <div className="size-2.5 rounded-sm bg-zinc-600" />
        </div>
        <div className="flex-1 space-y-1 bg-zinc-50 p-1.5"><div className={LINE} /><div className={LINE_SHORT} /><div className={LINE} /></div>
      </div>
    )
    case 6: return (
      <div className={cn(base, "flex-col p-1.5")}>
        <div className="mb-1 flex items-end justify-between">
          <div className="h-[5px] w-8 rounded-full" style={{ backgroundColor: accent }} />
          <div className="size-4 rounded-sm bg-zinc-200" />
        </div>
        <div className="mb-1 border-b" style={{ borderColor: accent }} />
        <div className="space-y-[3px]"><div className={LINE} /><div className={LINE_SHORT} /><div className={LINE} /></div>
      </div>
    )
    case 7: return (
      <div className={cn(base, "flex-col p-1.5")}>
        <div className="mb-1 flex items-center gap-1">
          <div className="size-2.5 rounded-sm bg-zinc-200" />
          <div className="h-[3px] flex-1 rounded-full" style={{ backgroundColor: accent }} />
        </div>
        <div className="mb-1 flex flex-wrap gap-[2px]">
          {[1,2,3,4,5].map((k) => <div key={k} className="h-[4px] w-2.5 rounded-full" style={{ backgroundColor: accent + "80" }} />)}
        </div>
        <div className="space-y-[3px]"><div className={LINE} /><div className={LINE_SHORT} /></div>
      </div>
    )
    case 8: return (
      <div className={cn(base, "flex-col p-1.5")}>
        <div className="mb-1 flex gap-1">
          <div className="size-3 rounded-sm bg-zinc-200" />
          <div className="pt-0.5"><div className="h-[3px] w-6 rounded-full bg-zinc-400" /></div>
        </div>
        <div className="border-b border-zinc-200" />
        <div className="mt-1 space-y-[3px]"><div className={LINE} /><div className={LINE_SHORT} /><div className={LINE} /></div>
      </div>
    )
    case 9: return (
      <div className={base}>
        <div className="flex-1 space-y-1 p-1.5"><div className="h-[3px] w-full rounded-full" style={{ backgroundColor: accent }} /><div className={LINE_SHORT} /><div className={LINE} /><div className={LINE_SHORT} /></div>
        <div className="w-[22%] bg-zinc-100" />
      </div>
    )
    case 10: return (
      <div className={cn(base, "flex-col p-1.5")}>
        <div className="mb-1 flex gap-1">
          <div className="size-3 rounded-sm bg-zinc-200" />
          <div className="pt-0.5"><div className="h-[3px] w-5 rounded-full" style={{ backgroundColor: accent }} /></div>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 space-y-[3px]"><div className={LINE} /><div className={LINE_SHORT} /></div>
          <div className="flex-1 space-y-[3px]"><div className={LINE} /><div className={LINE_SHORT} /></div>
        </div>
      </div>
    )
    default: return <div className={base} />
  }
}

export function TemplateGrid() {
  const setUi = useCvStore((s) => s.setUi)
  const templateId = useCvStore((s) => s.ui.templateId)
  const accent = useCvStore((s) => s.ui.theme.accent)

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((id) => {
        const meta = getTemplateMeta(id)
        const active = id === templateId
        return (
          <button
            key={id}
            type="button"
            className={cn(
              "group flex flex-col items-center gap-1 rounded-lg p-1.5 transition-all",
              active
                ? "bg-primary/10 ring-2 ring-primary shadow-sm"
                : "hover:bg-muted/60 hover:shadow-sm",
            )}
            onClick={() => setUi((u) => ({ ...u, templateId: id }))}
            title={`${meta.label} — ${meta.atsReason}`}
          >
            <div className="transition-transform duration-150 group-hover:scale-105">
              <Thumb id={id} accent={accent} />
            </div>
            <span className="flex items-center gap-1 text-xs leading-tight">
              {meta.label}
              {meta.atsSafe ? (
                <span className="rounded bg-primary px-1 py-px text-xs font-medium text-primary-foreground">
                  ATS
                </span>
              ) : (
                <AlertTriangle className="size-2.5 text-amber-500" />
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
