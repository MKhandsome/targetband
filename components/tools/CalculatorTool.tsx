"use client"

import { useState } from 'react'
import { calculateOverallBand, SkillScores } from '@/lib/ielts/overallScoreCalculator'
import { GuestGoalCompareWidget } from '@/components/calculator/GuestGoalCompareWidget'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Info } from 'lucide-react'

export function CalculatorTool() {
  const pathname = usePathname()
  const hideBanner = pathname?.startsWith('/dashboard')
  const [scores, setScores] = useState<SkillScores>({
    listening: 6.5,
    reading: 6.5,
    writing: 6.0,
    speaking: 6.0
  })

  const handleScoreChange = (skill: keyof SkillScores, delta: number) => {
    setScores(prev => {
      const newValue = Math.min(Math.max(prev[skill] + delta, 0), 9)
      return { ...prev, [skill]: newValue }
    })
  }

  const overallBand = calculateOverallBand(scores)
  const rawAverage = (scores.listening + scores.reading + scores.writing + scores.speaking) / 4

  let roundingDirection = "exact"
  if (overallBand > rawAverage) roundingDirection = "rounded UP"
  else if (overallBand < rawAverage) roundingDirection = "rounded DOWN"

  const renderSkillStepper = (skillLabel: string, skillKey: keyof SkillScores) => (
    <div className="bg-muted/40 border border-border text-foreground rounded-xl p-4 flex items-center justify-between">
      <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {skillLabel}
      </span>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => handleScoreChange(skillKey, -0.5)}
          disabled={scores[skillKey] <= 0}
          className="rounded-full h-8 w-8 flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition disabled:opacity-50 disabled:pointer-events-none"
        >
          −
        </button>
        <span className="font-mono text-xl font-bold tabular-nums min-w-[3ch] text-center text-foreground">
          {scores[skillKey].toFixed(1)}
        </span>
        <button 
          onClick={() => handleScoreChange(skillKey, 0.5)}
          disabled={scores[skillKey] >= 9}
          className="rounded-full h-8 w-8 flex items-center justify-center border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition disabled:opacity-50 disabled:pointer-events-none"
        >
          +
        </button>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto max-w-2xl px-4 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Overall Band Calculator</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Input your 4 section scores and calculate your official rounded overall IELTS band.
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border shadow-sm rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col gap-4">
        
        {/* 2x2 Skill Inputs Grid (Top Section) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {renderSkillStepper("Listening", "listening")}
          {renderSkillStepper("Reading", "reading")}
          {renderSkillStepper("Writing", "writing")}
          {renderSkillStepper("Speaking", "speaking")}
        </div>

        {/* Overall Band Result Display (Middle Card) */}
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center mt-2 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
          <span className="text-xs font-semibold tracking-wider text-emerald-500 uppercase mb-2">
            Overall Band Score
          </span>
          <span className="font-mono text-7xl font-black text-emerald-500 tracking-tight" style={{ textShadow: "0 0 25px rgba(16,185,129,0.3)" }}>
            {overallBand.toFixed(1)}
          </span>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-xs text-muted-foreground mt-4 font-mono">
            <Info size={12} className="text-muted-foreground/70" />
            <span>Exact Average: {rawAverage.toFixed(3)} ({roundingDirection})</span>
          </div>
        </div>
        
        {/* Footer Rule Note */}
        <p className="text-xs text-center text-muted-foreground mt-2">
          Scores ending in .25 or .75 are rounded up to the next half or whole band respectively.
        </p>

        <div className="mt-4">
          <GuestGoalCompareWidget currentOverall={overallBand} />
        </div>

        {/* Conversion CTA */}
        {!hideBanner && (
          <>
            <hr className="border-border/50 my-6" />
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 text-center space-y-4 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none"></div>
              <h3 className="font-semibold text-lg text-foreground relative z-10">Save your scores over time</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto relative z-10">
                Want to track this score over time and measure your improvement? Create a free account to unlock the full dashboard.
              </p>
              <Link 
                href="/signup"
                className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-8 py-2 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent relative z-10"
              >
                Sign Up Free
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  )
}
