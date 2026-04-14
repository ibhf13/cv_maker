const MAX_EDGE = 800
const JPEG_QUALITY = 0.8
const MAX_BYTES = 500 * 1024

export type PhotoCompressResult =
  | { ok: true; dataUrl: string }
  | { ok: false; reason: string }

/**
 * Downscale longest edge, JPEG encode, reject if still over 500KB.
 */
export async function compressPhotoFile(file: File): Promise<PhotoCompressResult> {
  if (!file.type.startsWith("image/")) {
    return { ok: false, reason: "Please choose an image file." }
  }
  const bitmap = await createImageBitmap(file)
  try {
    let { width, height } = bitmap
    const maxDim = Math.max(width, height)
    if (maxDim > MAX_EDGE) {
      const scale = MAX_EDGE / maxDim
      width = Math.round(width * scale)
      height = Math.round(height * scale)
    }
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return { ok: false, reason: "Could not read image." }
    ctx.drawImage(bitmap, 0, 0, width, height)
    const byteSizeOfDataUrl = (url: string) => Math.ceil((url.length * 3) / 4)
    let quality = JPEG_QUALITY
    let dataUrl = canvas.toDataURL("image/jpeg", quality)
    while (byteSizeOfDataUrl(dataUrl) > MAX_BYTES && quality > 0.35) {
      quality -= 0.1
      dataUrl = canvas.toDataURL("image/jpeg", quality)
    }
    if (byteSizeOfDataUrl(dataUrl) > MAX_BYTES) {
      return {
        ok: false,
        reason: "Image is still too large after compression. Try a smaller photo.",
      }
    }
    return { ok: true, dataUrl }
  } finally {
    bitmap.close()
  }
}
