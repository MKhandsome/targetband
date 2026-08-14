"use client"

import { ConverterTool } from "@/components/tools/ConverterTool"
import { CalculatorTool } from "@/components/tools/CalculatorTool"
import { GapCalculatorTool } from "@/components/tools/GapCalculatorTool"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export default function DashboardToolsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const activeTool = searchParams?.get("tool") || "converter"

  const setTool = (tool: string) => {
    const params = new URLSearchParams(searchParams?.toString() || "")
    params.set("tool", tool)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interactive Tools</h1>
          <p className="text-muted-foreground text-sm">
            Use these utilities to analyze and calculate your IELTS scores.
          </p>
        </div>
      </div>


      <div className="bg-card/50 border border-border/50 rounded-2xl overflow-hidden min-h-[500px]">
        {/* We reuse the public pages directly as components */}
        {activeTool === "converter" && <ConverterTool />}
        {activeTool === "calculator" && <CalculatorTool />}
        {activeTool === "gap-calculator" && <GapCalculatorTool />}
      </div>
    </div>
  )
}
