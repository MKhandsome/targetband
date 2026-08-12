'use client'

import { differenceInDays, parseISO } from 'date-fns'
import Link from 'next/link'

interface GoalData {
  target_overall: number
  target_listening: number
  target_reading: number
  target_writing: number
  target_speaking: number
  target_date?: string
}

interface ScoreAverages {
  overall_score: number
  listening_score: number
  reading_score: number
  writing_score: number
  speaking_score: number
}

interface GoalProgressCardProps {
  goal: GoalData | null
  averages: ScoreAverages | null
}

function ProgressRow({ label, current, target }: { label: string, current: number, target: number }) {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100))
  const achieved = current >= target

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className="font-mono text-xs tabular-nums text-foreground">
          {current.toFixed(1)} <span className="text-muted-foreground">/ {target.toFixed(1)}</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${achieved ? 'bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-primary/70'}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export function GoalProgressCard({ goal, averages }: GoalProgressCardProps) {
  if (!goal) {
    return (
      <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex flex-col justify-center items-center h-full min-h-[300px] text-center">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crosshair"><circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/></svg>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Set Your Target Goal</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-xs">
          Define your target IELTS band to start tracking your progress and see what skills need improvement.
        </p>
        <Link 
          href="/dashboard/goals" 
          className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Create Goal
        </Link>
      </div>
    )
  }

  // If we have a goal but no averages (no scores logged yet)
  const current = averages || {
    overall_score: 0,
    listening_score: 0,
    reading_score: 0,
    writing_score: 0,
    speaking_score: 0
  }

  const daysRemaining = goal.target_date ? Math.max(0, differenceInDays(parseISO(goal.target_date), new Date())) : null

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Current Progress
        </h3>
        {daysRemaining !== null && (
          <div className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-white/10">
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
          </div>
        )}
      </div>

      <div className="flex items-end gap-3 mb-8">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium mb-1">Current Avg</span>
          <span className="font-mono text-4xl font-bold tabular-nums text-foreground">
            {current.overall_score > 0 ? current.overall_score.toFixed(1) : '-'}
          </span>
        </div>
        <div className="pb-1 text-muted-foreground">/</div>
        <div className="flex flex-col pb-1">
          <span className="text-xs text-accent font-medium mb-1">Target</span>
          <span className="font-mono text-xl font-bold tabular-nums text-accent">
            {goal.target_overall.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-5 flex-1">
        <ProgressRow label="Listening" current={current.listening_score} target={goal.target_listening} />
        <ProgressRow label="Reading" current={current.reading_score} target={goal.target_reading} />
        <ProgressRow label="Writing" current={current.writing_score} target={goal.target_writing} />
        <ProgressRow label="Speaking" current={current.speaking_score} target={goal.target_speaking} />
      </div>
    </div>
  )
}
