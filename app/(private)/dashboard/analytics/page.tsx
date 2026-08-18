import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { AnalyticsChart } from './AnalyticsChart'
import { TrendingUp, TrendingDown, Target, BrainCircuit, LineChart } from 'lucide-react'

import { Suspense } from 'react'
import DashboardLoading from '../loading'

export const metadata = {
  title: 'Performance Analytics | TargetBand',
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-fade-in-scale max-w-6xl mx-auto p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Performance Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Deep dive into your progression matrices and identify critical growth areas.
        </p>
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <AnalyticsData />
      </Suspense>
    </div>
  )
}

async function AnalyticsData() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        }
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch current active goal
  const { data: goal } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  // Fetch all scores
  const { data: scores } = await supabase
    .from('test_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('test_date', { ascending: false })

  const hasScores = scores && scores.length > 0

  // Executive Summary Calculation Algorithm
  let highestSkill = { name: 'N/A', avg: 0 }
  let priorityGrowth = { name: 'N/A', diff: 0 }

  if (hasScores) {
    const recentScores = scores.slice(0, 5) // Use up to 5 most recent for summary
    const count = recentScores.length

    const calcAvg = (skillKey: string) => {
      const validScores = recentScores.filter(s => s[skillKey] !== null)
      if (validScores.length === 0) return 0
      return validScores.reduce((acc, s) => acc + Number(s[skillKey]), 0) / validScores.length
    }

    const avgs = {
      Listening: calcAvg('listening_score'),
      Reading: calcAvg('reading_score'),
      Writing: calcAvg('writing_score'),
      Speaking: calcAvg('speaking_score'),
    }

    // Find highest performing skill
    let maxAvg = -1
    let maxName = ''
    for (const [key, val] of Object.entries(avgs)) {
      if (val > maxAvg) {
        maxAvg = val
        maxName = key
      }
    }
    highestSkill = { name: maxName, avg: maxAvg }

    // Find priority growth area (furthest from target)
    if (goal) {
      const targets = {
        Listening: Number(goal.target_listening),
        Reading: Number(goal.target_reading),
        Writing: Number(goal.target_writing),
        Speaking: Number(goal.target_speaking),
      }

      let maxDiff = -Infinity // The larger the positive diff (target - avg), the worse they are doing
      let growthName = ''
      for (const [key, val] of Object.entries(avgs)) {
        const diff = targets[key as keyof typeof targets] - val
        if (diff > maxDiff) {
          maxDiff = diff
          growthName = key
        }
      }
      priorityGrowth = { name: growthName, diff: maxDiff }
    } else {
      // If no goal, default growth to lowest average
      let minAvg = Infinity
      let minName = ''
      for (const [key, val] of Object.entries(avgs)) {
        if (val < minAvg) {
          minAvg = val
          minName = key
        }
      }
      priorityGrowth = { name: minName, diff: 0 } // Diff not calculable vs target
    }
  }

  return (
    <>
      {hasScores ? (
        <>
          {/* Executive Summaries Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex items-start gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit className="w-32 h-32" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Highest Performing Skill
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-foreground">{highestSkill.name}</h3>
                  <span className="text-emerald-500 font-mono font-medium">({highestSkill.avg.toFixed(1)} avg)</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on your {Math.min(5, scores.length)} most recent test results.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex items-start gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Target className="w-32 h-32" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Priority Growth Area
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-foreground">{priorityGrowth.name}</h3>
                  {goal && priorityGrowth.diff > 0 && (
                    <span className="text-amber-500 font-mono font-medium">({priorityGrowth.diff.toFixed(1)} below target)</span>
                  )}
                  {goal && priorityGrowth.diff <= 0 && (
                    <span className="text-emerald-500 font-mono font-medium">(Exceeding target!)</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {goal 
                    ? "This skill is currently furthest behind your active target goal." 
                    : "This skill has the lowest average score across your recent tests."}
                </p>
              </div>
            </div>
          </div>

          <AnalyticsChart data={scores} goal={goal} />
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-white/20 bg-white/5 p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground mb-6">
            <LineChart className="w-10 h-10 opacity-50" />
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-line-chart"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">Not enough data for Analytics</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Advanced Analytics requires at least one logged practice test to generate performance trends and growth algorithms.
          </p>
          <Link 
            href="/dashboard/log"
            prefetch={true}
            className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 py-2 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Log Your First Score
          </Link>
        </div>
      )}
    </>
  )
}
