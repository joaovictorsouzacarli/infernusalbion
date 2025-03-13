"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
Accordion.displayName = "Accordion"

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, disabled = false, ...props }, ref) => (
    <div
      ref={ref}
      data-value={value}
      data-disabled={disabled ? "" : undefined}
      className={cn("border rounded-md overflow-hidden", disabled && "opacity-50 cursor-not-allowed", className)}
      {...props}
    />
  ),
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (onClick) onClick()
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={cn(
          "flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left bg-transparent",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out" />
      </button>
    )
  },
)
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, isOpen = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("overflow-hidden transition-all", isOpen ? "max-h-96" : "max-h-0", className)}
      {...props}
    >
      <div className="p-4">{children}</div>
    </div>
  ),
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

