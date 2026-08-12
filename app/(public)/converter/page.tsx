"use client"

import { useState } from "react"
import { NumericStepperBadge } from "@/components/shared/NumericStepperBadge"
import { rawScoreToBand, LISTENING_TABLE, READING_ACADEMIC_TABLE, READING_GENERAL_TABLE, BandThreshold } from "@/lib/ielts/bandConverter"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ConverterPage() {
  const [testType, setTestType] = useState<"listening" | "reading_academic" | "reading_general">("listening")
  const [rawScore, setRawScore] = useState<number>(30)

  let table: BandThreshold[] = LISTENING_TABLE
  if (testType === "reading_academic") table = READING_ACADEMIC_TABLE
  if (testType === "reading_general") table = READING_GENERAL_TABLE

  const estimatedBand = rawScoreToBand(rawScore, table)

  return (
    <div className="container mx-auto max-w-2xl px-4 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Raw Score Converter</h1>
        <p className="text-muted-foreground">
          Instantly convert your raw listening or reading score into an official IELTS band score.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-lg space-y-8">
        
        {/* Test Type Selector */}
        <div className="flex flex-wrap justify-center bg-background p-1 rounded-xl border border-border/50 w-full md:w-fit mx-auto">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${testType === "listening" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setTestType("listening")}
          >
            Listening
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${testType === "reading_academic" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setTestType("reading_academic")}
          >
            Reading (Academic)
          </button>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${testType === "reading_general" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            onClick={() => setTestType("reading_general")}
          >
            Reading (General)
          </button>
        </div>

        {/* Input & Output */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-4 pb-4">
          <NumericStepperBadge
            label="Raw Score / 40"
            value={rawScore}
            min={0}
            max={40}
            step={1}
            formatAsInteger={true}
            accent="accent"
            onChange={setRawScore}
          />

          <div className="hidden md:flex text-muted-foreground">
            <ArrowRight className="h-6 w-6" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
              Estimated Band
            </span>
            <div className="flex items-center justify-center h-[72px] min-w-[5ch] rounded-xl border border-primary/30 bg-primary/10 px-6 ring-1 ring-primary/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="text-4xl font-mono font-bold tabular-nums text-primary">
                {estimatedBand.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <hr className="border-border/50" />

        {/* Conversion CTA */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 text-center space-y-4">
          <h3 className="font-semibold text-lg text-foreground">Save your progress</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Want to track this score over time and measure your improvement? Create a free account to unlock the full dashboard.
          </p>
          <Link 
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-8 py-2 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Sign Up Free
          </Link>
        </div>

      </div>
    </div>
  )
}
