import { Briefcase, Globe2, Route, Layers } from "lucide-react"
import { Section, SectionHeader } from "./section"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"

type UseCase = {
  icon: React.ComponentType<{ className?: string }>
  titleKey: EditorLabelKey
  bodyKey: EditorLabelKey
}

const USE_CASES: UseCase[] = [
  { icon: Briefcase, titleKey: "landing_useCase_german_title", bodyKey: "landing_useCase_german_body" },
  { icon: Globe2, titleKey: "landing_useCase_international_title", bodyKey: "landing_useCase_international_body" },
  { icon: Route, titleKey: "landing_useCase_changer_title", bodyKey: "landing_useCase_changer_body" },
  { icon: Layers, titleKey: "landing_useCase_variants_title", bodyKey: "landing_useCase_variants_body" },
]

export function UseCasesSection() {
  const locale = useLocale()

  return (
    <Section id="use-cases" tinted>
      <SectionHeader
        eyebrow={editorLabel("landing_useCasesEyebrow", locale)}
        title={editorLabel("landing_useCasesTitle", locale)}
        subtitle={editorLabel("landing_useCasesSubtitle", locale)}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {USE_CASES.map((u) => {
          const Icon = u.icon
          return (
            <article
              key={u.titleKey}
              className="relative flex gap-4 rounded-2xl border border-border/70 bg-card/90 p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {editorLabel(u.titleKey, locale)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {editorLabel(u.bodyKey, locale)}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
