import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { createId } from "@/lib/id"
import { safeStorage } from "@/lib/safe-storage"
import type { CvData } from "@/lib/cv-schema"
import { DEFAULT_THEME, DEFAULT_PHOTO } from "@/lib/theme-constants"
import type { ThemeTokens, PhotoState, SectionConfig, CvLocale } from "@/types/ui"
import { DEFAULT_SECTION_ORDER } from "@/types/ui"

export type CvVersionSnapshot = {
  templateId: number
  theme: ThemeTokens
  photo: PhotoState
  locale: CvLocale
  sectionConfig: SectionConfig
}

export type CvVersion = {
  id: string
  name: string
  cvData: CvData
  uiSnapshot: CvVersionSnapshot
  savedAt: number
}

type VersionStoreState = {
  versions: CvVersion[]
  saveVersion: (name: string, cvData: CvData, uiSnapshot: CvVersionSnapshot) => string
  renameVersion: (id: string, name: string) => void
  deleteVersion: (id: string) => void
}

const DEFAULT_SNAPSHOT: CvVersionSnapshot = {
  templateId: 1,
  theme: { ...DEFAULT_THEME },
  photo: { ...DEFAULT_PHOTO },
  locale: "de",
  sectionConfig: { order: [...DEFAULT_SECTION_ORDER], hidden: [], sidebar: ["skills", "certifications", "volunteer", "languages", "interests"] },
}

const MAX_VERSIONS = 20

export const useVersionStore = create<VersionStoreState>()(
  persist(
    (set) => ({
      versions: [],

      saveVersion: (name, cvData, uiSnapshot) => {
        const id = createId()
        const version: CvVersion = {
          id,
          name,
          cvData,
          uiSnapshot: { ...DEFAULT_SNAPSHOT, ...uiSnapshot },
          savedAt: Date.now(),
        }
        set((s) => ({ versions: [version, ...s.versions].slice(0, MAX_VERSIONS) }))
        return id
      },

      renameVersion: (id, name) =>
        set((s) => ({
          versions: s.versions.map((v) => (v.id === id ? { ...v, name } : v)),
        })),

      deleteVersion: (id) =>
        set((s) => ({ versions: s.versions.filter((v) => v.id !== id) })),
    }),
    {
      name: "cv-maker-versions",
      storage: createJSONStorage(() => safeStorage(localStorage, "saved versions")),
    },
  ),
)
