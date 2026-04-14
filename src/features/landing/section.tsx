import { cn } from "@/lib/utils"

type SectionProps = React.PropsWithChildren<{
  id?: string
  className?: string
  containerClassName?: string
  /** Tinted band behind the section to break up the visual rhythm. */
  tinted?: boolean
}>

export function Section({
  id,
  className,
  containerClassName,
  tinted,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative scroll-mt-20 py-16 md:py-24",
        tinted && "bg-muted/40",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1200px] px-4 md:px-6",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: "left" | "center"
}

export function SectionHeader({ eyebrow, title, subtitle, align = "center" }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14 flex flex-col gap-3",
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "items-start text-left",
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center rounded-full border border-border/80 bg-card/70 px-3 py-1 font-display text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-base text-muted-foreground md:text-lg">{subtitle}</p>
      ) : null}
    </div>
  )
}
