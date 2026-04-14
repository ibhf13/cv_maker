import { useState } from "react"
import { useCvStore } from "@/stores/cv-store"
import { useCvArrayField } from "@/hooks/use-cv-field"
import { useCvPeriodUpdate } from "@/hooks/use-cv-period"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FormField } from "../components/form-field"
import { ArrowDown, ArrowUp, ChevronDown, GraduationCap, Plus, Trash2 } from "lucide-react"
import { MonthYearInput } from "../components/month-year-input"
import { createId } from "@/lib/id"
import { cn } from "@/lib/utils"
import { EmptySection } from "../components/empty-section"

export function EducationTab() {
  const education = useCvStore((s) => s.cvData.education)
  const { updateItem, swapItem, addItem, removeItemByIndex } = useCvArrayField("education")
  const { updatePeriod } = useCvPeriodUpdate("education")
  const [openSet, setOpenSet] = useState<Set<string>>(() => {
    const first = education[0]?.id
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
      {education.length === 0 && (
        <EmptySection
          icon={<GraduationCap className="size-8" />}
          title="No education yet"
          description="Add your degrees, vocational training, or certifications."
        />
      )}
      {education.map((edu, i) => {
        const isOpen = openSet.has(edu.id)
        const summary = [edu.degree, edu.institution, edu.period.start].filter(Boolean).join(" · ") || "New entry"
        return (
          <div key={edu.id} className="rounded-lg border">
            <button type="button" className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-muted/30"
              onClick={() => toggle(edu.id)}>
              <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
              <span className="flex-1 truncate font-medium">{summary}</span>
              <Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0" disabled={i === 0}
                onClick={(e) => { e.stopPropagation(); swapItem(i, -1) }}
                title="Move up"><ArrowUp className="size-3.5" /></Button>
              <Button type="button" variant="ghost" size="icon-sm" className="size-6 shrink-0" disabled={i === education.length - 1}
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
                  <FormField label="Degree" id={`edu-${edu.id}-degree`}>
                    <Input id={`edu-${edu.id}-degree`} value={edu.degree} onChange={(e) => updateItem(i, { degree: e.target.value })} />
                  </FormField>
                  <FormField label="Institution" id={`edu-${edu.id}-inst`}>
                    <Input id={`edu-${edu.id}-inst`} value={edu.institution} onChange={(e) => updateItem(i, { institution: e.target.value })} />
                  </FormField>
                  <FormField label="Location" id={`edu-${edu.id}-loc`}>
                    <Input id={`edu-${edu.id}-loc`} value={edu.location} onChange={(e) => updateItem(i, { location: e.target.value })} />
                  </FormField>
                  <FormField label="Thesis" id={`edu-${edu.id}-thesis`}>
                    <Input id={`edu-${edu.id}-thesis`} value={edu.thesis} onChange={(e) => updateItem(i, { thesis: e.target.value })} />
                  </FormField>
                  <FormField label="Grade (Note)" id={`edu-${edu.id}-grade`}>
                    <Input id={`edu-${edu.id}-grade`} value={edu.grade} placeholder="z.B. 1.3" onChange={(e) => updateItem(i, { grade: e.target.value })} />
                  </FormField>
                  <FormField label="Start (MM.YYYY)" id={`edu-${edu.id}-start`}>
                    <MonthYearInput value={edu.period.start} onChange={(v) => updatePeriod(i, { start: v })} />
                  </FormField>
                  <FormField label="End (MM.YYYY)" id={`edu-${edu.id}-end`}>
                    <MonthYearInput value={edu.period.end} onChange={(v) => updatePeriod(i, { end: v })} />
                  </FormField>
                </div>
              </div>
            )}
          </div>
        )
      })}
      <Button type="button" variant="outline" className="w-full"
        onClick={() => {
          const newId = createId()
          addItem({ id: newId, degree: "", institution: "", location: "", period: { start: "", end: "" }, thesis: "", grade: "" })
          setOpenSet((prev) => new Set([...prev, newId]))
        }}>
        <Plus className="size-4" /> Add education
      </Button>
    </div>
  )
}
