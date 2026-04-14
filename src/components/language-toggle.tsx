import { useCvStore } from "@/stores/cv-store"
import { useLocale } from "@/hooks/use-cv-selectors"
import { cn } from "@/lib/utils"
import type { CvLocale } from "@/types/ui"

const LOCALES: { value: CvLocale; label: string; aria: string }[] = [
  { value: "de", label: "DE", aria: "Deutsch" },
  { value: "en", label: "EN", aria: "English" },
]

export function LanguageToggle() {
  const locale = useLocale()
  const setUi = useCvStore((s) => s.setUi)

  return (
    <div
      role="group"
      aria-label="CV language"
      className="inline-flex h-8 items-center rounded-md border border-border/80 bg-muted/40 p-0.5"
    >
      {LOCALES.map((l) => {
        const active = locale === l.value
        return (
          <button
            key={l.value}
            type="button"
            aria-label={l.aria}
            aria-pressed={active}
            onClick={() => setUi((u) => ({ ...u, locale: l.value }))}
            className={cn(
              "inline-flex h-7 min-w-8 items-center justify-center rounded-[5px] px-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}
