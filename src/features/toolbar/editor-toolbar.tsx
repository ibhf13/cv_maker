import { useState } from "react"
import { useCvStore } from "@/stores/cv-store"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FolderOpen, Sparkles, Trash2, Upload } from "lucide-react"
import { JsonImportDialog } from "@/features/versions/json-import-dialog"
import { VersionManagerDialog } from "@/features/versions/version-manager-dialog"
import { UndoRedoGroup } from "./undo-redo-group"
import { DownloadMenu } from "./download-menu"
import { ResetDialog } from "./reset-dialog"
import { MobileActionMenu } from "./mobile-action-menu"

type EditorToolbarProps = {
  printRef: React.RefObject<HTMLDivElement | null>
  isLg: boolean
}

export function EditorToolbar({ printRef, isLg }: EditorToolbarProps) {
  const [importOpen, setImportOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [versionOpen, setVersionOpen] = useState(false)

  function loadExample() {
    void import("@/lib/example-cv").then(({ GERMAN_EXAMPLE_CV, GERMAN_EXAMPLE_UI }) => {
      const store = useCvStore.getState()
      store.replaceCvData(GERMAN_EXAMPLE_CV)
      store.setUi((u) => ({ ...u, ...GERMAN_EXAMPLE_UI, theme: { ...u.theme, ...(GERMAN_EXAMPLE_UI.theme ?? {}) } }))
    })
  }

  return (
    <>
      {/* Mobile: undo/redo + single overflow menu */}
      <div className="flex items-center gap-1.5 sm:hidden">
        <UndoRedoGroup />
        <MobileActionMenu
          printRef={printRef}
          isLg={isLg}
          onImport={() => setImportOpen(true)}
          onVersions={() => setVersionOpen(true)}
          onExample={loadExample}
          onReset={() => setResetOpen(true)}
        />
      </div>

      {/* Desktop: full button row */}
      <div className="hidden flex-wrap items-center gap-2 sm:flex">
        <UndoRedoGroup />
        <Separator orientation="vertical" className="h-7" />
        <DownloadMenu printRef={printRef} isLg={isLg} />
        <Separator orientation="vertical" className="h-7" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shadow-sm" onClick={() => setImportOpen(true)}>
              <Upload className="size-4" />
              <span>Import</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>Import CV data from a JSON file</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shadow-sm" onClick={() => setVersionOpen(true)}>
              <FolderOpen className="size-4" />
              <span>Versions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>Save and restore CV snapshots</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shadow-sm" onClick={loadExample}>
              <Sparkles className="size-4" />
              <span>Example</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>Load a sample German CV</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-destructive shadow-sm hover:text-destructive" onClick={() => setResetOpen(true)}>
              <Trash2 className="size-4" />
              <span>Reset</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={6}>Delete all data and start fresh</TooltipContent>
        </Tooltip>
      </div>

      <JsonImportDialog open={importOpen} onOpenChange={setImportOpen} />
      <VersionManagerDialog open={versionOpen} onOpenChange={setVersionOpen} />
      <ResetDialog open={resetOpen} onOpenChange={setResetOpen} />
    </>
  )
}
