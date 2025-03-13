"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, onValueChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value)
      }
    }

    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={handleChange}
          className={cn(
            "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50" />
      </div>
    )
  },
)
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    // Create a state for opening/closing the dropdown
    const [isOpen, setIsOpen] = React.useState(false)

    return (
      <div
        ref={ref}
        className={cn(
          "h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-between cursor-pointer",
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />

        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
            }}
          />
        )}

        {isOpen && props["aria-controls"] && (
          <div
            className="absolute top-full left-0 z-50 w-full mt-1 rounded-md border border-input bg-background shadow-md max-h-60 overflow-y-auto"
            id={props["aria-controls"]}
          >
            {/* This will be filled by SelectContent */}
            {React.Children.map(
              React.Children.toArray(props.children).filter(
                (child) => React.isValidElement(child) && child.type === SelectContent,
              ),
              (child) => child,
            )}
          </div>
        )}
      </div>
    )
  },
)
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, children }: { placeholder?: string; children?: React.ReactNode }) => (
  <span className="flex-grow">{children || placeholder}</span>
)

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("w-full py-1 px-1", className)} {...props}>
      {children}
    </div>
  ),
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
  ({ className, children, value, ...props }, ref) => {
    // Get the context of the select
    const selectContext = React.useContext(React.createContext(null))

    return (
      <div
        ref={ref}
        data-value={value}
        className={cn("flex cursor-pointer select-none items-center py-1.5 px-3 text-sm hover:bg-accent", className)}
        onClick={(e) => {
          e.stopPropagation()
          // Find the closest SelectTrigger
          const selectTrigger = (e.target as HTMLElement).closest('[data-select-trigger="true"]')
          if (selectTrigger) {
            // Find the onValueChange prop from the select context
            const onValueChange = (selectTrigger as any)["__onValueChange"]
            if (onValueChange) {
              onValueChange(value)
            }
          }
        }}
        {...props}
      >
        {children}
      </div>
    )
  },
)
SelectItem.displayName = "SelectItem"

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

