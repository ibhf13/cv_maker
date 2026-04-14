import { useState } from "react"
import { Copy, Check, FileJson, GitBranch, Bot, Infinity as InfinityIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeader } from "./section"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"
import { cn } from "@/lib/utils"

const EXAMPLE_JSON = `{
  "personal_info": {
    "name": "Max Mustermann",
    "date_of_birth": "15.03.1992",
    "nationality": "Deutsch",
    "address": { "street": "Marienplatz 1", "plz": "80331", "city": "München" },
    "phone": "+49 151 23456789",
    "email": "max.mustermann@example.de"
  },
  "summary": "Erfahrener Frontend-Entwickler mit 5+ Jahren Erfahrung in React und TypeScript.",
  "experience": [
    {
      "title": "Senior Frontend Engineer",
      "company": "Siemens AG",
      "location": "München",
      "period": { "start": "08.2023", "end": null, "current": true },
      "description": [
        "Leitung der Frontend-Architektur für ein Kundenportal (40k+ MAU).",
        "Ladezeit um 38 % reduziert durch Code-Splitting."
      ]
    }
  ],
  "skills": [
    { "category": "IT", "items": ["TypeScript", "React", "Tailwind"] }
  ],
  "languages": [
    { "language": "Deutsch", "level": "Muttersprache", "cefr": null },
    { "language": "Englisch", "level": "Verhandlungssicher", "cefr": "C1" }
  ]
}`

const WHY_ITEMS: { icon: React.ComponentType<{ className?: string }>; key: EditorLabelKey }[] = [
  { icon: FileJson, key: "landing_jsonWhy1" },
  { icon: GitBranch, key: "landing_jsonWhy2" },
  { icon: InfinityIcon, key: "landing_jsonWhy3" },
  { icon: Bot, key: "landing_jsonWhy4" },
]

export function JsonExampleSection() {
  const locale = useLocale()
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(EXAMPLE_JSON)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard may be blocked; silently ignore */
    }
  }

  return (
    <Section id="json" tinted>
      <SectionHeader
        eyebrow={editorLabel("landing_jsonEyebrow", locale)}
        title={editorLabel("landing_jsonTitle", locale)}
        subtitle={editorLabel("landing_jsonSubtitle", locale)}
      />

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-[oklch(0.18_0.025_185)] shadow-md dark:bg-[oklch(0.14_0.02_185)]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
              <FileJson className="size-3.5" aria-hidden />
              cv.json
            </div>
            <Button
              size="xs"
              variant="ghost"
              onClick={handleCopy}
              className={cn(
                "h-7 gap-1.5 px-2 text-[11px] text-white/80 hover:bg-white/10 hover:text-white",
                copied && "text-primary",
              )}
              aria-label={editorLabel(copied ? "landing_jsonCopied" : "landing_jsonCopy", locale)}
            >
              {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
              {editorLabel(copied ? "landing_jsonCopied" : "landing_jsonCopy", locale)}
            </Button>
          </div>
          <pre className="scrollbar-thin max-h-[520px] overflow-auto px-5 py-4 text-[12.5px] leading-relaxed text-white/90">
            <code>{renderHighlighted(EXAMPLE_JSON)}</code>
          </pre>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/90 p-6 shadow-sm">
          <h3 className="font-display text-xl font-semibold tracking-tight">
            {editorLabel("landing_jsonWhyTitle", locale)}
          </h3>
          <ul className="flex flex-col gap-2.5">
            {WHY_ITEMS.map(({ icon: Icon, key }) => (
              <li key={key} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="leading-relaxed text-foreground/90">
                  {editorLabel(key, locale)}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  )
}

/** Minimal inline JSON highlighter — colors strings, numbers, booleans, and keys. */
function renderHighlighted(src: string): React.ReactNode {
  const tokens: React.ReactNode[] = []
  const regex = /("(?:\\.|[^"\\])*")(\s*:)?|(\btrue\b|\bfalse\b|\bnull\b)|(-?\d+(?:\.\d+)?)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let i = 0
  while ((match = regex.exec(src)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(src.slice(lastIndex, match.index))
    }
    if (match[1]) {
      const isKey = Boolean(match[2])
      tokens.push(
        <span
          key={i++}
          className={isKey ? "text-[oklch(0.80_0.12_210)]" : "text-[oklch(0.82_0.12_145)]"}
        >
          {match[1]}
        </span>,
      )
      if (match[2]) tokens.push(match[2])
    } else if (match[3]) {
      tokens.push(
        <span key={i++} className="text-[oklch(0.80_0.12_30)]">
          {match[3]}
        </span>,
      )
    } else if (match[4]) {
      tokens.push(
        <span key={i++} className="text-[oklch(0.85_0.10_75)]">
          {match[4]}
        </span>,
      )
    }
    lastIndex = regex.lastIndex
  }
  if (lastIndex < src.length) tokens.push(src.slice(lastIndex))
  return tokens
}
