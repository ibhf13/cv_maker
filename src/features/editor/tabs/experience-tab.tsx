import { useState } from "react"
import { useCvStore } from "@/stores/cv-store"
import { useCvArrayField } from "@/hooks/use-cv-field"
import { useCvPeriodUpdate } from "@/hooks/use-cv-period"
import { useCvBullets } from "@/hooks/use-cv-bullets"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { FormField } from "../components/form-field"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowDown, ArrowUp, Briefcase, ChevronDown, Plus, Trash2 } from "lucide-react"
import { MonthYearInput } from "../components/month-year-input"
import { createId } from "@/lib/id"
import { cn } from "@/lib/utils"
import { EmptySection } from "../components/empty-section"

export function ExperienceTab() {
  const experience = useCvStore((s) => s.cvData.experience)
  const { updateItem, swapItem, addItem, removeItemByIndex } = useCvArrayField("experience")
  const { updatePeriod } = useCvPeriodUpdate("experience")
  const { updateBullet, addBullet, removeBullet, moveBullet } = useCvBullets()
  const [openSet, setOpenSet] = useState<Set<string>>(() => {
    const first = experience[0]?.id
    return first ? new Set([first]) : new Set()
  })

  function toggle(id: string) {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {experience.length === 0 && (
        <EmptySection
          icon={<Briefcase className="size-8" />}
          title="No experience yet"
          description="Add your work history — start with your most recent role."
        />
      )}
      {experience.map((ex, i) => {
        const isOpen = openSet.has(ex.id)
        const bulletCount = ex.description.filter((l) => l.trim()).length
        const summary = [ex.title, ex.company, ex.period.start].filter(Boolean).join(" · ") || "New entry"
        return (
          <div key={ex.id} className="rounded-lg border">
            <button type="button" className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted/30"
              onClick={() => toggle(ex.id)}>
              <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
              <span className="flex-1 truncate font-medium">{summary}</span>
              <Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0" disabled={i === 0}
                onClick={(e) => { e.stopPropagation(); swapItem(i, -1) }}
                title="Move up"><ArrowUp className="size-3.5" /></Button>
              <Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0" disabled={i === experience.length - 1}
                onClick={(e) => { e.stopPropagation(); swapItem(i, 1) }}
                title="Move down"><ArrowDown className="size-3.5" /></Button>
              <Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0"
                onClick={(e) => { e.stopPropagation(); removeItemByIndex(i) }}>
                <Trash2 className="size-3.5" />
              </Button>
            </button>
            {isOpen && (
              <div className="border-t px-3 pb-3 pt-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField label="Title" id={`exp-${ex.id}-title`}>
                    <Input id={`exp-${ex.id}-title`} value={ex.title} onChange={(e) => updateItem(i, { title: e.target.value })} />
                  </FormField>
                  <FormField label="Company" id={`exp-${ex.id}-company`}>
                    <Input id={`exp-${ex.id}-company`} value={ex.company} onChange={(e) => updateItem(i, { company: e.target.value })} />
                  </FormField>
                  <FormField label="Location" id={`exp-${ex.id}-location`}>
                    <Input id={`exp-${ex.id}-location`} value={ex.location} onChange={(e) => updateItem(i, { location: e.target.value })} />
                  </FormField>
                  <FormField label="Start (MM.YYYY)" id={`exp-${ex.id}-start`}>
                    <MonthYearInput value={ex.period.start} onChange={(v) => updatePeriod(i, { start: v })} />
                  </FormField>
                  {!ex.period.current && (
                    <FormField label="End (MM.YYYY)" id={`exp-${ex.id}-end`}>
                      <MonthYearInput value={ex.period.end ?? ""} onChange={(v) => updatePeriod(i, { end: v || null })} />
                    </FormField>
                  )}
                  <div className="flex items-center gap-2 pt-6">
                    <Checkbox id={`exp-${ex.id}-current`} checked={ex.period.current}
                      onCheckedChange={(c) => updatePeriod(i, { current: !!c, end: c ? null : ex.period.end })} />
                    <Label htmlFor={`exp-${ex.id}-current`} className="text-sm">Current role</Label>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline justify-between">
                    <Label>Bullets</Label>
                    <span className={`text-xs ${bulletCount >= 3 && bulletCount <= 5 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                      {bulletCount} / 3–5 recommended
                    </span>
                  </div>
                  <div className="mt-1 space-y-1.5">
                    {ex.description.map((bullet, bi) => (
                      <div key={bi} className="flex items-center gap-1">
                        <span className="w-4 shrink-0 text-center text-xs text-muted-foreground">{bi + 1}</span>
                        <Input className="flex-1 text-sm" value={bullet} placeholder="Achievement or responsibility…"
                          onChange={(e) => updateBullet(i, bi, e.target.value)} />
                        <Button type="button" variant="ghost" size="icon-sm" className="size-7 shrink-0"
                          disabled={bi === 0} onClick={() => moveBullet(i, bi, -1)} title="Move up"><ArrowUp className="size-3.5" /></Button>
                        <Button type="button" variant="ghost" size="icon-sm" className="size-7 shrink-0"
                          disabled={bi === ex.description.length - 1} onClick={() => moveBullet(i, bi, 1)} title="Move down"><ArrowDown className="size-3.5" /></Button>
                        <Button type="button" variant="ghost" size="icon-sm" className="size-7 shrink-0 text-destructive hover:text-destructive"
                          onClick={() => removeBullet(i, bi)} title="Remove bullet"><Trash2 className="size-3.5" /></Button>
                      </div>
                    ))}
                    <Button type="button" variant="ghost" size="sm" className="mt-1 w-full text-xs" onClick={() => addBullet(i)}>
                      <Plus className="size-3.5" /> Add bullet
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
      <Button type="button" variant="outline" className="w-full"
        onClick={() => {
          const newId = createId()
          addItem({ id: newId, title: "", company: "", location: "", period: { start: "", end: null, current: false }, description: [""] })
          setOpenSet((prev) => new Set([...prev, newId]))
        }}>
        <Plus className="size-4" /> Add experience
      </Button>
    </div>
  )
}
