import type { PhotoState } from "@/types/ui"

/** Preview sizes photo offsets against an 11rem (176px) container. */
const PREVIEW_BASE = 176

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("image load failed"))
    img.src = dataUrl
  })
}

function roundedPath(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
  const rr = Math.min(r, Math.min(w, h) / 2)
  ctx.beginPath()
  ctx.moveTo(rr, 0)
  ctx.lineTo(w - rr, 0)
  ctx.quadraticCurveTo(w, 0, w, rr)
  ctx.lineTo(w, h - rr)
  ctx.quadraticCurveTo(w, h, w - rr, h)
  ctx.lineTo(rr, h)
  ctx.quadraticCurveTo(0, h, 0, h - rr)
  ctx.lineTo(0, rr)
  ctx.quadraticCurveTo(0, 0, rr, 0)
  ctx.closePath()
}

/**
 * Produce a rounded-mask PNG data URL from a PhotoState at the given canvas aspect.
 * Replicates CvPhoto: cover-fit with offset + scale, then rounded clip.
 */
export async function renderPhotoAsRoundedDataUrl(
  photo: PhotoState,
  canvasW: number,
  canvasH: number,
): Promise<string | null> {
  if (!photo.dataUrl) return null
  let img: HTMLImageElement
  try {
    img = await loadImage(photo.dataUrl)
  } catch {
    return null
  }

  const canvas = document.createElement("canvas")
  canvas.width = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  const minDim = Math.min(canvasW, canvasH)
  const r = (photo.borderRadius / 100) * minDim
  roundedPath(ctx, canvasW, canvasH, r)
  ctx.clip()

  // Match CvPhoto exactly: image at natural size, centered, with offset & scale,
  // rendered at canvas-to-preview upscale ratio so the output is sharp.
  const upscale = minDim / PREVIEW_BASE
  const finalScale = (photo.scale || 1) * upscale
  const w = img.width * finalScale
  const h = img.height * finalScale
  const cx = canvasW / 2 + (photo.offsetX || 0) * upscale
  const cy = canvasH / 2 + (photo.offsetY || 0) * upscale
  ctx.drawImage(img, cx - w / 2, cy - h / 2, w, h)

  return canvas.toDataURL("image/png")
}

/**
 * Pre-render rounded variants of the photo. Returns a PhotoState with the
 * dataUrl replaced by the pre-masked version (offsets/scale reset since they
 * have already been baked into the pixels).
 */
export type ProcessedPhotos = {
  square: PhotoState  // ~1:1 aspect, used by most templates
  portrait: PhotoState // 3:4 aspect, used by Template 9
}

export async function processPhotos(photo: PhotoState): Promise<ProcessedPhotos> {
  if (!photo.dataUrl) {
    return { square: photo, portrait: photo }
  }
  const [squareUrl, portraitUrl] = await Promise.all([
    renderPhotoAsRoundedDataUrl(photo, 400, 400),
    renderPhotoAsRoundedDataUrl(photo, 300, 400),
  ])
  const reset = { offsetX: 0, offsetY: 0, scale: 1 }
  return {
    square: { ...photo, ...reset, dataUrl: squareUrl ?? photo.dataUrl },
    portrait: { ...photo, ...reset, dataUrl: portraitUrl ?? photo.dataUrl },
  }
}
