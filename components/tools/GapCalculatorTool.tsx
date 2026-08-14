"use client"

import { useState, useEffect } from 'react'
import { NumericStepperBadge } from '@/components/shared/NumericStepperBadge'
import { calculateRequiredScore, GapCalculatorInput } from '@/lib/ielts/gapCalculator'
import Link from 'next/link'
import { Target, AlertCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function GapCalculatorTool() {
  const pathname = usePathname()
  const hideBanner = pathname?.startsWith('/dashboard')
  const [targetOverall, setTargetOverall] = useState(7.0)
  const [knownScores, setKnownScores] = useState<[number, number, number]>([6.5, 6.5, 6.0])

  const [requiredScore, setRequiredScore] = useState<number | null>(null)
  const [isAchievable, setIsAchievable] = useState<boolean>(true)

  useEffect(() => {
    const input: GapCalculatorInput = {
      knownScores,
      targetOverall
    }
    const result = calculateRequiredScore(input)
    setRequiredScore(result.requiredScore)
    setIsAchievable(result.isAchievable)
  }, [knownScores, targetOverall])

  const updateKnownScore = (index: number, value: number) => {
    const newScores = [...knownScores] as [number, number, number]
    newScores[index] = value
    setKnownScores(newScores)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-24">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30 mb-2">
          <Target className="h-6 w-6" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Target Gap Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Input your 3 known scores and your target overall band to find out exactly what you need in your weakest skill.
        </p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 md:p-10 shadow-lg space-y-10">
        
        {/* Target Overall */}
        <div className="flex flex-col items-center bg-[#111] p-6 rounded-xl border border-white/5">
          <h2 className="text-lg font-semibold mb-6 text-center">Your Target Overall Band</h2>
          <NumericStepperBadge 
            label="Target Overall" 
            value={targetOverall} 
            accent="accent" 
            onChange={setTargetOverall} 
          />
        </div>

        {/* Known Scores */}
        <div>
          <h2 className="text-lg font-semibold mb-6 text-center">Your 3 Known Skill Scores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-xl mx-auto">
            <NumericStepperBadge label="Skill 1" value={knownScores[0]} onChange={(v) => updateKnownScore(0, v)} />
            <NumericStepperBadge label="Skill 2" value={knownScores[1]} onChange={(v) => updateKnownScore(1, v)} />
            <NumericStepperBadge label="Skill 3" value={knownScores[2]} onChange={(v) => updateKnownScore(2, v)} />
          </div>
        </div>

        {/* Result Area */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-medium tracking-wide uppercase text-muted-foreground text-center mb-2">
              Required Score in 4th Skill
            </span>
            
            {isAchievable && requiredScore !== null ? (
               <div className="flex items-center justify-center h-[96px] min-w-[6ch] rounded-2xl border border-primary/30 bg-primary/10 px-8 ring-1 ring-primary/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                 <span className="text-5xl font-mono font-bold tabular-nums text-primary">
                   {requiredScore.toFixed(1)}
                 </span>
               </div>
            ) : (
               <div className="flex flex-col items-center text-center p-6 bg-destructive/10 border border-destructive/20 rounded-xl max-w-md w-full mx-auto">
                 <AlertCircle className="h-8 w-8 text-destructive mb-3" />
                 <h4 className="font-bold text-destructive">Mathematically Out of Reach</h4>
                 <p className="text-sm text-destructive/80 mt-1">
                   Even a 9.0 in your 4th skill won't be enough to reach an overall {targetOverall.toFixed(1)}. You will need to improve your known scores.
                 </p>
               </div>
            )}
          </div>
        </div>

        {/* Conversion CTA */}
        {!hideBanner && (
          <div className="bg-accent/5 border border-accent/20 rounded-xl p-8 text-center space-y-5 relative overflow-hidden mt-8">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-[80px] pointer-events-none"></div>
            <h3 className="font-semibold text-xl text-foreground relative z-10">Stop guessing. Start tracking.</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto relative z-10">
              Create a free account to log your practice tests, set realistic goals, and monitor your progress over time.
            </p>
            <Link 
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-8 py-2 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent relative z-10"
            >
              Sign Up Free
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
