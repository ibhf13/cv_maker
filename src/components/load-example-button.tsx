import { useState } from "react"
import { Sparkles } from "lucide-react"
import { useCvStore } from "@/stores/cv-store"
import { GERMAN_EXAMPLE_CV, GERMAN_EXAMPLE_UI } from "@/lib/example-cv"
import type { CvData } from "@/lib/cv-schema"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"

function isCvEmpty(d: CvData): boolean {
  return (
    !d.personal_info.name.trim() &&
    d.experience.length === 0 &&
    d.education.length === 0
  )
}

function applyExample() {
  const s = useCvStore.getState()
  s.replaceCvData(GERMAN_EXAMPLE_CV)
  s.setUi((u) => ({
    ...u,
    ...GERMAN_EXAMPLE_UI,
    theme: { ...u.theme, ...(GERMAN_EXAMPLE_UI.theme ?? {}) },
  }))
}

export function LoadExampleButton() {
  const cvData = useCvStore((s) => s.cvData)
  const locale = useCvStore((s) => s.ui.locale)
  const [open, setOpen] = useState(false)

  const l = (key: EditorLabelKey) => editorLabel(key, locale)
  const label = l("exampleLabel")
  const title = l("loadExampleTitle")
  const description = l("loadExampleDescription")
  const cancel = l("loadExampleCancel")
  const confirm = l("loadExampleConfirm")

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="shadow-sm"
        onClick={() => (isCvEmpty(cvData) ? applyExample() : setOpen(true))}
        title={l("loadExampleTooltip")}
      >
        <Sparkles className="size-4" />
        {label}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                applyExample()
                setOpen(false)
              }}
            >
              {confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
