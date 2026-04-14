import { usePhoto, useTemplateId, useLocale, useSetPhoto } from "@/hooks/use-cv-selectors"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { compressPhotoFile } from "@/lib/photo-compress"
import { editorLabel } from "@/lib/editor-labels"
import { toast } from "sonner"
import { ImagePlus, Trash2, Move, ZoomIn, SquareRoundCorner } from "lucide-react"
import { CvPhoto } from "@/features/templates/shared"

const TEMPLATE_PHOTO_CLASS: Record<number, string> = {
  1: "size-36",
  2: "size-36",
  3: "size-36",
  4: "size-40",
  5: "size-32",
  6: "size-44",
  7: "size-36",
  8: "size-36",
  9: "aspect-square w-full",
  10: "size-36",
}

export function PhotoControls() {
  const photo = usePhoto()
  const templateId = useTemplateId()
  const locale = useLocale()
  const setPhoto = useSetPhoto()
  const photoClass = TEMPLATE_PHOTO_CLASS[templateId] ?? "size-36"

  if (!photo.dataUrl) {
    return (
      <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border/80 px-4 py-6 text-center transition-colors hover:border-primary/40 hover:bg-muted/30">
        <ImagePlus className="size-8 text-muted-foreground/60" />
        <span className="text-sm font-medium text-muted-foreground">Upload photo</span>
        <span className="text-xs text-muted-foreground/60">Max 500 KB, auto-compressed</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const f = e.target.files?.[0]
            e.target.value = ""
            if (!f) return
            const r = await compressPhotoFile(f)
            if (r.ok) {
              setPhoto({ dataUrl: r.dataUrl, offsetX: 0, offsetY: 0, scale: 1 })
            } else {
              toast.error(r.reason)
            }
          }}
        />
      </label>
    )
  }

  const radius = photo.borderRadius ?? 8

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-3">
        <CvPhoto photo={photo} className={`${photoClass} max-w-full shrink-0`} />
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" asChild>
            <label className="cursor-pointer">
              <ImagePlus className="size-3.5" />
              Replace
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0]
                  e.target.value = ""
                  if (!f) return
                  const r = await compressPhotoFile(f)
                  if (r.ok) {
                    setPhoto({ dataUrl: r.dataUrl, offsetX: 0, offsetY: 0, scale: 1 })
                  } else {
                    toast.error(r.reason)
                  }
                }}
              />
            </label>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive"
            onClick={() => setPhoto({ dataUrl: null, offsetX: 0, offsetY: 0, scale: 1 })}
          >
            <Trash2 className="size-3.5" />
            Remove
          </Button>
        </div>
      </div>

      {/* Adjustments */}
      <div className="space-y-2 rounded-lg bg-muted/30 p-2.5">
        <div className="flex items-center gap-2">
          <SquareRoundCorner className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">{editorLabel("photoRadius", locale)} ({radius}%)</Label>
            <Slider value={[radius]} min={0} max={50} step={1}
              aria-label={editorLabel("photoRadius", locale)}
              onValueChange={([v]) => setPhoto({ borderRadius: v })} />
            <div className="flex justify-between text-xs text-muted-foreground/60">
              <span>Sharp</span><span>Round</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Move className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">{editorLabel("photoPanX", locale)}</Label>
              <Slider value={[photo.offsetX]} min={-200} max={200} step={1}
                aria-label={editorLabel("photoPanX", locale)}
                onValueChange={([v]) => setPhoto({ offsetX: v })} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">{editorLabel("photoPanY", locale)}</Label>
              <Slider value={[photo.offsetY]} min={-200} max={200} step={1}
                aria-label={editorLabel("photoPanY", locale)}
                onValueChange={([v]) => setPhoto({ offsetY: v })} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ZoomIn className="size-3.5 shrink-0 text-muted-foreground" />
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground">{editorLabel("photoZoom", locale)}</Label>
            <Slider value={[photo.scale]} min={0.08} max={2.5} step={0.02}
              aria-label={editorLabel("photoZoom", locale)}
              onValueChange={([v]) => setPhoto({ scale: v })} />
          </div>
        </div>
      </div>
    </div>
  )
}
