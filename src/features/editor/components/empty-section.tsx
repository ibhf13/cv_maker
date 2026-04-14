import type { ReactNode } from "react"

type Props = {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptySection({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border/80 px-4 py-8 text-center">
      <div className="text-muted-foreground/50">{icon}</div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="max-w-[280px] text-xs text-muted-foreground/70">{description}</p>
      {action}
    </div>
  )
}
