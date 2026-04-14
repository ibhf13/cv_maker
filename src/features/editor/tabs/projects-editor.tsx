import { useCvStore } from "@/stores/cv-store"
import { useCvArrayField } from "@/hooks/use-cv-field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { FormField } from "../components/form-field"
import { ArrowDown, ArrowUp, FolderCode, Plus, Trash2 } from "lucide-react"
import { createId } from "@/lib/id"
import { TagInput } from "../components/tag-input"
import { EmptySection } from "../components/empty-section"

export function ProjectsEditor() {
  const projects = useCvStore((s) => s.cvData.projects)
  const { updateItem, removeItemByIndex, addItem, swapItem } = useCvArrayField("projects")

  return (
    <div className="space-y-3">
      {projects.length === 0 && (
        <EmptySection
          icon={<FolderCode className="size-8" />}
          title="No projects yet"
          description="Add side projects, open-source work, or portfolio pieces."
        />
      )}
      {projects.map((p, i) => (
        <div key={p.id} className="rounded-lg border p-3">
          <div className="mb-2 flex justify-end gap-0.5">
            <Button type="button" variant="ghost" size="icon-sm" disabled={i === 0}
              onClick={() => swapItem(i, -1)}
              title="Move up"><ArrowUp className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon-sm" disabled={i === projects.length - 1}
              onClick={() => swapItem(i, 1)}
              title="Move down"><ArrowDown className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon-sm"
              onClick={() => removeItemByIndex(i)}
              aria-label="Remove project">
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <FormField label="Name" id={`proj-${p.id}-name`}>
              <Input id={`proj-${p.id}-name`} value={p.name}
                onChange={(e) => updateItem(i, { name: e.target.value })} />
            </FormField>
            <FormField label="URL" id={`proj-${p.id}-url`}>
              <Input id={`proj-${p.id}-url`} type="url" value={p.url}
                onChange={(e) => updateItem(i, { url: e.target.value })} />
            </FormField>
            <FormField label="Description" id={`proj-${p.id}-desc`}>
              <Textarea id={`proj-${p.id}-desc`} value={p.description} rows={2}
                onChange={(e) => updateItem(i, { description: e.target.value })} />
            </FormField>
            <div>
              <TagInput
                tags={p.tech_stack}
                onChange={(tags) => updateItem(i, { tech_stack: tags })}
                placeholder="Add tech…"
              />
            </div>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full"
        onClick={() => addItem({ id: createId(), name: "", url: "", description: "", tech_stack: [] })}>
        <Plus className="size-4" /> Add project
      </Button>
    </div>
  )
}
