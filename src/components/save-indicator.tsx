import { useEffect, useRef, useState } from "react"
import { useCvStore } from "@/stores/cv-store"
import { Check, CloudOff } from "lucide-react"

export function SaveIndicator() {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")
  const timer = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    const unsub = useCvStore.subscribe(() => {
      setStatus("saving")
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        setStatus("saved")
        timer.current = setTimeout(() => setStatus("idle"), 2000)
      }, 300)
    })
    return () => {
      unsub()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  if (status === "idle") {
    return (
      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground/70 md:text-[13px]">
        <CloudOff className="size-3 shrink-0" />
        <span>Local only &middot; browser storage</span>
      </p>
    )
  }

  return (
    <p className="mt-0.5 flex items-center gap-1.5 text-xs md:text-[13px]">
      {status === "saving" ? (
        <>
          <span className="relative flex size-3 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400/60" />
            <span className="relative inline-flex size-3 rounded-full bg-amber-400" />
          </span>
          <span className="text-muted-foreground">Saving&hellip;</span>
        </>
      ) : (
        <>
          <span className="inline-flex size-4 items-center justify-center rounded-full bg-emerald-500/15">
            <Check className="size-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
          </span>
          <span className="text-emerald-700 dark:text-emerald-400">Saved</span>
        </>
      )}
    </p>
  )
}
