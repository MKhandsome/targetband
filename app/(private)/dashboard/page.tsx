import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { GoalProgressCard } from '@/components/dashboard/GoalProgressCard'
import { ScoreTrendChart } from '@/components/dashboard/ScoreTrendChart'
import { ActivityHeatmap, DayActivity } from '@/components/dashboard/ActivityHeatmap'
import Link from 'next/link'
import { format, subDays, startOfToday } from 'date-fns'

import { Suspense } from 'react'
import DashboardLoading from './loading'

export const metadata = {
  title: 'Dashboard | TargetBand',
}

export default function DashboardOverview() {
  return (
    <div className="min-h-screen bg-background text-foreground space-y-8 animate-fade-in-scale max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground font-bold text-2xl sm:text-3xl tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Track your IELTS practice consistency and skill progress.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/dashboard/targets"
            prefetch={true}
            className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Manage Goals
          </Link>
          <Link 
            href="/dashboard/log"
            prefetch={true}
            className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Log Test Score
          </Link>
        </div>
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <DashboardData />
      </Suspense>
    </div>
  )
}

// Generate an array of the last 365 days up to today
function generateLast365DaysMap(): Map<string, number> {
  const map = new Map<string, number>()
  const today = startOfToday()
  // Generate 371 days (53 weeks * 7 days) to fill the grid perfectly
  for (let i = 370; i >= 0; i--) {
    const d = subDays(today, i)
    map.set(format(d, 'yyyy-MM-dd'), 0)
  }
  return map
}

async function DashboardData() {
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

  // 1. Fetch Active Goal
  const { data: goalData } = await supabase
    .from('user_goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()

  // 2. Fetch all scores for the trend chart and heatmap
  const { data: scoresData } = await supabase
    .from('test_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('test_date', { ascending: true }) // Ascending for the chart

  const scores = scoresData || []

  // 3. Process data for Heatmap (371 days rolling)
  const heatmapMap = generateLast365DaysMap()
  scores.forEach(score => {
    const dateStr = score.test_date // assuming YYYY-MM-DD
    if (heatmapMap.has(dateStr)) {
      heatmapMap.set(dateStr, heatmapMap.get(dateStr)! + 1)
    }
  })
  
  const heatmapDays: DayActivity[] = Array.from(heatmapMap.entries()).map(([date, entryCount]) => ({
    date,
    entryCount
  }))

  // 4. Calculate Current Averages (using the 5 most recent tests for a rolling average)
  let averages = null
  if (scores.length > 0) {
    const recentScores = scores.slice(-5) // get the last 5 tests
    const calcAvg = (skillKey: string) => {
      const validScores = recentScores.filter(s => s[skillKey] !== null)
      if (validScores.length === 0) return 0
      return validScores.reduce((sum, s) => sum + Number(s[skillKey]), 0) / validScores.length
    }

    averages = {
      overall_score: calcAvg('overall_score'),
      listening_score: calcAvg('listening_score'),
      reading_score: calcAvg('reading_score'),
      writing_score: calcAvg('writing_score'),
      speaking_score: calcAvg('speaking_score'),
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Goal Progress */}
        <div className="lg:col-span-1 flex flex-col min-h-0">
          <GoalProgressCard goal={goalData} averages={averages} />
        </div>

        {/* Right Column: Chart & Heatmap */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          <ScoreTrendChart data={scores} targetScore={goalData?.target_overall} />
          <ActivityHeatmap days={heatmapDays} />
        </div>
      </div>
      
      {/* Empty State Overlay if no scores at all */}
      {scores.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-card p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-3"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No test data yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You haven&apos;t logged any practice test scores yet. Your charts and averages will populate automatically once you start practicing!
          </p>
          <Link 
            href="/dashboard/log"
            prefetch={true}
            className="inline-flex h-11 items-center justify-center rounded-md bg-accent px-8 py-2 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Log Your First Score
          </Link>
        </div>
      )}
    </>
  )
}
