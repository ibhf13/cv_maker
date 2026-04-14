import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "./section"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"

export function FinalCta() {
  const locale = useLocale()

  return (
    <Section className="py-20 md:py-24">
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-lg md:px-12 md:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.95_0.08_175/0.25),transparent_55%),radial-gradient(circle_at_80%_80%,oklch(0.90_0.06_230/0.25),transparent_55%)]"
        />
        <div className="relative flex flex-col items-center gap-5">
          <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
            {editorLabel("landing_finalCtaTitle", locale)}
          </h2>
          <p className="max-w-xl text-base text-primary-foreground/85 md:text-lg">
            {editorLabel("landing_finalCtaBody", locale)}
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-2 h-12 gap-2 px-6 text-[15px]">
            <Link to="/editor">
              {editorLabel("landing_finalCtaButton", locale)}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}
