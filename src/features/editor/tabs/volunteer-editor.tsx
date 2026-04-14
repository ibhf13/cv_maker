import { useCvStore } from "@/stores/cv-store"
import { useCvArrayField } from "@/hooks/use-cv-field"
import { useCvPeriodUpdate } from "@/hooks/use-cv-period"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FormField } from "../components/form-field"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowDown, ArrowUp, Heart, Plus, Trash2 } from "lucide-react"
import { EmptySection } from "../components/empty-section"
import { createId } from "@/lib/id"
import { MonthYearInput } from "../components/month-year-input"

export function VolunteerEditor() {
  const volunteer = useCvStore((s) => s.cvData.volunteer) ?? []
  const { updateItem, removeItemByIndex, addItem, swapItem } = useCvArrayField("volunteer")
  const { updatePeriod } = useCvPeriodUpdate("volunteer")

  return (
    <div className="space-y-3">
      {volunteer.length === 0 && (
        <EmptySection
          icon={<Heart className="size-8" />}
          title="No volunteer work yet"
          description="Add community service, mentoring, or nonprofit involvement."
        />
      )}
      {volunteer.map((v, i) => (
        <div key={v.id} className="rounded-lg border p-3">
          <div className="mb-2 flex justify-end gap-0.5">
            <Button type="button" variant="ghost" size="icon-sm" disabled={i === 0}
              onClick={() => swapItem(i, -1)}
              title="Move up"><ArrowUp className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon-sm" disabled={i === volunteer.length - 1}
              onClick={() => swapItem(i, 1)}
              title="Move down"><ArrowDown className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon-sm"
              onClick={() => removeItemByIndex(i)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Role" id={`vol-${v.id}-role`}>
              <Input id={`vol-${v.id}-role`} value={v.role} onChange={(e) => updateItem(i, { role: e.target.value })} />
            </FormField>
            <FormField label="Organization" id={`vol-${v.id}-org`}>
              <Input id={`vol-${v.id}-org`} value={v.organization} onChange={(e) => updateItem(i, { organization: e.target.value })} />
            </FormField>
            <FormField label="Start (MM.YYYY)" id={`vol-${v.id}-start`}>
              <MonthYearInput value={v.period.start} onChange={(val) => updatePeriod(i, { start: val })} />
            </FormField>
            <div className="flex items-center gap-2 pt-6">
              <Checkbox id={`vol-${v.id}-current`} checked={v.period.current}
                onCheckedChange={(c) => updatePeriod(i, { current: !!c, end: c ? null : v.period.end })} />
              <Label htmlFor={`vol-${v.id}-current`} className="text-sm">Ongoing</Label>
            </div>
            {!v.period.current && (
              <FormField label="End (MM.YYYY)" id={`vol-${v.id}-end`}>
                <MonthYearInput value={v.period.end ?? ""} onChange={(val) => updatePeriod(i, { end: val || null })} />
              </FormField>
            )}
          </div>
          <div className="mt-2">
            <FormField label="Description" id={`vol-${v.id}-desc`}>
              <Textarea id={`vol-${v.id}-desc`} value={v.description} rows={2}
                onChange={(e) => updateItem(i, { description: e.target.value })} />
            </FormField>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full"
        onClick={() => addItem({ id: createId(), role: "", organization: "", period: { start: "", end: null, current: false }, description: "" })}>
        <Plus className="size-4" /> Add volunteer work
      </Button>
    </div>
  )
}
