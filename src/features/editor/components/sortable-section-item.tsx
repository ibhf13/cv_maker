import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Eye, EyeOff, GripVertical, PanelLeft, PanelRight } from "lucide-react"
import type { CvSectionKey } from "@/types/ui"

type Props = {
  sectionKey: CvSectionKey
  label: string
  hidden: boolean
  onToggle: () => void
  showColumnToggle?: boolean
  inSidebar?: boolean
  onColumnToggle?: () => void
}

export function SortableSectionItem({
  sectionKey, label, hidden, onToggle,
  showColumnToggle, inSidebar, onColumnToggle,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionKey })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-1 rounded-md px-1.5 py-1.5 text-sm transition-all hover:bg-muted/40 ${hidden ? "opacity-40" : ""}`}
    >
      <button
        type="button"
        className="shrink-0 cursor-grab touch-none rounded p-0.5 text-muted-foreground/40 hover:text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5" />
      </button>
      <button
        type="button"
        className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        onClick={onToggle}
        title={hidden ? "Show section" : "Hide section"}
      >
        {hidden ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
      </button>
      <span className="flex-1 truncate text-[13px]">{label}</span>
      {showColumnToggle && onColumnToggle && (
        <button
          type="button"
          className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          onClick={onColumnToggle}
          title={inSidebar ? "Move to main column" : "Move to sidebar"}
        >
          {inSidebar ? <PanelRight className="size-3.5" /> : <PanelLeft className="size-3.5" />}
        </button>
      )}
    </div>
  )
}
