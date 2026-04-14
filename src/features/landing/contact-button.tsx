import { useState } from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"
import { ContactDialog } from "./contact-dialog"

export function ContactButton() {
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const label = editorLabel("landing_contact_email", locale)

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-8"
        onClick={() => setOpen(true)}
        title={label}
        aria-label={label}
      >
        <Mail className="size-4" />
      </Button>
      <ContactDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
