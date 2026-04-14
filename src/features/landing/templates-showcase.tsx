import { Check, Columns2 } from "lucide-react"
import { Section, SectionHeader } from "./section"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"
import { cn } from "@/lib/utils"

type TemplateCard = {
  id: number
  label: string
  atsSafe: boolean
  twoColumn: boolean
  /** Visual preset for the mini preview */
  preset: "sidebar" | "centered" | "strip" | "tabellarisch" | "exec" | "editorial" | "skills" | "minimal" | "right" | "twoCol"
}

const TEMPLATES: TemplateCard[] = [
  { id: 1, label: "Sidebar", atsSafe: false, twoColumn: true, preset: "sidebar" },
  { id: 2, label: "Centered", atsSafe: true, twoColumn: false, preset: "centered" },
  { id: 3, label: "Accent Strip", atsSafe: true, twoColumn: false, preset: "strip" },
  { id: 4, label: "Tabellarisch", atsSafe: true, twoColumn: false, preset: "tabellarisch" },
  { id: 5, label: "Executive", atsSafe: true, twoColumn: false, preset: "exec" },
  { id: 6, label: "Editorial", atsSafe: true, twoColumn: false, preset: "editorial" },
  { id: 7, label: "Accent Skills", atsSafe: true, twoColumn: false, preset: "skills" },
  { id: 8, label: "DIN Minimal", atsSafe: true, twoColumn: false, preset: "minimal" },
  { id: 9, label: "Photo Right", atsSafe: false, twoColumn: false, preset: "right" },
  { id: 10, label: "Two Column", atsSafe: false, twoColumn: true, preset: "twoCol" },
]

export function TemplatesShowcase() {
  const locale = useLocale()

  return (
    <Section id="templates">
      <SectionHeader
        eyebrow={editorLabel("landing_templatesEyebrow", locale)}
        title={editorLabel("landing_templatesTitle", locale)}
        subtitle={editorLabel("landing_templatesSubtitle", locale)}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {TEMPLATES.map((t) => (
          <article
            key={t.id}
            className="group flex flex-col gap-2 rounded-xl border border-border/70 bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <TemplateThumb preset={t.preset} />
            <div className="flex items-start justify-between gap-2 px-1 pt-1">
              <h3 className="text-sm font-semibold leading-snug tracking-tight">
                {t.id}. {t.label}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1 px-1 pb-1">
              {t.atsSafe ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  <Check className="size-3" aria-hidden />
                  {editorLabel("landing_templates_ats", locale)}
                </span>
              ) : null}
              {t.twoColumn ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  <Columns2 className="size-3" aria-hidden />
                  {editorLabel("landing_templates_twoCol", locale)}
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

function TemplateThumb({ preset }: { preset: TemplateCard["preset"] }) {
  const base = "relative aspect-[3/4] overflow-hidden rounded-lg border border-border/60 bg-background"
  const line = "h-1 rounded-full bg-muted"
  const accent = "h-1 rounded-full bg-primary/60"

  if (preset === "sidebar" || preset === "twoCol") {
    return (
      <div className={base}>
        <div className="absolute inset-0 grid grid-cols-[38%_1fr]">
          <div className={cn("space-y-1.5 p-2", preset === "sidebar" ? "bg-primary/85" : "bg-muted/60")}>
            <div className={cn("size-6 rounded-full", preset === "sidebar" ? "bg-primary-foreground/30" : "bg-primary/30")} />
            <div className={cn("h-1 w-10 rounded-full", preset === "sidebar" ? "bg-primary-foreground/40" : "bg-muted-foreground/40")} />
            <div className={cn("h-1 w-8 rounded-full", preset === "sidebar" ? "bg-primary-foreground/40" : "bg-muted-foreground/30")} />
          </div>
          <div className="space-y-1.5 p-2">
            <div className={accent} />
            <div className={line} />
            <div className={line} />
            <div className={cn(line, "w-4/5")} />
          </div>
        </div>
      </div>
    )
  }

  if (preset === "right") {
    return (
      <div className={base}>
        <div className="absolute inset-0 grid grid-cols-[1fr_32%]">
          <div className="space-y-1.5 p-2">
            <div className={cn(accent, "w-1/2")} />
            <div className={line} />
            <div className={line} />
            <div className={cn(line, "w-4/5")} />
            <div className={accent} />
            <div className={line} />
          </div>
          <div className="p-2">
            <div className="aspect-square rounded bg-primary/20" />
          </div>
        </div>
      </div>
    )
  }

  if (preset === "strip") {
    return (
      <div className={base}>
        <div className="h-3 w-full bg-primary/90" />
        <div className="space-y-1.5 p-2">
          <div className="h-2 w-1/2 rounded-full bg-foreground/70" />
          <div className={line} />
          <div className={accent} />
          <div className={line} />
          <div className={cn(line, "w-4/5")} />
        </div>
      </div>
    )
  }

  return (
    <div className={base}>
      <div className="space-y-1.5 p-2.5">
        <div className={cn("h-2 rounded-full bg-foreground/80", preset === "centered" ? "w-1/2 mx-auto" : "w-2/5")} />
        {preset === "centered" && <div className="mx-auto h-1 w-1/3 rounded-full bg-muted-foreground/40" />}
        <div className="my-1.5 h-px w-full bg-border" />
        <div className={accent} />
        <div className={line} />
        <div className={cn(line, "w-4/5")} />
        <div className={cn(line, "w-3/5")} />
        {preset === "skills" && (
          <div className="flex flex-wrap gap-1 pt-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-1.5 w-6 rounded-full bg-primary/35" />
            ))}
          </div>
        )}
        <div className={accent} />
        <div className={line} />
        <div className={cn(line, "w-5/6")} />
      </div>
    </div>
  )
}
