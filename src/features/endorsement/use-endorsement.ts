import { useCallback, useState } from "react"
import {
  incrementDownloadCount,
  markOutcome,
  markShown,
  shouldShowEndorsement,
} from "./endorsement-storage"

type OpenExternal = (url: string) => void

const openInNewTab: OpenExternal = (url) => {
  window.open(url, "_blank", "noopener,noreferrer")
}

export function useEndorsement(opts?: { githubRepoUrl?: string; supportUrl?: string }) {
  const githubRepoUrl = opts?.githubRepoUrl
  const supportUrl = opts?.supportUrl
  const [open, setOpen] = useState(false)

  const recordDownload = useCallback(() => {
    const next = incrementDownloadCount()
    if (shouldShowEndorsement(next)) {
      markShown()
      setOpen(true)
    }
  }, [])

  const onOpenChange = useCallback((next: boolean) => {
    if (!next) markOutcome("dismissed")
    setOpen(next)
  }, [])

  const onStar = useCallback(() => {
    markOutcome("starred")
    if (githubRepoUrl) openInNewTab(githubRepoUrl)
    setOpen(false)
  }, [githubRepoUrl])

  const onCoffee = useCallback(() => {
    markOutcome("donated")
    if (supportUrl) openInNewTab(supportUrl)
    setOpen(false)
  }, [supportUrl])

  return { open, onOpenChange, onStar, onCoffee, recordDownload }
}
