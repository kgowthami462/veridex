import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "secondary", size?: "default" | "sm" | "lg" | "icon" | "md" }>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-[#0B132B] text-white hover:bg-[#1C2541]": variant === "default",
            "border border-[#0B132B] bg-transparent hover:bg-slate-100": variant === "outline",
            "hover:bg-slate-100 text-[#0B132B]": variant === "ghost",
            "bg-[#1C2541] text-white hover:bg-[#0B132B]": variant === "secondary",
            "h-10 px-4 py-2": size === "default" || size === "md",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-9 w-9 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
