import { useCvStore } from "@/stores/cv-store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { FormField } from "../components/form-field"
import { TagInput } from "../components/tag-input"
import { SignaturePad } from "../components/signature-pad"

export function ExtraTab() {
  const cvData = useCvStore((s) => s.cvData)
  const setCvData = useCvStore((s) => s.setCvData)

  return (
    <div className="space-y-5">
      <FormField label="Certifications (one per line)" id="extra-certs">
        <Textarea id="extra-certs"
          value={cvData.certifications.join("\n")}
          onChange={(e) =>
            setCvData((d) => ({
              ...d,
              certifications: e.target.value.split("\n").filter(Boolean),
            }))
          }
        />
      </FormField>
      <Separator />
      <div>
        <Label className="mb-1.5">Interests</Label>
        <TagInput
          tags={cvData.interests}
          onChange={(tags) => setCvData((d) => ({ ...d, interests: tags }))}
          placeholder="Add an interest…"
        />
      </div>
      <div className="rounded-lg border p-3">
        <div className="mb-2 flex items-center justify-between">
          <Label className="text-sm font-medium">Signature (Ort, Datum)</Label>
          <div className="flex items-center gap-1.5 text-xs">
            <Checkbox
              id="sig-include"
              checked={cvData.signature !== null}
              onCheckedChange={(c) =>
                setCvData((d) => ({
                  ...d,
                  signature: c ? { city: "", date: "", image: "" } : null,
                }))
              }
            />
            <Label htmlFor="sig-include" className="text-xs font-normal">Include</Label>
          </div>
        </div>
        {cvData.signature && (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField label="City (Ort)" id="sig-city">
                <Input
                  id="sig-city"
                  value={cvData.signature.city}
                  placeholder="München"
                  onChange={(e) =>
                    setCvData((d) => ({
                      ...d,
                      signature: { ...d.signature!, city: e.target.value },
                    }))
                  }
                />
              </FormField>
              <FormField label="Date (Datum)" id="sig-date">
                <Input
                  id="sig-date"
                  value={cvData.signature.date}
                  placeholder="13.04.2026"
                  onChange={(e) =>
                    setCvData((d) => ({
                      ...d,
                      signature: { ...d.signature!, date: e.target.value },
                    }))
                  }
                />
              </FormField>
            </div>
            <SignaturePad
              value={cvData.signature.image}
              onChange={(image) =>
                setCvData((d) => ({
                  ...d,
                  signature: { ...d.signature!, image },
                }))
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
