'use client'

import { useState } from 'react'
import { NumericStepperBadge } from '@/components/shared/NumericStepperBadge'
import { calculateOverallBand, SkillScores } from '@/lib/ielts/overallScoreCalculator'
import { GuestGoalCompareWidget } from '@/components/calculator/GuestGoalCompareWidget'
import Link from 'next/link'

export default function CalculatorPage() {
  const [scores, setScores] = useState<SkillScores>({
    listening: 6.5,
    reading: 6.5,
    writing: 6.0,
    speaking: 6.0
  })

  const handleScoreChange = (skill: keyof SkillScores, value: number) => {
    setScores(prev => ({ ...prev, [skill]: value }))
  }

  const overallBand = calculateOverallBand(scores)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Overall Band Calculator</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Input your 4 section scores and calculate your official rounded overall IELTS band.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-lg space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NumericStepperBadge label="Listening" value={scores.listening} onChange={(v) => handleScoreChange('listening', v)} />
          <NumericStepperBadge label="Reading" value={scores.reading} onChange={(v) => handleScoreChange('reading', v)} />
          <NumericStepperBadge label="Writing" value={scores.writing} onChange={(v) => handleScoreChange('writing', v)} />
          <NumericStepperBadge label="Speaking" value={scores.speaking} onChange={(v) => handleScoreChange('speaking', v)} />
        </div>

        <div className="flex flex-col items-center gap-3 pt-6 pb-2">
          <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
            Overall Band
          </span>
          <div className="flex items-center justify-center h-[96px] min-w-[6ch] rounded-2xl border border-primary/30 bg-primary/10 px-8 ring-1 ring-primary/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <span className="text-6xl font-mono font-bold tabular-nums text-primary">
              {overallBand.toFixed(1)}
            </span>
          </div>
        </div>

        <GuestGoalCompareWidget currentOverall={overallBand} />

        <hr className="border-border/50 my-8" />

        {/* Conversion CTA */}
        <div className="bg-accent/5 border border-accent/20 rounded-xl p-8 text-center space-y-5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none"></div>
          <h3 className="font-semibold text-xl text-foreground relative z-10">Save your scores over time</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto relative z-10">
            Create a free account to track your progress and see how close you are to your goals on your personal dashboard.
          </p>
          <Link 
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-8 py-2 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent relative z-10"
          >
            Sign Up Free
          </Link>
        </div>

      </div>
    </div>
  )
}
