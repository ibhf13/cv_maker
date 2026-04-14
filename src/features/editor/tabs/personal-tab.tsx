import { useCvStore } from "@/stores/cv-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ValidatedInput } from "../components/validated-input"
import { FormField } from "../components/form-field"
import { validateEmail, validatePhone, validatePLZ, validateDateDE } from "@/lib/validators"
import { editorLabel, type EditorLabelKey } from "@/lib/editor-labels"
import { ArrowDown, ArrowUp } from "lucide-react"
import type { ContactFieldKey } from "@/types/ui"

export function PersonalTab() {
  const cvData = useCvStore((s) => s.cvData)
  const setCvData = useCvStore((s) => s.setCvData)
  const setUi = useCvStore((s) => s.setUi)
  const locale = useCvStore((s) => s.ui.locale)
  const contactOrder = useCvStore((s) => s.ui.contactOrder)
  const pi = cvData.personal_info
  const l = (key: EditorLabelKey) => editorLabel(key, locale)

  function updateField(key: keyof typeof pi, value: string) {
    setCvData((d) => ({
      ...d,
      personal_info: { ...d.personal_info, [key]: value },
    }))
  }

  function updateAddress(key: keyof typeof pi.address, value: string) {
    setCvData((d) => ({
      ...d,
      personal_info: {
        ...d.personal_info,
        address: { ...d.personal_info.address, [key]: value },
      },
    }))
  }

  function swapContactField(index: number, delta: -1 | 1) {
    setUi((u) => {
      const next = [...u.contactOrder]
      const target = index + delta
      if (target < 0 || target >= next.length) return u
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...u, contactOrder: next }
    })
  }

  const fieldContent: Record<ContactFieldKey, React.ReactNode> = {
    personalLine: (
      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label={l("dateOfBirth")} id="pi-dob">
          <ValidatedInput
            id="pi-dob"
            value={pi.date_of_birth}
            placeholder="DD.MM.YYYY"
            autoComplete="bday"
            validate={validateDateDE}
            onChange={(e) => updateField("date_of_birth", e.target.value)}
          />
        </FormField>
        <FormField label={l("placeOfBirth")} id="pi-pob">
          <Input id="pi-pob" value={pi.place_of_birth} onChange={(e) => updateField("place_of_birth", e.target.value)} />
        </FormField>
        <FormField label={l("nationality")} id="pi-nationality">
          <Input id="pi-nationality" value={pi.nationality} placeholder="Optional" onChange={(e) => updateField("nationality", e.target.value)} />
        </FormField>
        <FormField label={l("maritalStatus")} id="pi-marital">
          <Input id="pi-marital" value={pi.marital_status} placeholder={locale === "de" ? "z.B. ledig, verheiratet" : "e.g. single, married"} onChange={(e) => updateField("marital_status", e.target.value)} />
        </FormField>
        <FormField label={l("drivingLicense")} id="pi-license">
          <Input id="pi-license" value={pi.driving_license} placeholder={locale === "de" ? "z.B. Klasse B" : "e.g. Class B"} onChange={(e) => updateField("driving_license", e.target.value)} />
        </FormField>
      </div>
    ),
    email: (
      <FormField label={l("email")} id="pi-email" required>
        <ValidatedInput
          id="pi-email"
          type="email"
          value={pi.email}
          autoComplete="email"
          validate={validateEmail}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </FormField>
    ),
    phone: (
      <FormField label={l("phone")} id="pi-phone" required>
        <ValidatedInput
          id="pi-phone"
          type="tel"
          value={pi.phone}
          placeholder="+49 170 1234567"
          autoComplete="tel"
          validate={validatePhone}
          onChange={(e) => updateField("phone", e.target.value)}
        />
      </FormField>
    ),
    address: (
      <div className="space-y-3">
        <FormField label={l("street")} id="pi-street">
          <Input id="pi-street" value={pi.address.street} autoComplete="address-line1" onChange={(e) => updateAddress("street", e.target.value)} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label={l("plz")} id="pi-plz">
            <ValidatedInput
              id="pi-plz"
              value={pi.address.plz}
              placeholder="80331"
              autoComplete="postal-code"
              validate={validatePLZ}
              onChange={(e) => updateAddress("plz", e.target.value)}
            />
          </FormField>
          <FormField label={l("city")} id="pi-city">
            <Input id="pi-city" value={pi.address.city} autoComplete="address-level2" onChange={(e) => updateAddress("city", e.target.value)} />
          </FormField>
        </div>
      </div>
    ),
    website: (
      <FormField label={l("website")} id="pi-website">
        <Input id="pi-website" type="url" value={pi.website} onChange={(e) => updateField("website", e.target.value)} />
      </FormField>
    ),
    linkedin: (
      <FormField label="LinkedIn" id="pi-linkedin">
        <Input id="pi-linkedin" type="url" value={pi.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} />
      </FormField>
    ),
    xing: (
      <FormField label="Xing" id="pi-xing">
        <Input id="pi-xing" type="url" value={pi.xing} onChange={(e) => updateField("xing", e.target.value)} />
      </FormField>
    ),
  }

  return (
    <div className="space-y-3">
      <FormField label={l("name")} id="pi-name" required>
        <Input id="pi-name" value={pi.name} autoComplete="name" onChange={(e) => updateField("name", e.target.value)} />
      </FormField>
      {contactOrder.map((key, i) => (
        <div key={key} className="rounded-lg border p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {editorLabel(`contactField_${key}`, locale)}
            </span>
            <div className="flex gap-0.5">
              <Button type="button" variant="ghost" size="icon-sm" disabled={i === 0}
                onClick={() => swapContactField(i, -1)}
                title="Move up"><ArrowUp className="size-4" /></Button>
              <Button type="button" variant="ghost" size="icon-sm" disabled={i === contactOrder.length - 1}
                onClick={() => swapContactField(i, 1)}
                title="Move down"><ArrowDown className="size-4" /></Button>
            </div>
          </div>
          {fieldContent[key]}
        </div>
      ))}
    </div>
  )
}
