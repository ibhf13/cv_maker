import {
  Eye,
  LayoutTemplate,
  FileStack,
  Download,
  Languages,
  ShieldCheck,
  History,
  Undo2,
} from "lucide-react"
import { Section, SectionHeader } from "./section"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"
import { cn } from "@/lib/utils"

type Feature = {
  icon: React.ComponentType<{ className?: string }>
  titleKey: EditorLabelKey
  bodyKey: EditorLabelKey
}

const FEATURES: Feature[] = [
  { icon: Eye, titleKey: "landing_feature_preview_title", bodyKey: "landing_feature_preview_body" },
  { icon: LayoutTemplate, titleKey: "landing_feature_templates_title", bodyKey: "landing_feature_templates_body" },
  { icon: FileStack, titleKey: "landing_feature_din_title", bodyKey: "landing_feature_din_body" },
  { icon: Download, titleKey: "landing_feature_export_title", bodyKey: "landing_feature_export_body" },
  { icon: Languages, titleKey: "landing_feature_bilingual_title", bodyKey: "landing_feature_bilingual_body" },
  { icon: ShieldCheck, titleKey: "landing_feature_privacy_title", bodyKey: "landing_feature_privacy_body" },
  { icon: History, titleKey: "landing_feature_versions_title", bodyKey: "landing_feature_versions_body" },
  { icon: Undo2, titleKey: "landing_feature_undo_title", bodyKey: "landing_feature_undo_body" },
]

export function FeaturesSection() {
  const locale = useLocale()

  return (
    <Section id="features">
      <SectionHeader
        eyebrow={editorLabel("landing_featuresEyebrow", locale)}
        title={editorLabel("landing_featuresTitle", locale)}
        subtitle={editorLabel("landing_featuresSubtitle", locale)}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <FeatureCard
            key={f.titleKey}
            icon={f.icon}
            title={editorLabel(f.titleKey, locale)}
            body={editorLabel(f.bodyKey, locale)}
            emphasis={i === 0 || i === 5}
          />
        ))}
      </div>
    </Section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  body,
  emphasis,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  emphasis?: boolean
}) {
  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-border/70 bg-card/80 p-5 shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md",
        emphasis && "bg-gradient-to-br from-card to-accent/40",
      )}
    >
      <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
        <Icon className="size-5" />
      </span>
      <h3 className="font-display text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}
