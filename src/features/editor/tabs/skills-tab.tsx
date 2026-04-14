import { useCvStore } from "@/stores/cv-store"
import { useCvArrayField } from "@/hooks/use-cv-field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Layers, Plus, Trash2 } from "lucide-react"
import { createId } from "@/lib/id"
import { EmptySection } from "../components/empty-section"
import { TagInput } from "../components/tag-input"

export function SkillsTab() {
  const skills = useCvStore((s) => s.cvData.skills)
  const { updateItem, removeItemByIndex, addItem, swapItem } = useCvArrayField("skills")

  return (
    <div className="space-y-4">
      {skills.length === 0 && (
        <EmptySection
          icon={<Layers className="size-8" />}
          title="No skills yet"
          description="Group your skills by category: Technical, Methods, Soft Skills."
        />
      )}
      {skills.map((group, i) => (
        <div key={group.id} className="rounded-lg border p-3">
          <div className="mb-2 flex items-center gap-2">
            <Input
              className="flex-1 font-medium"
              placeholder="Category name"
              value={group.category}
              onChange={(e) => updateItem(i, { category: e.target.value })}
            />
            <Button type="button" variant="ghost" size="icon-sm" disabled={i === 0}
              onClick={() => swapItem(i, -1)}
              title="Move up"><ArrowUp className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon-sm" disabled={i === skills.length - 1}
              onClick={() => swapItem(i, 1)}
              title="Move down"><ArrowDown className="size-4" /></Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => removeItemByIndex(i)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <Label className="text-xs text-muted-foreground">Items</Label>
          <TagInput
            tags={group.items}
            onChange={(tags) => updateItem(i, { items: tags })}
            placeholder="Add a skill…"
          />
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full" onClick={() => addItem({ id: createId(), category: "", items: [] })}>
        <Plus className="size-4" />
        Add skill category
      </Button>
    </div>
  )
}
