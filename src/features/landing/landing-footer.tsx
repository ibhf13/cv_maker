import { Link } from "react-router"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"
import { GithubIcon } from "./github-icon"
import { GITHUB_REPO_URL } from "@/features/endorsement/endorsement-urls"

export function LandingFooter() {
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-1">
          <Link to="/" className="flex items-center gap-2">
            <span aria-hidden className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground font-display text-xs font-bold">
              CV
            </span>
            <span className="font-display text-base font-semibold tracking-tight">CV Maker</span>
          </Link>
          <p className="text-xs text-muted-foreground">
            {editorLabel("landing_footerTagline", locale)}
          </p>
        </div>

        <div className="flex flex-col gap-1 md:items-end">
          {GITHUB_REPO_URL ? (
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <GithubIcon className="size-4" />
              GitHub
            </a>
          ) : null}
          <p className="text-xs text-muted-foreground">
            © {year} · {editorLabel("landing_footerRights", locale)}
          </p>
          <p className="text-[11px] text-muted-foreground/80">
            {editorLabel("landing_footerMadeWith", locale)}
          </p>
        </div>
      </div>
    </footer>
  )
}
