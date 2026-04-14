const KEY = "cv-maker-analytics-consent"
const EVENT = "cv-maker-consent-change"

export type ConsentStatus = "accepted" | "declined" | null

export function getAnalyticsConsent(): ConsentStatus {
  const v = localStorage.getItem(KEY)
  return v === "accepted" || v === "declined" ? v : null
}

export function setAnalyticsConsent(status: "accepted" | "declined"): void {
  localStorage.setItem(KEY, status)
  window.dispatchEvent(new CustomEvent(EVENT))
}

export function subscribeConsent(listener: () => void): () => void {
  window.addEventListener(EVENT, listener)
  window.addEventListener("storage", listener)
  return () => {
    window.removeEventListener(EVENT, listener)
    window.removeEventListener("storage", listener)
  }
}
