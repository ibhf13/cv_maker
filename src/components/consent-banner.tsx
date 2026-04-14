import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-cv-selectors"
import { editorLabel } from "@/lib/editor-labels"
import { initAnalytics } from "@/lib/firebase"
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  subscribeConsent,
  type ConsentStatus,
} from "@/lib/consent"

export function ConsentBanner() {
  const locale = useLocale()
  const [consent, setConsent] = useState<ConsentStatus>(() => getAnalyticsConsent())

  useEffect(() => subscribeConsent(() => setConsent(getAnalyticsConsent())), [])

  useEffect(() => {
    if (consent === "accepted") void initAnalytics()
  }, [consent])

  if (consent !== null) return null

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-body"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-lg border bg-background p-4 shadow-lg sm:left-auto sm:right-4"
    >
      <p id="consent-title" className="text-sm font-semibold">
        {editorLabel("consentTitle", locale)}
      </p>
      <p id="consent-body" className="mt-1 text-sm text-muted-foreground">
        {editorLabel("consentBody", locale)}
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAnalyticsConsent("declined")}
        >
          {editorLabel("consentDecline", locale)}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAnalyticsConsent("accepted")}
        >
          {editorLabel("consentAccept", locale)}
        </Button>
      </div>
    </div>
  )
}
