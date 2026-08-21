'use client'

import { useMemo } from 'react'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { format, parseISO } from 'date-fns'

interface ScoreData {
  test_date: string
  overall_score: number
}

interface ScoreTrendChartProps {
  data: ScoreData[]
  targetScore?: number
}

export function ScoreTrendChart({ data, targetScore }: ScoreTrendChartProps) {
  // Ensure data is sorted by date ascending for the chart
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime())
  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-border bg-card/50 text-center text-muted-foreground p-6 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up mb-2 h-8 w-8 text-muted-foreground/40"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
        <p className="font-medium text-foreground">No test data yet</p>
        <p className="mt-1 text-sm">Log your first practice score to see your trend over time.</p>
      </div>
    )
  }


  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Overall Progress Trend
        </h3>
        {targetScore && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
            <span className="w-2 h-0.5 bg-purple-500 rounded-full inline-block"></span>
            Target: {targetScore}
          </div>
        )}
      </div>
      <div className="h-64 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedData} margin={{ top: 16, right: 8, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis 
              dataKey="test_date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickMargin={10}
              tickFormatter={(val) => format(parseISO(val), 'MMM d')}
              minTickGap={30}
            />
            <YAxis 
              domain={[0, 9]} 
              ticks={[0, 3, 4, 5, 6, 7, 8, 9]} 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              animationDuration={150}
              animationEasing="ease-out"
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#10B981', fontWeight: 600 }}
              labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
              labelFormatter={(val) => format(parseISO(val as string), 'MMM d, yyyy')}
            />
            {targetScore && (
              <ReferenceLine y={targetScore} stroke="#8B5CF6" strokeDasharray="3 3" />
            )}
            <Line 
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
              type="monotone" 
              dataKey="overall_score" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#10B981', stroke: '#ffffff', strokeWidth: 2 }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
