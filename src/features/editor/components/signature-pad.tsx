import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const PAD_WIDTH = 480
const PAD_HEIGHT = 160
const STROKE_COLOR = "#0f172a"
const STROKE_WIDTH = 2

type Props = {
  value: string
  onChange: (dataUrl: string) => void
}

export function SignaturePad({ value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [hasInk, setHasInk] = useState(Boolean(value))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = PAD_WIDTH * dpr
    canvas.height = PAD_HEIGHT * dpr
    ctx.scale(dpr, dpr)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = STROKE_COLOR
    ctx.lineWidth = STROKE_WIDTH

    if (value) {
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, PAD_WIDTH, PAD_HEIGHT)
        const ratio = Math.min(PAD_WIDTH / img.width, PAD_HEIGHT / img.height, 1)
        const w = img.width * ratio
        const h = img.height * ratio
        ctx.drawImage(img, (PAD_WIDTH - w) / 2, (PAD_HEIGHT - h) / 2, w, h)
        setHasInk(true)
      }
      img.src = value
    }
    // Initialize from `value` only on mount; subsequent drawing updates `value` via onChange and would re-trigger the load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) / rect.width) * PAD_WIDTH,
      y: ((e.clientY - rect.top) / rect.height) * PAD_HEIGHT,
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    drawingRef.current = true
    lastPointRef.current = getPoint(e)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    const ctx = canvasRef.current?.getContext("2d")
    const last = lastPointRef.current
    if (!ctx || !last) return
    const point = getPoint(e)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastPointRef.current = point
    setHasInk(true)
  }

  const handlePointerUp = () => {
    if (!drawingRef.current) return
    drawingRef.current = false
    lastPointRef.current = null
    const canvas = canvasRef.current
    if (!canvas) return
    onChange(canvas.toDataURL("image/png"))
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, PAD_WIDTH, PAD_HEIGHT)
    setHasInk(false)
    setError(null)
    onChange("")
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    setError(null)
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.")
      return
    }
    if (file.size > 500 * 1024) {
      setError("Image is too large (max 500KB).")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return
        ctx.clearRect(0, 0, PAD_WIDTH, PAD_HEIGHT)
        const ratio = Math.min(PAD_WIDTH / img.width, PAD_HEIGHT / img.height, 1)
        const w = img.width * ratio
        const h = img.height * ratio
        ctx.drawImage(img, (PAD_WIDTH - w) / 2, (PAD_HEIGHT - h) / 2, w, h)
        setHasInk(true)
        onChange(canvas.toDataURL("image/png"))
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">Signature drawing</Label>
      <div className="rounded-md border border-dashed border-zinc-300 bg-white p-1">
        <canvas
          ref={canvasRef}
          className="block h-40 w-full cursor-crosshair touch-none rounded bg-white"
          style={{ aspectRatio: `${PAD_WIDTH} / ${PAD_HEIGHT}` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          Upload image
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleClear} disabled={!hasInk}>
          Clear
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
        <span className="text-xs text-muted-foreground">
          Draw with mouse/touch or upload PNG/JPG (max 500KB).
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
