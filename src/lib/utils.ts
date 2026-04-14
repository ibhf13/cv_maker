import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Swap element at `index` with its neighbor in direction `dir` (-1 = up, 1 = down). Returns a new array or the original if out of bounds. */
export function swapItems<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir
  if (target < 0 || target >= arr.length) return arr
  const next = [...arr]
  ;[next[index], next[target]] = [next[target], next[index]]
  return next
}

/** Relative luminance of a hex color (WCAG 2.1 formula). */
export function luminance(hex: string): number {
  const c = hex.replace("#", "")
  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255
  const linearize = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

/** Contrast ratio of a hex color against white background (WCAG). */
export function contrastOnWhite(hex: string): number {
  return 1.05 / (luminance(hex) + 0.05)
}
