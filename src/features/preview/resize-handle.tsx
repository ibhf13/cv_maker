import { useCallback, useEffect, useRef, useState } from "react"
import { GripVertical } from "lucide-react"
import { useCvStore } from "@/stores/cv-store"
import { editorLabel } from "@/lib/editor-labels"

type Props = {
  editorWidth: number
  onResize: (editorWidth: number) => void
  containerRef: React.RefObject<HTMLDivElement | null>
}

const MIN_WIDTH = 350
const MAX_WIDTH = 800
const DEFAULT_WIDTH = 560
const STEP = 16
const STEP_COARSE = 64

export function ResizeHandle({ editorWidth, onResize, containerRef }: Props) {
  const locale = useCvStore((s) => s.ui.locale)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setDragging(true)
    startX.current = e.clientX
    const container = containerRef.current
    if (container) {
      const editorEl = container.children[0] as HTMLElement | undefined
      startWidth.current = editorEl?.offsetWidth ?? DEFAULT_WIDTH
    }
  }, [containerRef])

  useEffect(() => {
    if (!dragging) return
    const controller = new AbortController()
    const { signal } = controller
    document.addEventListener("mousemove", (e) => {
      const delta = e.clientX - startX.current
      onResize(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, startWidth.current + delta)))
    }, { signal })
    document.addEventListener("mouseup", () => setDragging(false), { signal })
    return () => controller.abort()
  }, [dragging, onResize])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const clamp = (w: number) => Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, w))
    const step = e.shiftKey ? STEP_COARSE : STEP
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault()
        onResize(clamp(editorWidth - step))
        break
      case "ArrowRight":
        e.preventDefault()
        onResize(clamp(editorWidth + step))
        break
      case "Home":
        e.preventDefault()
        onResize(MIN_WIDTH)
        break
      case "End":
        e.preventDefault()
        onResize(MAX_WIDTH)
        break
      case "Enter":
      case " ":
        e.preventDefault()
        onResize(DEFAULT_WIDTH)
        break
    }
  }, [editorWidth, onResize])

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={editorLabel("resizeHandleLabel", locale)}
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      aria-valuenow={editorWidth}
      tabIndex={0}
      className="group hidden cursor-col-resize items-center justify-center px-0.5 focus-visible:outline-none lg:flex"
      onMouseDown={onMouseDown}
      onDoubleClick={() => onResize(DEFAULT_WIDTH)}
      onKeyDown={onKeyDown}
    >
      <div className={`flex h-12 w-1.5 items-center justify-center rounded-full transition-colors group-focus-visible:ring-2 group-focus-visible:ring-ring ${dragging ? "bg-primary" : "bg-border group-hover:bg-primary/50"}`}>
        <GripVertical className="size-3 text-muted-foreground" />
      </div>
    </div>
  )
}
