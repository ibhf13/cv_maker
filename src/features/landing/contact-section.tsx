import { useState } from "react"
import { Mail, Coffee, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section, SectionHeader } from "./section"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"
import { GithubIcon } from "./github-icon"
import { ContactDialog } from "./contact-dialog"
import { GITHUB_REPO_URL, SUPPORT_URL } from "@/features/endorsement/endorsement-urls"

const GITHUB_ISSUES_URL = GITHUB_REPO_URL ? `${GITHUB_REPO_URL.replace(/\/$/, "")}/issues/new` : "https://github.com"

type LinkAction = {
  kind: "link"
  icon: React.ComponentType<{ className?: string }>
  labelKey: EditorLabelKey
  href: string
  variant: "default" | "outline"
}

type DialogAction = {
  kind: "dialog"
  icon: React.ComponentType<{ className?: string }>
  labelKey: EditorLabelKey
  variant: "default" | "outline"
}

type ContactAction = LinkAction | DialogAction

function buildActions(): ContactAction[] {
  const actions: ContactAction[] = [
    {
      kind: "dialog",
      icon: Mail,
      labelKey: "landing_contact_email",
      variant: "outline",
    },
  ]
  if (GITHUB_REPO_URL) {
    actions.push({
      kind: "link",
      icon: Star,
      labelKey: "landing_contact_star",
      href: GITHUB_REPO_URL,
      variant: "outline",
    })
  }
  if (SUPPORT_URL) {
    actions.push({
      kind: "link",
      icon: Coffee,
      labelKey: "landing_contact_coffee",
      href: SUPPORT_URL,
      variant: "outline",
    })
  }
  actions.push({
    kind: "link",
    icon: GithubIcon,
    labelKey: "landing_contact_github",
    href: GITHUB_ISSUES_URL,
    variant: "outline",
  })
  return actions
}

const ACTIONS = buildActions()

export function ContactSection() {
  const locale = useLocale()
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Section id="contact" tinted>
      <SectionHeader
        eyebrow={editorLabel("landing_contactEyebrow", locale)}
        title={editorLabel("landing_contactTitle", locale)}
        subtitle={editorLabel("landing_contactBody", locale)}
      />

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {ACTIONS.map((a) => {
          const Icon = a.icon
          const label = editorLabel(a.labelKey, locale)
          const className = "h-12 justify-start gap-3 px-5 text-[15px]"

          if (a.kind === "dialog") {
            return (
              <Button
                key={a.labelKey}
                variant={a.variant}
                size="lg"
                className={className}
                onClick={() => setDialogOpen(true)}
              >
                <Icon className="size-5" />
                {label}
              </Button>
            )
          }

          const external = a.href.startsWith("http")
          return (
            <Button
              asChild
              key={a.labelKey}
              variant={a.variant}
              size="lg"
              className={className}
            >
              <a
                href={a.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer noopener" : undefined}
              >
                <Icon className="size-5" />
                {label}
              </a>
            </Button>
          )
        })}
      </div>

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Section>
  )
}
