import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { editorLabel } from "@/lib/editor-labels"
import { useCvStore } from "@/stores/cv-store"
import { EndorsementDialog } from "./endorsement-dialog"
import { GITHUB_REPO_URL, SUPPORT_URL } from "./endorsement-urls"
import { useEndorsement } from "./use-endorsement"

export function EndorsementButton() {
  const locale = useCvStore((s) => s.ui.locale)
  const { open, onOpenChange, onStar, onCoffee } = useEndorsement({
    githubRepoUrl: GITHUB_REPO_URL,
    supportUrl: SUPPORT_URL,
  })

  const label = editorLabel("endorsementOpen", locale)

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-8 text-primary hover:text-primary"
        onClick={() => onOpenChange(true)}
        title={label}
        aria-label={label}
      >
        <Heart className="size-4 fill-current" />
      </Button>
      <EndorsementDialog
        open={open}
        onOpenChange={onOpenChange}
        onStar={onStar}
        onCoffee={onCoffee}
      />
    </>
  )
}
