"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onCheckedChange?: (checked: boolean) => void
    checked?: boolean
  }
>(({ className, onCheckedChange, checked, children, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked)
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <input type="checkbox" ref={ref} checked={checked} onChange={handleChange} className="sr-only" {...props} />
        <div
          className={cn(
            "h-4 w-4 rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center justify-center",
            checked ? "bg-primary text-primary-foreground" : "bg-background",
            className,
          )}
        >
          {checked && <Check className="h-3 w-3" />}
        </div>
      </div>
      {children && <span className="text-sm">{children}</span>}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }

