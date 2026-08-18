'use client'

import React, { useMemo } from 'react'

export interface DayActivity {
  date: string // ISO date string YYYY-MM-DD
  entryCount: number
}

const INTENSITY_CLASSES = [
  'bg-muted/50 border border-border', // 0 entries
  'bg-primary/25 border border-primary/30', // 1 entry
  'bg-primary/50 border border-primary/60', // 2 entries
  'bg-primary/80 border border-primary/90', // 3 entries
  'bg-primary border border-primary text-primary-foreground', // 4+ entries
]

function intensityFor(count: number) {
  return INTENSITY_CLASSES[Math.min(count, INTENSITY_CLASSES.length - 1)]
}

export function ActivityHeatmap({ days }: { days: DayActivity[] }) {
  const weeks = useMemo(() => chunkIntoWeeks(days), [days])

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Practice Consistency & Activity Heatmap
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>Less</span>
          {INTENSITY_CLASSES.map((cls, i) => (
            <div key={i} className={`h-2.5 w-2.5 rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.entryCount} test${
                  day.entryCount === 1 ? '' : 's'
                } logged`}
                className={`h-3 w-3 rounded-sm transition-transform hover:scale-125 ${intensityFor(
                  day.entryCount
                )}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function chunkIntoWeeks(days: DayActivity[]): DayActivity[][] {
  const weeks: DayActivity[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  return weeks
}
