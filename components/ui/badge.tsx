import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "high" | "medium" | "review" | "informational" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-[#0B132B] text-white hover:bg-[#1C2541]": variant === "default",
          "border-transparent bg-red-100 text-red-800": variant === "high",
          "border-transparent bg-orange-100 text-orange-800": variant === "medium",
          "border-transparent bg-yellow-100 text-yellow-800": variant === "review",
          "border-transparent bg-green-100 text-green-800": variant === "informational",
          "text-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
