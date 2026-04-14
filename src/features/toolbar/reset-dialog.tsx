import { useCvStore } from "@/stores/cv-store"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { editorLabel } from "@/lib/editor-labels"

type ResetDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetDialog({ open, onOpenChange }: ResetDialogProps) {
  const locale = useCvStore((s) => s.ui.locale)
  const resetAll = useCvStore((s) => s.resetAll)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{editorLabel("resetTitle", locale)}</AlertDialogTitle>
          <AlertDialogDescription>
            {editorLabel("resetDescription", locale)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{editorLabel("resetCancel", locale)}</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => { resetAll(); onOpenChange(false) }}
          >
            {editorLabel("resetConfirm", locale)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
