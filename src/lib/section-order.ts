import type { CvSectionKey, SectionConfig } from "@/types/ui"

/**
 * Return the section keys that should render, in display order.
 * Hidden keys (from `config.hidden`) and any extra `exclude` keys are dropped.
 */
export function visibleSectionKeys(
  config: Pick<SectionConfig, "order" | "hidden">,
  exclude: readonly CvSectionKey[] = [],
): CvSectionKey[] {
  if (!exclude.length && !config.hidden.length) return [...config.order]
  const omit = new Set<CvSectionKey>([...config.hidden, ...exclude])
  return config.order.filter((k) => !omit.has(k))
}
