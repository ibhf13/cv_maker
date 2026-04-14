import { useUndoRedo } from "@/stores/cv-store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Redo2, Undo2 } from "lucide-react"

export function UndoRedoGroup() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo()

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border/80 bg-muted/40 p-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="size-8" disabled={!canUndo} onClick={undo} aria-label="Undo">
            <Undo2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>Undo (Ctrl+Z)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="size-8" disabled={!canRedo} onClick={redo} aria-label="Redo">
            <Redo2 className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={6}>Redo (Ctrl+Shift+Z)</TooltipContent>
      </Tooltip>
    </div>
  )
}
