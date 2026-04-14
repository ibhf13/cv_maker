import { Link, useNavigate } from "react-router"
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"
import { useCvStore } from "@/stores/cv-store"
import { GERMAN_EXAMPLE_CV, GERMAN_EXAMPLE_UI } from "@/lib/example-cv"

export function Hero() {
  const locale = useLocale()
  const navigate = useNavigate()
  const title = editorLabel("landing_heroTitle", locale)
  const [titleLine1, titleLine2] = title.split("\n")

  function loadExampleAndOpen() {
    const s = useCvStore.getState()
    s.replaceCvData(GERMAN_EXAMPLE_CV)
    s.setUi((u) => ({
      ...u,
      ...GERMAN_EXAMPLE_UI,
      theme: { ...u.theme, ...(GERMAN_EXAMPLE_UI.theme ?? {}) },
    }))
    navigate("/editor")
  }

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.85_0.08_175/0.35),transparent_70%)] blur-3xl" />
        <div className="absolute right-[-10%] top-40 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_center,oklch(0.88_0.06_155/0.35),transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-28">
        <div className="flex flex-col gap-7 animate-app-panel">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            {editorLabel("landing_heroBadge", locale)}
          </span>

          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.75rem]">
            <span className="block">{titleLine1}</span>
            {titleLine2 ? (
              <span className="block bg-gradient-to-r from-primary to-[oklch(0.52_0.10_230)] bg-clip-text text-transparent">
                {titleLine2}
              </span>
            ) : null}
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {editorLabel("landing_heroSubtitle", locale)}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 gap-2 px-6 text-[15px]">
              <Link to="/editor">
                {editorLabel("landing_heroCta", locale)}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-6 text-[15px]"
              onClick={loadExampleAndOpen}
            >
              {editorLabel("landing_heroCtaSecondary", locale)}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" aria-hidden />
              {editorLabel("landing_heroSubCta", locale)}
            </span>
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  )
}

function HeroMockup() {
  const locale = useLocale()
  return (
    <div className="relative mx-auto w-full max-w-[520px] animate-app-panel">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-primary/15 via-transparent to-[oklch(0.93_0.03_155/0.4)] blur-xl"
      />
      <div className="relative rounded-2xl border border-border/70 bg-card shadow-[0_20px_60px_-30px_oklch(0.22_0.04_185/0.45)] ring-1 ring-border/40">
        <div className="flex items-center justify-between border-b border-border/50 bg-muted/40 px-4 py-2.5 rounded-t-2xl">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[oklch(0.78_0.16_25)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.82_0.14_85)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.72_0.13_150)]" />
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <ShieldCheck className="size-3" aria-hidden />
            A4 · DIN 5008
          </span>
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-4 p-6">
          <div className="size-20 rounded-md bg-gradient-to-br from-primary/20 to-accent/60 ring-1 ring-border/60" aria-hidden />
          <div className="flex flex-col justify-center gap-1.5">
            <div className="font-display text-lg font-semibold tracking-tight">
              {editorLabel("landing_heroMockName", locale)}
            </div>
            <div className="text-sm font-medium text-primary">
              {editorLabel("landing_heroMockRole", locale)}
            </div>
            <div className="text-xs text-muted-foreground">
              {editorLabel("landing_heroMockLine", locale)}
            </div>
          </div>
        </div>

        <div className="space-y-5 border-t border-border/50 px-6 py-5">
          <MockSection heading={locale === "de" ? "Berufserfahrung" : "Experience"} />
          <MockSection heading={locale === "de" ? "Ausbildung" : "Education"} compact />
          <MockSection heading={locale === "de" ? "Kenntnisse" : "Skills"} tags />
        </div>
      </div>
    </div>
  )
}

function MockSection({ heading, compact, tags }: { heading: string; compact?: boolean; tags?: boolean }) {
  return (
    <div>
      <div className="mb-2 border-b border-primary/30 pb-1 font-display text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        {heading}
      </div>
      {tags ? (
        <div className="flex flex-wrap gap-1.5">
          {["TypeScript", "React", "Tailwind", "Node.js", "GraphQL"].map((t) => (
            <span
              key={t}
              className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground/80"
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="h-2 w-3/4 rounded-full bg-muted" />
          <div className="h-2 w-5/6 rounded-full bg-muted/80" />
          {!compact && <div className="h-2 w-2/3 rounded-full bg-muted/60" />}
        </div>
      )}
    </div>
  )
}
