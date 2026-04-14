import { useEffect, useState } from "react"

const cache = new Map<string, number>()

export function useGitHubStars(owner: string, repo: string): { count: number | null } {
  const key = `${owner}/${repo}`
  const [count, setCount] = useState<number | null>(() => cache.get(key) ?? null)

  useEffect(() => {
    if (!owner || !repo || owner.startsWith("TODO") || repo.startsWith("TODO")) return
    if (cache.has(key)) return

    const controller = new AbortController()
    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { stargazers_count?: number } | null) => {
        if (data && typeof data.stargazers_count === "number") {
          cache.set(key, data.stargazers_count)
          setCount(data.stargazers_count)
        }
      })
      .catch(() => {
        // Network error, rate limit, or offline — badge stays hidden.
      })

    return () => controller.abort()
  }, [owner, repo, key])

  return { count }
}
