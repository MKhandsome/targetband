"use client"

import { useState } from "react"
import { rawScoreToBand, LISTENING_TABLE, READING_ACADEMIC_TABLE, READING_GENERAL_TABLE, BandThreshold } from "@/lib/ielts/bandConverter"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ConverterTool() {
  const pathname = usePathname()
  const hideBanner = pathname?.startsWith('/dashboard')
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

      <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-lg space-y-8 relative overflow-hidden">
        
        {/* Test Type Selector (Top Section) */}
        <div className="space-y-3">
          <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex justify-center">
            Select Test Type
          </label>
          <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-lg mx-auto">
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "listening" 
                  ? "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("listening")}
            >
              Listening
            </button>
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "reading_academic" 
                  ? "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("reading_academic")}
            >
              Academic Reading
            </button>
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "reading_general" 
                  ? "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("reading_general")}
            >
              General Reading
            </button>
          </div>
        </div>

        {/* Interactive Correct Answers Slider (Middle Card) */}
        <div className="bg-muted/50 border border-border rounded-xl p-6 md:p-8 space-y-6 shadow-inner">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Correct Answers
            </h3>
            <div className="font-mono text-2xl font-bold text-foreground">
              {rawScore} <span className="text-muted-foreground text-lg">/ 40</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <input 
              type="range" 
              min="0" 
              max="40" 
              step="1" 
              value={rawScore} 
              onChange={(e) => setRawScore(parseInt(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono px-1">
              <span>0</span>
              <span>10</span>
              <span>20</span>
              <span>30</span>
              <span>40</span>
            </div>
          </div>
        </div>

        {/* Estimated Band Score Display (Bottom Card) */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4">
          <span className="text-xs font-semibold tracking-wider uppercase text-primary">
            Estimated Band Score
          </span>
          <div className="flex items-center justify-center h-32 w-48 rounded-2xl border border-primary/30 bg-primary/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <span className="text-5xl font-mono font-black tabular-nums text-primary">
              {estimatedBand.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Conversion CTA */}
        {!hideBanner && (
          <>
            <hr className="border-border/50 my-6" />
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
          </>
        )}

      </div>
      
      {/* Footer Disclaimer */}
      <p className="text-xs text-center text-muted-foreground/70 mt-6 max-w-lg mx-auto">
        Note: Exact boundaries can vary slightly between different test versions. This tool uses standard official approximations.
      </p>
    </div>
  )
}
