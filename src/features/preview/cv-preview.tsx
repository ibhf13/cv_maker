import { useLayoutEffect, useRef, useState } from "react"
import {
  useCvData, useTemplateId, useTheme, usePhoto, useLocale,
  useSectionConfig, useContactOrder,
} from "@/hooks/use-cv-selectors"
import { TemplateById } from "@/features/templates/template-by-id"
import { ErrorBoundary } from "@/components/error-boundary"

function TemplateErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      role="alert"
      className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center"
    >
      <p className="text-sm font-semibold text-red-600">Template failed to render</p>
      <p className="max-w-md text-xs text-muted-foreground">{error.message}</p>
      <button
        className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground"
        onClick={reset}
      >
        Retry
      </button>
    </div>
  )
}

/** A4 dimensions at 96dpi — used for scale-to-fit */
const A4_WIDTH_PX = (210 * 96) / 25.4
const A4_HEIGHT_PX = (297 * 96) / 25.4

type CvPreviewProps = {
  printRef: React.RefObject<HTMLDivElement | null>
}

export function CvPreview({ printRef }: CvPreviewProps) {
  const cvData = useCvData()
  const templateId = useTemplateId()
  const theme = useTheme()
  const photo = usePhoto()
  const locale = useLocale()
  const sectionConfig = useSectionConfig()
  const contactOrder = useContactOrder()
  const outerRef = useRef<HTMLDivElement>(null)
  const fitInnerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [pageFitScale, setPageFitScale] = useState(1)
  const [overflowing, setOverflowing] = useState(false)

  /** Scale CV content down so everything fits in one A4 page (297mm). */
  useLayoutEffect(() => {
    const outer = printRef.current
    const inner = fitInnerRef.current
    if (!outer || !inner) return

    const update = () => {
      const maxH = outer.clientHeight
      const contentH = inner.scrollHeight
      if (maxH <= 0 || contentH <= 0) return
      const raw = maxH / contentH
      setPageFitScale(Math.max(0.82, Math.min(1, raw)))
      setOverflowing(raw < 0.82)
    }

    update()
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(update)
    })
    ro.observe(outer)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [printRef, cvData, templateId, theme, photo])

  useLayoutEffect(() => {
    const el = outerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const cw = el.clientWidth - 24
      if (cw <= 0) return
      setScale(Math.min(1, cw / A4_WIDTH_PX))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={outerRef}
      className="relative flex w-full justify-center rounded-2xl border border-border/50 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 p-4 shadow-inner"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      }}
    >
      {overflowing && (
        <div className="absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800 shadow-sm dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300">
          Content spans 2 pages in ATS PDF export
        </div>
      )}
      <div
        className="rounded-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18),0_12px_24px_-8px_rgba(0,0,0,0.1)] ring-1 ring-black/5"
        style={{
          width: A4_WIDTH_PX * scale,
          height: A4_HEIGHT_PX * scale,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
        <div
          ref={printRef}
          id="cv-print-root"
          className="relative box-border h-[297mm] w-[210mm] overflow-hidden bg-white text-black print:h-[297mm] print:overflow-hidden print:shadow-none"
        >
          <div
            ref={fitInnerRef}
            className="absolute left-0 top-0 box-border min-h-[297mm] w-[210mm] origin-top-left"
            style={{ transform: `scale(${pageFitScale})` }}
          >
            <ErrorBoundary
              label="CvPreview template"
              fallback={(err, reset) => <TemplateErrorFallback error={err} reset={reset} />}
            >
              <TemplateById
                id={templateId}
                cvData={cvData}
                theme={theme}
                photo={photo}
                locale={locale}
                sectionConfig={sectionConfig}
                contactOrder={contactOrder}
              />
            </ErrorBoundary>
          </div>
          {overflowing && (
            <div className="pointer-events-none absolute left-0 right-0 top-[297mm] z-10 flex items-center gap-2 px-2">
              <div className="h-px flex-1 border-t-2 border-dashed border-red-400/60" />
              <span className="shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/40 dark:text-red-400">
                Page break
              </span>
              <div className="h-px flex-1 border-t-2 border-dashed border-red-400/60" />
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
