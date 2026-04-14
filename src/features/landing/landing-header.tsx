import { Link } from "react-router"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"

const NAV_KEYS = [
  { href: "#features", key: "landing_nav_features" as const },
  { href: "#templates", key: "landing_nav_templates" as const },
  { href: "#use-cases", key: "landing_nav_useCases" as const },
  { href: "#faq", key: "landing_nav_faq" as const },
  { href: "#contact", key: "landing_nav_contact" as const },
]

export function LandingHeader() {
  const locale = useLocale()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-[1200px] items-center gap-x-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
          <span aria-hidden className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground font-display text-sm font-bold">
            CV
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            CV Maker
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:flex items-center gap-1 text-sm">
          {NAV_KEYS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {editorLabel(item.key, locale)}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <Button asChild size="sm" className="gap-1.5">
            <Link to="/editor">
              {editorLabel("landing_openEditor", locale)}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
