import type { CvData } from "@/lib/cv-schema"
import type { ContactFieldKey } from "@/types/ui"
import { DEFAULT_CONTACT_ORDER } from "@/types/ui"
import { ensureUrl } from "@/lib/url-helpers"
import { cn } from "@/lib/utils"

export function Body({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-zinc-800"
      style={{ fontFamily: "var(--cv-font-body)" }}
    >
      {children}
    </div>
  )
}

export function ContactBlock({
  p,
  inverted,
  contactOrder,
}: {
  p: CvData["personal_info"]
  inverted?: boolean
  contactOrder?: ContactFieldKey[]
}) {
  const cls = inverted ? "text-white/90" : "text-zinc-600"
  const addressStr = [
    p.address.street,
    [p.address.plz, p.address.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ")
  const personalLine = [p.date_of_birth, p.place_of_birth, p.nationality, p.marital_status, p.driving_license]
    .filter(Boolean)
    .join(" · ")
  const linkCls = inverted ? "text-white/90 no-underline" : "text-[var(--cv-accent,theme(colors.zinc.700))] no-underline"

  const fieldMap: Record<ContactFieldKey, React.ReactNode> = {
    personalLine: personalLine ? <div key="personalLine">{personalLine}</div> : null,
    email: p.email ? (
      <div key="email">
        <a href={`mailto:${p.email}`} className={linkCls}>{p.email}</a>
      </div>
    ) : null,
    phone: p.phone ? <div key="phone">{p.phone}</div> : null,
    address: addressStr ? <div key="address">{addressStr}</div> : null,
    website: p.website ? (
      <div key="website">
        <a href={ensureUrl(p.website)} target="_blank" rel="noopener noreferrer" className={linkCls}>{p.website}</a>
      </div>
    ) : null,
    linkedin: p.linkedin ? (
      <div key="linkedin">
        <a href={ensureUrl(p.linkedin)} target="_blank" rel="noopener noreferrer" className={linkCls}>{p.linkedin}</a>
      </div>
    ) : null,
    xing: p.xing ? (
      <div key="xing">
        <a href={ensureUrl(p.xing)} target="_blank" rel="noopener noreferrer" className={linkCls}>{p.xing}</a>
      </div>
    ) : null,
  }

  const order = contactOrder ?? DEFAULT_CONTACT_ORDER

  return (
    <div className={cn("space-y-1", cls)} style={{ fontSize: "0.85em" }}>
      {order.map((key) => fieldMap[key])}
    </div>
  )
}
