import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

type FormFieldProps = {
  label: string
  id: string
  error?: string
  description?: string
  required?: boolean
  children: ReactNode
}

export function FormField({
  label,
  id,
  error,
  description,
  required,
  children,
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined
  const descId = description ? `${id}-desc` : undefined
  const describedBy = [errorId, descId].filter(Boolean).join(" ") || undefined

  return (
    <div data-field={id} aria-describedby={describedBy}>
      <Label htmlFor={id} className="mb-1.5">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {description && (
        <p id={descId} className="mt-1 text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-0.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
