/* eslint-disable react-refresh/only-export-components -- shared template helpers */
import { createContext, useContext } from "react"
import type { CSSProperties, ReactNode } from "react"
import type { CvData } from "@/lib/cv-schema"
import type { ContactFieldKey, CvLocale, PhotoState, ThemeTokens, SectionConfig } from "@/types/ui"
import { fontFamilyFor } from "@/lib/theme-fonts"
import { presentLabel } from "@/lib/locale"
import { cn } from "@/lib/utils"

export type CvTemplateProps = {
  cvData: CvData
  theme: ThemeTokens
  photo: PhotoState
  locale: CvLocale
  sectionConfig: SectionConfig
  contactOrder?: ContactFieldKey[]
}

export function themeVars(theme: ThemeTokens): CSSProperties {
  return {
    ["--cv-accent" as string]: theme.accent,
    ["--cv-font-heading" as string]: fontFamilyFor(theme.fontHeading),
    ["--cv-font-body" as string]: fontFamilyFor(theme.fontBody),
    ["--cv-line-height" as string]: String(theme.lineHeight),
    ["--cv-heading-fs" as string]: `${theme.headingPt}pt`,
    ["--cv-heading-lh" as string]: String(theme.headingLineHeight),
    fontSize: `${theme.bodyPt}pt`,
    lineHeight: String(theme.lineHeight),
  }
}

export function periodStr(
  p: CvData["experience"][number]["period"],
  locale: CvLocale,
): string {
  if (p.current) return p.start ? `${p.start} – ${presentLabel(locale)}` : presentLabel(locale)
  if (!p.start && !p.end) return ""
  if (!p.end) return p.start
  if (!p.start) return p.end
  return `${p.start} – ${p.end}`
}

export function CvPhoto({
  photo,
  className,
}: {
  photo: PhotoState
  className?: string
}) {
  const r = photo.borderRadius ?? 8
  const radius = `${r}%`

  if (!photo.dataUrl) {
    return (
      <div
        className={cn("bg-zinc-200 text-zinc-400 flex items-center justify-center text-xs", className)}
        style={{ borderRadius: radius }}
      >
        Photo
      </div>
    )
  }
  return (
    <div
      className={cn("relative overflow-hidden bg-zinc-100", className)}
      style={{ borderRadius: radius }}
    >
      <img
        src={photo.dataUrl}
        alt=""
        className="absolute left-1/2 top-1/2 max-w-none select-none"
        style={{
          transform: `translate(calc(-50% + ${photo.offsetX}px), calc(-50% + ${photo.offsetY}px)) scale(${photo.scale})`,
        }}
        draggable={false}
      />
    </div>
  )
}

/**
 * Section heading styling variant. Templates wrap their content in a
 * SectionStyleProvider to switch between presentations without every
 * section renderer needing to know about it.
 *
 * - default: accent-colored title with a 2px underline (classic)
 * - rule:    dark title with a thin hairline rule above the content (DIN-style)
 * - caps:    small uppercase tracked title (editorial/minimal feel)
 */
export type SectionStyle = "default" | "rule" | "caps"

const SectionStyleContext = createContext<SectionStyle>("default")

export function SectionStyleProvider({
  style,
  children,
}: {
  style: SectionStyle
  children: ReactNode
}) {
  return (
    <SectionStyleContext.Provider value={style}>
      {children}
    </SectionStyleContext.Provider>
  )
}

export function useSectionStyle(): SectionStyle {
  return useContext(SectionStyleContext)
}

export function BreakSafeSection({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  const style = useSectionStyle()

  if (style === "rule") {
    return (
      <section className={cn("break-inside-avoid", className)}>
        <h2
          className="mb-2 font-semibold uppercase tracking-[0.12em] text-zinc-800"
          style={{
            fontFamily: "var(--cv-font-heading)",
            fontSize: "var(--cv-heading-fs)",
            lineHeight: "var(--cv-heading-lh)",
          }}
        >
          {title}
        </h2>
        <div
          className="mb-3 h-px w-full"
          style={{ backgroundColor: "var(--cv-accent)" }}
        />
        {children}
      </section>
    )
  }

  if (style === "caps") {
    return (
      <section className={cn("break-inside-avoid", className)}>
        <h2
          className="mb-3 font-semibold uppercase tracking-[0.24em]"
          style={{
            fontFamily: "var(--cv-font-heading)",
            color: "var(--cv-accent)",
            fontSize: "var(--cv-heading-fs)",
            lineHeight: "var(--cv-heading-lh)",
          }}
        >
          {title}
        </h2>
        {children}
      </section>
    )
  }

  return (
    <section className={cn("break-inside-avoid", className)}>
      <h2
        className="mb-2 border-b-2 pb-1 font-semibold tracking-tight"
        style={{
          fontFamily: "var(--cv-font-heading)",
          borderColor: "var(--cv-accent)",
          color: "var(--cv-accent)",
          fontSize: "var(--cv-heading-fs)",
          lineHeight: "var(--cv-heading-lh)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
