import { toast } from "sonner"

/**
 * Wraps a Storage-like object (typically `localStorage`) so that
 * `setItem` failures — almost always `QuotaExceededError` when the user
 * has too many photos / CVs stored — surface a toast instead of crashing
 * Zustand's persist middleware.
 */
export function safeStorage(inner: Storage, label: string): Storage {
  let quotaWarned = false
  return {
    get length() { return inner.length },
    key: (index) => inner.key(index),
    getItem: (key) => inner.getItem(key),
    removeItem: (key) => inner.removeItem(key),
    clear: () => inner.clear(),
    setItem: (key, value) => {
      try {
        inner.setItem(key, value)
      } catch (err) {
        if (isQuotaError(err)) {
          if (!quotaWarned) {
            quotaWarned = true
            toast.error(
              `Storage is full — changes to ${label} can't be saved. Delete older versions or photos to free space.`,
              { duration: 8000 },
            )
          }
          return
        }
        // Unknown error: log and rethrow so higher-level boundaries can react.
        console.error(`safeStorage[${label}]: setItem failed`, err)
        throw err
      }
    },
  }
}

function isQuotaError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  // Chrome / Edge / Firefox names + legacy code; Safari uses a different code.
  const name = err.name
  return (
    name === "QuotaExceededError"
    || name === "NS_ERROR_DOM_QUOTA_REACHED"
    // Safari private-browsing quota === 0 throws DOMException with code 22
    || (err as DOMException).code === 22
  )
}
