import { useCvStore } from "@/stores/cv-store"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import type { DragEndEvent } from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { sectionLabel } from "@/lib/locale"
import { editorLabel } from "@/lib/editor-labels"
import type { CvSectionKey } from "@/types/ui"
import { SortableSectionItem } from "../components/sortable-section-item"
import { getTemplateMeta } from "@/features/templates/template-meta"

export function SectionConfigPanel() {
  const setUi = useCvStore((s) => s.setUi)
  const sectionConfig = useCvStore((s) => s.ui.sectionConfig)
  const locale = useCvStore((s) => s.ui.locale)
  const templateId = useCvStore((s) => s.ui.templateId)
  const hiddenSet = new Set(sectionConfig.hidden)
  const sidebarSet = new Set(sectionConfig.sidebar)
  const isTwoColumn = getTemplateMeta(templateId).twoColumn

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function toggleVisibility(key: CvSectionKey) {
    setUi((u) => {
      const isHidden = u.sectionConfig.hidden.includes(key)
      return {
        ...u,
        sectionConfig: {
          ...u.sectionConfig,
          hidden: isHidden
            ? u.sectionConfig.hidden.filter((k) => k !== key)
            : [...u.sectionConfig.hidden, key],
        },
      }
    })
  }

  function toggleColumn(key: CvSectionKey) {
    setUi((u) => {
      const inSidebar = u.sectionConfig.sidebar.includes(key)
      return {
        ...u,
        sectionConfig: {
          ...u.sectionConfig,
          sidebar: inSidebar
            ? u.sectionConfig.sidebar.filter((k) => k !== key)
            : [...u.sectionConfig.sidebar, key],
        },
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setUi((u) => {
      const order = [...u.sectionConfig.order]
      const oldIdx = order.indexOf(active.id as CvSectionKey)
      const newIdx = order.indexOf(over.id as CvSectionKey)
      if (oldIdx === -1 || newIdx === -1) return u
      return { ...u, sectionConfig: { ...u.sectionConfig, order: arrayMove(order, oldIdx, newIdx) } }
    })
  }

  const sidebarItems = isTwoColumn ? sectionConfig.order.filter((k) => sidebarSet.has(k)) : []
  const mainItems = isTwoColumn ? sectionConfig.order.filter((k) => !sidebarSet.has(k)) : sectionConfig.order

  if (!isTwoColumn) {
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sectionConfig.order} strategy={verticalListSortingStrategy}>
          <div className="space-y-0.5" role="listbox" aria-label="CV sections order">
            {mainItems.map((key) => (
              <SortableSectionItem
                key={key} sectionKey={key}
                label={sectionLabel(key, locale)}
                hidden={hiddenSet.has(key)}
                onToggle={() => toggleVisibility(key)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sectionConfig.order} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-2 gap-3">
          {/* Sidebar column */}
          <div>
            <p className="mb-1.5 px-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {editorLabel("sidebarColumnLabel", locale)}
            </p>
            <div className="space-y-0.5 rounded-md bg-primary/5 p-0.5" role="listbox" aria-label="Sidebar sections">
              {sidebarItems.map((key) => (
                <SortableSectionItem
                  key={key} sectionKey={key}
                  label={sectionLabel(key, locale)}
                  hidden={hiddenSet.has(key)}
                  onToggle={() => toggleVisibility(key)}
                  showColumnToggle inSidebar
                  onColumnToggle={() => toggleColumn(key)}
                />
              ))}
              {sidebarItems.length === 0 && (
                <p className="px-1.5 py-3 text-center text-xs text-muted-foreground/60">
                  {editorLabel("emptyColumnHint", locale)}
                </p>
              )}
            </div>
          </div>

          {/* Main column */}
          <div>
            <p className="mb-1.5 px-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {editorLabel("mainColumnLabel", locale)}
            </p>
            <div className="space-y-0.5 rounded-md p-0.5" role="listbox" aria-label="Main sections">
              {mainItems.map((key) => (
                <SortableSectionItem
                  key={key} sectionKey={key}
                  label={sectionLabel(key, locale)}
                  hidden={hiddenSet.has(key)}
                  onToggle={() => toggleVisibility(key)}
                  showColumnToggle inSidebar={false}
                  onColumnToggle={() => toggleColumn(key)}
                />
              ))}
            </div>
          </div>
        </div>
      </SortableContext>
    </DndContext>
  )
}
