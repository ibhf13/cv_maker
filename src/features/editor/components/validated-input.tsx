import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ValidationResult } from "@/lib/validators"

type Props = React.ComponentProps<typeof Input> & {
  validate?: (value: string) => ValidationResult
  validateOn?: "change" | "blur"
}

export function ValidatedInput({ validate, validateOn = "blur", className, onBlur, ...props }: Props) {
  const [touched, setTouched] = useState(false)
  const value = typeof props.value === "string" ? props.value : ""
  const result = validate ? validate(value) : { valid: true }
  const showError = touched && !result.valid

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true)
      onBlur?.(e)
    },
    [onBlur],
  )

  const shouldValidate = validateOn === "change" ? !result.valid : showError

  return (
    <div>
      <Input
        {...props}
        onBlur={handleBlur}
        className={cn(className, shouldValidate && "border-red-400 focus-visible:ring-red-400")}
      />
      {shouldValidate && result.message && (
        <p className="mt-0.5 text-xs text-red-500">{result.message}</p>
      )}
    </div>
  )
}
