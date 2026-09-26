import * as React from "react"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface CitationProps extends React.HTMLAttributes<HTMLDivElement> {
  source: string;
  details?: string;
  verified?: boolean;
}

export function Citation({ source, details, verified = true, className, ...props }: CitationProps) {
  return (
    <div className={cn("inline-flex items-center gap-2 rounded-md bg-slate-50 border border-slate-200 px-3 py-1.5 text-sm", className)} {...props}>
      <BookOpen className="h-4 w-4 text-slate-500" />
      <div className="flex flex-col">
        <span className="font-medium text-slate-700">Source: {source}</span>
        {details && <span className="text-xs text-slate-500">{details}</span>}
        {!verified && <span className="text-xs font-semibold text-red-600 mt-0.5">Source verification required.</span>}
      </div>
    </div>
  )
}
