import { useState } from "react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sparkles } from "lucide-react"
import { parseImportedJson } from "@/features/export/json"
import { useCvStore } from "@/stores/cv-store"

const MAX_JSON_BYTES = 2 * 1024 * 1024

function stripBom(s: string) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JsonImportDialog({ open, onOpenChange }: Props) {
  const [text, setText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const replaceCvData = useCvStore((s) => s.replaceCvData)

  async function loadExample() {
    setError(null)
    const { GERMAN_EXAMPLE_CV } = await import("@/lib/example-cv")
    setText(JSON.stringify(GERMAN_EXAMPLE_CV, null, 2))
  }

  function apply() {
    setError(null)
    let raw: unknown
    try {
      const t = stripBom(text.trim())
      if (new Blob([t]).size > MAX_JSON_BYTES) {
        setError("JSON is too large (max 2MB).")
        return
      }
      raw = JSON.parse(t)
    } catch {
      setError("Invalid JSON — check commas and quotes.")
      return
    }
    const r = parseImportedJson(raw)
    if (!r.success) {
      setError(r.error)
      return
    }
    replaceCvData(r.data)
    setText("")
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Import resume JSON</AlertDialogTitle>
          <AlertDialogDescription>
            Paste your JSON file contents. This replaces all resume fields (not layout or photo).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='{ "personal_info": { ... } }'
          className="min-h-[200px] font-mono text-xs"
        />
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Validation failed</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap font-mono text-xs">
              {error}
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <label className="cursor-pointer">
              Pick file
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (!f) return
                  const r = new FileReader()
                  r.onload = () => {
                    setText(typeof r.result === "string" ? r.result : "")
                  }
                  r.readAsText(f)
                  e.target.value = ""
                }}
              />
            </label>
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => void loadExample()}>
            <Sparkles className="size-4" />
            Use example
          </Button>
          <span className="text-xs text-muted-foreground">
            Prefills with a sample German CV — review and click Replace to apply.
          </span>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="button" onClick={apply}>
            Replace resume data
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
