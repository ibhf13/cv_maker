import { useState } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"
import { cn } from "@/lib/utils"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FORM_ENDPOINT: string = import.meta.env.VITE_CONTACT_FORM_ENDPOINT ?? ""
const MAILTO_FALLBACK = "iebo.testt@gmail.com"

type Status = "idle" | "submitting" | "success" | "error"

type ContactDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>("idle")

  const emailValid = EMAIL_RE.test(email.trim())
  const messageValid = message.trim().length >= 5
  const canSubmit = emailValid && messageValid && status !== "submitting"

  function reset() {
    setEmail("")
    setMessage("")
    setTouched(false)
    setStatus("idle")
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  const subject = locale === "de" ? "CV Maker – Nachricht" : "CV Maker – Message"

  async function submitViaFormsubmit() {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        message: message.trim(),
        _subject: subject,
        _captcha: "false",
        _template: "table",
      }),
    })
    if (!res.ok) throw new Error(`FormSubmit responded ${res.status}`)
    const json = (await res.json().catch(() => ({}))) as { success?: string | boolean }
    if (json.success === "false" || json.success === false) {
      throw new Error("FormSubmit returned success=false")
    }
  }

  function submitViaMailto() {
    const body =
      (locale === "de" ? "Absender: " : "From: ") +
      email.trim() +
      "\n\n" +
      message.trim()
    window.location.href = `mailto:${MAILTO_FALLBACK}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!emailValid || !messageValid) return

    if (!FORM_ENDPOINT) {
      submitViaMailto()
      handleOpenChange(false)
      return
    }

    setStatus("submitting")
    try {
      await submitViaFormsubmit()
      setStatus("success")
    } catch {
      setStatus("error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {status === "success" ? (
          <SuccessState onClose={() => handleOpenChange(false)} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display">
                {editorLabel("landing_contactDialog_title", locale)}
              </DialogTitle>
              <DialogDescription>
                {editorLabel("landing_contactDialog_description", locale)}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-email" className="text-sm font-medium">
                  {editorLabel("landing_contactDialog_emailLabel", locale)}
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder={editorLabel("landing_contactDialog_emailPlaceholder", locale)}
                  disabled={status === "submitting"}
                  aria-invalid={touched && !emailValid}
                  aria-describedby={touched && !emailValid ? "contact-email-error" : undefined}
                />
                {touched && !emailValid && (
                  <p id="contact-email-error" className="text-xs text-destructive">
                    {editorLabel("landing_contactDialog_errorEmail", locale)}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="contact-message" className="text-sm font-medium">
                  {editorLabel("landing_contactDialog_messageLabel", locale)}
                </Label>
                <Textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder={editorLabel("landing_contactDialog_messagePlaceholder", locale)}
                  disabled={status === "submitting"}
                  className={cn("min-h-[7rem] resize-y")}
                  aria-invalid={touched && !messageValid}
                  aria-describedby={touched && !messageValid ? "contact-message-error" : undefined}
                />
                {touched && !messageValid && (
                  <p id="contact-message-error" className="text-xs text-destructive">
                    {editorLabel("landing_contactDialog_errorMessage", locale)}
                  </p>
                )}
              </div>

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {editorLabel("landing_contactDialog_errorSubmit", locale)}
                </p>
              )}

              <p className="text-xs leading-relaxed text-muted-foreground">
                {editorLabel(
                  FORM_ENDPOINT ? "landing_contactDialog_hintDirect" : "landing_contactDialog_hint",
                  locale,
                )}
              </p>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  disabled={status === "submitting"}
                >
                  {editorLabel("landing_contactDialog_cancel", locale)}
                </Button>
                <Button type="submit" disabled={!canSubmit} className="gap-2">
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {editorLabel("landing_contactDialog_submitting", locale)}
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      {editorLabel(
                        FORM_ENDPOINT ? "landing_contactDialog_submitDirect" : "landing_contactDialog_submit",
                        locale,
                      )}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function SuccessState({ onClose }: { onClose: () => void }) {
  const locale = useLocale()
  return (
    <div className="flex flex-col items-center gap-4 py-4 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-primary/15 text-primary">
        <CheckCircle2 className="size-7" />
      </span>
      <DialogTitle className="font-display text-xl">
        {editorLabel("landing_contactDialog_successTitle", locale)}
      </DialogTitle>
      <DialogDescription className="max-w-sm">
        {editorLabel("landing_contactDialog_successBody", locale)}
      </DialogDescription>
      <DialogFooter className="w-full sm:justify-center">
        <Button onClick={onClose}>
          {editorLabel("landing_contactDialog_successClose", locale)}
        </Button>
      </DialogFooter>
    </div>
  )
}
