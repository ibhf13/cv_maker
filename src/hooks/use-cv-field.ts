import { useCvStore } from "@/stores/cv-store"
import type { CvData } from "@/lib/cv-schema"
import { swapItems } from "@/lib/utils"

type ArrayField = {
  [K in keyof CvData]: CvData[K] extends Array<unknown> ? K : never
}[keyof CvData]

/**
 * Provides CRUD helpers for array fields in cvData (experience, education, skills, etc.).
 * Eliminates the repeated setCvData((d) => ({ ...d, field: d.field.map(...) })) pattern.
 */
export function useCvArrayField<K extends ArrayField>(field: K) {
  const setCvData = useCvStore((s) => s.setCvData)
  type Item = CvData[K] extends Array<infer T> ? T : never

  const updateItem = (index: number, patch: Partial<Item>) =>
    setCvData((d) => ({
      ...d,
      [field]: (d[field] as Item[]).map((item, j) =>
        j === index ? { ...(item as object), ...(patch as object) } as Item : item,
      ),
    }))

  const removeItemByIndex = (index: number) =>
    setCvData((d) => ({
      ...d,
      [field]: (d[field] as Item[]).filter((_item, j) => j !== index),
    }))

  const addItem = (item: Item) =>
    setCvData((d) => ({
      ...d,
      [field]: [...(d[field] as Item[]), item],
    }))

  const swapItem = (index: number, direction: -1 | 1) =>
    setCvData((d) => ({
      ...d,
      [field]: swapItems(d[field] as Item[], index, direction),
    }))

  return { updateItem, removeItemByIndex, addItem, swapItem, setCvData }
}
