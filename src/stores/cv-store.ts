import { create } from "zustand"
import { useStore } from "zustand"
import { temporal } from "zundo"
import { createJSONStorage, persist } from "zustand/middleware"
import { createEmptyCvData } from "@/lib/cv-defaults"
import { cvSchema, type CvData } from "@/lib/cv-schema"
import { PERSIST_VERSION, defaultUiState, normalizeUi } from "@/lib/store-defaults"
import { safeStorage } from "@/lib/safe-storage"
import type { PhotoState, ThemeTokens, UiState } from "@/types/ui"

export type { UiState, ThemeTokens, PhotoState }

type CvStoreState = {
  cvData: CvData
  ui: UiState
  setCvData: (fn: (d: CvData) => CvData) => void
  replaceCvData: (data: CvData) => void
  setUi: (fn: (u: UiState) => UiState) => void
  setTemplateId: (id: number) => void
  setTheme: (patch: Partial<ThemeTokens>) => void
  setPhoto: (patch: Partial<PhotoState>) => void
  resetAll: () => void
}

type PersistedCv = { cvData: CvData; ui: UiState }

const initialState = (): Pick<CvStoreState, "cvData" | "ui"> => ({
  cvData: createEmptyCvData(),
  ui: defaultUiState(),
})

export function migrate(persistedState: unknown, version: number): PersistedCv {
  const p = persistedState as Partial<PersistedCv> | null
  // Future schema migrations dispatch on version here:
  //   if (version === 0) { p = transformV0toV1(p) }
  void version
  const parsed = p?.cvData ? cvSchema.safeParse(p.cvData) : null
  return {
    cvData: parsed?.success ? parsed.data : createEmptyCvData(),
    ui: normalizeUi(p?.ui),
  }
}

export const useCvStore = create<CvStoreState>()(
  persist(
    temporal(
      (set) => ({
        ...initialState(),
        setCvData: (fn) => set((s) => ({ cvData: fn(s.cvData) })),
        replaceCvData: (data) => set({ cvData: data }),
        setUi: (fn) => set((s) => ({ ui: fn(s.ui) })),
        setTemplateId: (id) => set((s) => ({ ui: { ...s.ui, templateId: id } })),
        setTheme: (patch) =>
          set((s) => ({ ui: { ...s.ui, theme: { ...s.ui.theme, ...patch } } })),
        setPhoto: (patch) =>
          set((s) => ({ ui: { ...s.ui, photo: { ...s.ui.photo, ...patch } } })),
        resetAll: () => set(initialState()),
      }),
      {
        limit: 20,
        partialize: (state) => ({ cvData: state.cvData }),
      },
    ),
    {
      name: "cv-maker-storage",
      version: PERSIST_VERSION,
      storage: createJSONStorage(() => safeStorage(localStorage, "your CV")),
      partialize: (state) => ({
        cvData: state.cvData,
        ui: state.ui,
      }),
      migrate,
      merge: (persistedState, currentState) => ({
        ...(currentState as CvStoreState),
        ...(persistedState as PersistedCv),
      }),
    },
  ),
)

export function useUndoRedo() {
  const undo = () => useCvStore.temporal.getState().undo()
  const redo = () => useCvStore.temporal.getState().redo()
  const canUndo = useStore(useCvStore.temporal, (s) => s.pastStates.length > 0)
  const canRedo = useStore(useCvStore.temporal, (s) => s.futureStates.length > 0)
  return { undo, redo, canUndo, canRedo }
}
