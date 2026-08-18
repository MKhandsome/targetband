import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ScoreHistoryTable } from './ScoreHistoryTable'

import { Suspense } from 'react'
import DashboardLoading from '../loading'

export const metadata = {
  title: 'Test History | TargetBand',
}

export default function HistoryPage() {
  return (
    <div className="space-y-8 animate-fade-in-scale max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Test History</h1>
          <p className="text-muted-foreground mt-2">
            Review your past mock tests and analyze your reflection notes.
          </p>
        </div>
        <Link 
          href="/dashboard/log"
          prefetch={true}
          className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-md transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Log New Score
        </Link>
      </div>

      <Suspense fallback={<DashboardLoading />}>
        <HistoryData />
      </Suspense>
    </div>
  )
}

async function HistoryData() {
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

  // Fetch all scores sorted by date desc
  const { data: scores } = await supabase
    .from('test_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('test_date', { ascending: false })

  const hasScores = scores && scores.length > 0

  return (
    <>
      {hasScores ? (
        <ScoreHistoryTable scores={scores} />
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-16 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-history"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">No test history found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You haven&apos;t logged any practice scores yet. Your entire testing history and reflection notes will appear here.
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
