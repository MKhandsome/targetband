'use client'
import { useState } from 'react'
import { NumericStepperBadge } from '@/components/shared/NumericStepperBadge'

export function GuestGoalCompareWidget({ currentOverall }: { currentOverall: number }) {
  const [target, setTarget] = useState(7.0)

  const diff = currentOverall - target
  const percentage = Math.min(100, Math.max(0, (currentOverall / target) * 100))

  return (
    <div className="rounded-xl border border-white/10 bg-[#171717] p-6 shadow-sm mt-8">
      <h3 className="text-lg font-bold mb-6 text-center md:text-left">Goal Comparison (Guest)</h3>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <NumericStepperBadge 
          label="Target Band"
          value={target}
          min={0}
          max={9}
          step={0.5}
          accent="accent"
          onChange={setTarget}
        />
        <div className="flex-1 w-full space-y-3">
           <div className="flex justify-between text-sm">
             <span className="text-muted-foreground">Current: <span className="text-foreground font-mono font-bold text-base ml-1">{currentOverall.toFixed(1)}</span></span>
             <span className="text-muted-foreground">Target: <span className="text-accent font-mono font-bold text-base ml-1">{target.toFixed(1)}</span></span>
           </div>
           <div className="h-5 w-full bg-[#0C0C0C] rounded-full overflow-hidden border border-white/5 relative">
             <div 
               className={`h-full transition-all duration-500 ease-out ${diff >= 0 ? 'bg-primary' : 'bg-accent/80'}`} 
               style={{ width: `${percentage}%` }}
             ></div>
           </div>
           <p className="text-sm text-right font-medium">
             {diff >= 0 
               ? <span className="text-primary">Goal Achieved! 🎉</span> 
               : <span className="text-muted-foreground">{Math.abs(diff).toFixed(1)} bands to go</span>}
           </p>
        </div>
      </div>
    </div>
  )
}
