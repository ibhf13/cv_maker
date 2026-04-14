import { Coffee, Heart, Sparkles, Star } from "lucide-react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { editorLabel } from "@/lib/editor-labels"
import { useCvStore } from "@/stores/cv-store"
import { useGitHubStars } from "./use-github-stars"
import { GITHUB_REPO_URL, SUPPORT_URL, parseOwnerRepo } from "./endorsement-urls"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStar: () => void
  onCoffee: () => void
}

function formatStarCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`
  return String(n)
}

export function EndorsementDialog({ open, onOpenChange, onStar, onCoffee }: Props) {
  const locale = useCvStore((s) => s.ui.locale)
  const parsed = parseOwnerRepo(GITHUB_REPO_URL)
  const { count } = useGitHubStars(parsed?.owner ?? "", parsed?.repo ?? "")

  const hasGithub = GITHUB_REPO_URL.length > 0
  const hasCoffee = SUPPORT_URL.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="size-6 text-primary" aria-hidden="true" />
          </div>
          <DialogTitle className="text-xl">
            {editorLabel("endorsementTitle", locale)}
          </DialogTitle>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {editorLabel("endorsementTagline", locale)}
          </p>
          <DialogDescription className="pt-1 leading-relaxed">
            {editorLabel("endorsementDescription", locale)}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          {hasGithub && (
            <div className="flex flex-col gap-1">
              <Button onClick={onStar} className="min-h-11 gap-2">
                <Star className="size-4 fill-current" />
                <span>{editorLabel("endorsementStarCta", locale)}</span>
                {count !== null && (
                  <span className="ml-auto inline-flex items-center rounded-full bg-background/20 px-2 py-0.5 text-xs font-medium">
                    {formatStarCount(count)}
                  </span>
                )}
              </Button>
              <p className="pl-1 text-xs text-muted-foreground">
                {editorLabel("endorsementStarHint", locale)}
              </p>
            </div>
          )}
          {hasCoffee && (
            <div className="flex flex-col gap-1">
              <Button onClick={onCoffee} variant="outline" className="min-h-11 gap-2">
                <Coffee className="size-4" />
                {editorLabel("endorsementCoffeeCta", locale)}
              </Button>
              <p className="pl-1 text-xs text-muted-foreground">
                {editorLabel("endorsementCoffeeHint", locale)}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Heart className="size-3.5 fill-primary text-primary" aria-hidden="true" />
            {editorLabel("endorsementThanks", locale)}
          </p>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="min-h-11">
            {editorLabel("endorsementLaterCta", locale)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
