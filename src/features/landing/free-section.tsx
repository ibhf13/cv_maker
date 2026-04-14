import { Link } from "react-router"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "./github-icon"
import { GITHUB_REPO_URL } from "@/features/endorsement/endorsement-urls"
import { Section } from "./section"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"

const BULLETS: EditorLabelKey[] = [
  "landing_freeBullet1",
  "landing_freeBullet2",
  "landing_freeBullet3",
  "landing_freeBullet4",
]

export function FreeSection() {
  const locale = useLocale()

  return (
    <Section id="free">
      <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-accent/50 p-8 md:p-12 shadow-sm">
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 size-[360px] rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-background/70 px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {editorLabel("landing_freeEyebrow", locale)}
            </span>
            <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.75rem]">
              {editorLabel("landing_freeTitle", locale)}
            </h2>
            <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
              {editorLabel("landing_freeBody", locale)}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="h-11 gap-2">
                <Link to="/editor">
                  {editorLabel("landing_openEditor", locale)}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              {GITHUB_REPO_URL ? (
                <Button asChild variant="outline" size="lg" className="h-11 gap-2">
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <GithubIcon className="size-4" />
                    {editorLabel("landing_contact_star", locale)}
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            {BULLETS.map((key) => (
              <li
                key={key}
                className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/80 px-4 py-3 shadow-sm"
              >
                <span className="grid size-8 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="size-4" aria-hidden />
                </span>
                <span className="text-sm font-medium">{editorLabel(key, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
