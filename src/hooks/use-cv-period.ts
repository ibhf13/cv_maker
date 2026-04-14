import { useCvStore } from "@/stores/cv-store"

type PeriodField = "experience" | "education" | "volunteer"

/**
 * Provides a helper for updating the nested `.period` object on array items
 * that have a period field (experience, education, volunteer).
 */
export function useCvPeriodUpdate(field: PeriodField) {
  const setCvData = useCvStore((s) => s.setCvData)

  const updatePeriod = (index: number, patch: Record<string, unknown>) =>
    setCvData((d) => ({
      ...d,
      [field]: (d[field] as Array<{ period: object }>).map((item, j) =>
        j === index ? { ...item, period: { ...item.period, ...patch } } : item,
      ),
    }))

  return { updatePeriod }
}
