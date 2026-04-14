import { useState } from "react"
import { Sparkles, X } from "lucide-react"
import { useCvStore } from "@/stores/cv-store"
import { GERMAN_EXAMPLE_CV, GERMAN_EXAMPLE_UI } from "@/lib/example-cv"
import type { CvData } from "@/lib/cv-schema"
import { Button } from "@/components/ui/button"
import { editorLabel } from "@/lib/editor-labels"

function isCvEmpty(d: CvData): boolean {
  return !d.personal_info.name.trim() && d.experience.length === 0 && d.education.length === 0
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

export function EmptyStateBanner() {
  const cvData = useCvStore((s) => s.cvData)
  const locale = useCvStore((s) => s.ui.locale)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed || !isCvEmpty(cvData)) return null

  return (
    <div className="relative rounded-xl border border-border/80 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-5 py-4 shadow-sm">
      <button
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:text-foreground"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <Sparkles className="size-8 shrink-0 text-primary/70" />
        <div className="flex-1">
          <p className="font-medium text-foreground">
            {editorLabel("newHere", locale)}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {editorLabel("newHereDescription", locale)}
          </p>
        </div>
        <Button size="sm" onClick={applyExample}>
          <Sparkles className="size-4" />
          {editorLabel("loadExample", locale)}
        </Button>
      </div>
    </div>
  )
}
