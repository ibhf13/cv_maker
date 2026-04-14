import type { CvTemplateProps } from "./shared"
import { Template01 } from "./sidebar-template"
import { Template02, Template03, Template04, Template05 } from "./templates-single-column"
import { Template06, Template07, Template08, Template09, Template10 } from "./templates-variants"

const MAP = {
  1: Template01,
  2: Template02,
  3: Template03,
  4: Template04,
  5: Template05,
  6: Template06,
  7: Template07,
  8: Template08,
  9: Template09,
  10: Template10,
} as const

export function TemplateById({
  id,
  ...props
}: { id: number } & CvTemplateProps) {
  const C = MAP[id as keyof typeof MAP] ?? Template01
  return <C {...props} />
}
