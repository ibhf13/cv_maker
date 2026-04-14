import { useCvStore } from "@/stores/cv-store"
import { useCvArrayField } from "@/hooks/use-cv-field"
import { Input } from "@/components/ui/input"
import { FormField } from "../components/form-field"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Globe, Plus, Trash2 } from "lucide-react"
import { createId } from "@/lib/id"
import { EmptySection } from "../components/empty-section"

export function LanguagesEditor() {
  const languages = useCvStore((s) => s.cvData.languages)
  const { updateItem, removeItemByIndex, addItem, swapItem } = useCvArrayField("languages")

  return (
    <div className="space-y-3">
      {languages.length === 0 && (
        <EmptySection
          icon={<Globe className="size-8" />}
          title="No languages yet"
          description="Add languages with proficiency level and optional CEFR rating."
        />
      )}
      {languages.map((lang, i) => (
        <div key={lang.id} className="rounded-lg border p-3">
          <div className="mb-2 flex justify-end gap-0.5">
            <Button type="button" variant="ghost" size="icon-sm" disabled={i === 0}
              onClick={() => swapItem(i, -1)}
              title="Move up"><ArrowUp className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon-sm" disabled={i === languages.length - 1}
              onClick={() => swapItem(i, 1)}
              title="Move down"><ArrowDown className="size-4" /></Button>
            <Button type="button" variant="ghost" size="icon-sm"
              onClick={() => removeItemByIndex(i)}
              aria-label="Remove language">
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <FormField label="Language" id={`lang-${lang.id}-name`}>
              <Input id={`lang-${lang.id}-name`} value={lang.language}
                onChange={(e) => updateItem(i, { language: e.target.value })} />
            </FormField>
            <FormField label="Level" id={`lang-${lang.id}-level`}>
              <Input id={`lang-${lang.id}-level`} value={lang.level}
                onChange={(e) => updateItem(i, { level: e.target.value })} />
            </FormField>
            <FormField label="CEFR" id={`lang-${lang.id}-cefr`}>
              <Input id={`lang-${lang.id}-cefr`} value={lang.cefr ?? ""}
                onChange={(e) => updateItem(i, { cefr: e.target.value || null })} />
            </FormField>
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full"
        onClick={() => addItem({ id: createId(), language: "", level: "", cefr: null })}>
        <Plus className="size-4" /> Add language
      </Button>
    </div>
  )
}
