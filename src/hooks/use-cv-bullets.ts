import { useCvStore } from "@/stores/cv-store"

/**
 * Provides CRUD helpers for managing experience bullet points (description arrays).
 * Eliminates the repeated nested-array update pattern in experience-tab.
 */
export function useCvBullets() {
  const setCvData = useCvStore((s) => s.setCvData)

  const updateBullet = (experienceIndex: number, bulletIndex: number, value: string) =>
    setCvData((d) => ({
      ...d,
      experience: d.experience.map((item, j) =>
        j === experienceIndex
          ? { ...item, description: item.description.map((b, k) => (k === bulletIndex ? value : b)) }
          : item,
      ),
    }))

  const addBullet = (experienceIndex: number) =>
    setCvData((d) => ({
      ...d,
      experience: d.experience.map((item, j) =>
        j === experienceIndex ? { ...item, description: [...item.description, ""] } : item,
      ),
    }))

  const removeBullet = (experienceIndex: number, bulletIndex: number) =>
    setCvData((d) => ({
      ...d,
      experience: d.experience.map((item, j) =>
        j === experienceIndex
          ? { ...item, description: item.description.filter((_, k) => k !== bulletIndex) }
          : item,
      ),
    }))

  const moveBullet = (experienceIndex: number, bulletIndex: number, direction: -1 | 1) =>
    setCvData((d) => ({
      ...d,
      experience: d.experience.map((item, j) => {
        if (j !== experienceIndex) return item
        const bullets = [...item.description]
        const target = bulletIndex + direction
        if (target < 0 || target >= bullets.length) return item
        ;[bullets[bulletIndex], bullets[target]] = [bullets[target], bullets[bulletIndex]]
        return { ...item, description: bullets }
      }),
    }))

  return { updateBullet, addBullet, removeBullet, moveBullet }
}
