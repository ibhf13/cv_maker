export const GITHUB_REPO_URL: string = import.meta.env.VITE_GITHUB_REPO_URL ?? ""
export const SUPPORT_URL: string = import.meta.env.VITE_SUPPORT_URL ?? ""

export function parseOwnerRepo(url: string): { owner: string; repo: string } | null {
  const m = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/?#]+)/)
  if (!m) return null
  return { owner: m[1], repo: m[2].replace(/\.git$/, "") }
}
