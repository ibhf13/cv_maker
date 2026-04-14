import { useState } from "react"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCvStore } from "@/stores/cv-store"
import { useVersionStore } from "@/features/versions/version-store"
import type { CvVersionSnapshot } from "@/features/versions/version-store"
import { Download, Pencil, Save, Trash2 } from "lucide-react"
import { editorLabel } from "@/lib/editor-labels"

function snapshotFromUi(): CvVersionSnapshot {
  const ui = useCvStore.getState().ui
  return {
    templateId: ui.templateId,
    theme: ui.theme,
    photo: ui.photo,
    locale: ui.locale,
    sectionConfig: ui.sectionConfig,
  }
}

type Props = { open: boolean; onOpenChange: (open: boolean) => void }

export function VersionManagerDialog({ open, onOpenChange }: Props) {
  const cvData = useCvStore((s) => s.cvData)
  const locale = useCvStore((s) => s.ui.locale)
  const replaceCvData = useCvStore((s) => s.replaceCvData)
  const setUi = useCvStore((s) => s.setUi)

  const versions = useVersionStore((s) => s.versions)
  const saveVersion = useVersionStore((s) => s.saveVersion)
  const renameVersion = useVersionStore((s) => s.renameVersion)
  const deleteVersion = useVersionStore((s) => s.deleteVersion)

  const [saveName, setSaveName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  function handleSave() {
    const name = saveName.trim()
    if (!name) return
    saveVersion(name, cvData, snapshotFromUi())
    setSaveName("")
  }

  function handleLoad(id: string) {
    const v = versions.find((x) => x.id === id)
    if (!v) return
    replaceCvData(v.cvData)
    setUi((u) => ({
      ...u,
      templateId: v.uiSnapshot.templateId,
      theme: v.uiSnapshot.theme,
      photo: v.uiSnapshot.photo,
      locale: v.uiSnapshot.locale,
      sectionConfig: v.uiSnapshot.sectionConfig,
    }))
    onOpenChange(false)
  }

  function handleRename(id: string) {
    const name = editName.trim()
    if (!name) return
    renameVersion(id, name)
    setEditingId(null)
  }

  const fmtDate = (ts: number) => new Date(ts).toLocaleDateString(locale === "de" ? "de-DE" : "en-US", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editorLabel("versionsTitle", locale)}</DialogTitle>
          <DialogDescription>
            {editorLabel("versionsDescription", locale)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder={editorLabel("versionPlaceholder", locale)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <Button size="sm" onClick={handleSave} disabled={!saveName.trim()}>
            <Save className="size-4" />
            {editorLabel("versionSave", locale)}
          </Button>
        </div>

        {versions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            {editorLabel("noVersions", locale)}
          </p>
        ) : (
          <div className="space-y-2">
            {versions.map((v) => (
              <div key={v.id} className="flex items-center gap-2 rounded-lg border p-2.5">
                <div className="min-w-0 flex-1">
                  {editingId === v.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRename(v.id)}
                      onBlur={() => handleRename(v.id)}
                      autoFocus
                      className="h-7 text-sm"
                    />
                  ) : (
                    <>
                      <p className="truncate text-sm font-medium">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{fmtDate(v.savedAt)}</p>
                    </>
                  )}
                </div>
                <Button variant="ghost" size="icon-sm" className="size-7 shrink-0"
                  aria-label={editorLabel("versionLoad", locale)}
                  onClick={() => handleLoad(v.id)}>
                  <Download className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="size-7 shrink-0"
                  aria-label={editorLabel("versionRename", locale)}
                  onClick={() => { setEditingId(v.id); setEditName(v.name) }}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm"
                  className="size-7 shrink-0 text-destructive hover:text-destructive"
                  aria-label={editorLabel("versionDelete", locale)}
                  onClick={() => deleteVersion(v.id)}>
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
