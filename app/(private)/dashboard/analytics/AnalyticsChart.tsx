'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { roundToIeltsBand } from '@/lib/ielts/overallScoreCalculator'

interface ScoreData {
  test_date: string
  listening_score: number | null
  reading_score: number | null
  writing_score: number | null
  speaking_score: number | null
  overall_score?: number | null
}

interface GoalData {
  target_listening: number
  target_reading: number
  target_writing: number
  target_speaking: number
  target_overall?: number
}

interface AnalyticsChartProps {
  data: ScoreData[]
  goal: GoalData | null
}

const COLORS = {
  listening: '#3B82F6', // blue
  reading: '#F59E0B',   // amber
  writing: '#8B5CF6',   // violet
  speaking: '#EC4899',  // pink
  overall: '#10B981',   // emerald (primary)
}

type FilterOption = "all" | "overall"

export function AnalyticsChart({ data, goal }: AnalyticsChartProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all")

  if (data.length === 0) return null

  // Ensure data is sorted by date ascending for the chart and compute overall if missing
  const sortedData = [...data].sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime()).map(d => {
    const present = [d.listening_score, d.reading_score, d.writing_score, d.speaking_score]
      .filter((v): v is number => v !== null && v !== undefined);

    return {
      ...d,
      overall_score: d.overall_score ?? (present.length > 0
        ? roundToIeltsBand(present.reduce((a, b) => a + b, 0) / present.length)
        : null),
    }
  })

  // Compute a default target overall if missing
  let targetOverall = goal?.target_overall
  if (goal && !targetOverall) {
    const avg = (Number(goal.target_listening) + Number(goal.target_reading) + Number(goal.target_writing) + Number(goal.target_speaking)) / 4
    const fractionalPart = avg % 1
    let rounded = Math.floor(avg)
    if (fractionalPart >= 0.25 && fractionalPart < 0.75) rounded += 0.5
    else if (fractionalPart >= 0.75) rounded += 1
    targetOverall = rounded
  }

  const showAll = activeFilter === "all"

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5 md:p-8 shadow-sm">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Skill Performance Trends</h3>
          <p className="text-sm text-muted-foreground mt-1">Track your competencies over time.</p>
        </div>
        
        {/* Interactive Filter Button Bar */}
        <div className="flex flex-wrap gap-2">
          {(["all", "overall"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                activeFilter === filter 
                  ? "bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                  : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:text-foreground"
              }`}
            >
              {filter === "all" ? "All Skills" : "Overall Band"}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[400px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="test_date" 
              stroke="#ffffff40" 
              fontSize={12}
              tickMargin={12}
              tickFormatter={(val) => format(parseISO(val), 'MMM d')}
              minTickGap={30}
            />
            <YAxis 
              domain={[0, 9]} 
              ticks={[0, 2, 4, 5, 6, 7, 8, 9]} 
              stroke="#ffffff40" 
              fontSize={12} 
              tickMargin={10}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#171717', borderColor: '#ffffff20', borderRadius: '8px' }}
              itemStyle={{ fontWeight: 500 }}
              labelStyle={{ color: '#a3a3a3', marginBottom: '8px', borderBottom: '1px solid #ffffff10', paddingBottom: '4px' }}
              labelFormatter={(val) => format(parseISO(val as string), 'MMM d, yyyy')}
            />
            {showAll && (
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            )}
            
            {/* Target Reference Lines if Goal Exists */}
            {goal && (
              <>
                {showAll && <ReferenceLine y={goal.target_listening} stroke={COLORS.listening} strokeDasharray="3 3" strokeOpacity={0.4} />}
                {showAll && <ReferenceLine y={goal.target_reading} stroke={COLORS.reading} strokeDasharray="3 3" strokeOpacity={0.4} />}
                {showAll && <ReferenceLine y={goal.target_writing} stroke={COLORS.writing} strokeDasharray="3 3" strokeOpacity={0.4} />}
                {showAll && <ReferenceLine y={goal.target_speaking} stroke={COLORS.speaking} strokeDasharray="3 3" strokeOpacity={0.4} />}
                {activeFilter === 'overall' && targetOverall && <ReferenceLine y={targetOverall} stroke={COLORS.overall} strokeDasharray="3 3" strokeOpacity={0.5} label={{ position: 'top', value: 'Overall Target', fill: COLORS.overall, fontSize: 12, fontWeight: 500 }} />}
              </>
            )}

            {showAll && (
              <Line 
                connectNulls={true}
                name="Listening"
                type="monotone" 
                dataKey="listening_score" 
                stroke={COLORS.listening} 
                strokeWidth={2.5}
                dot={{ fill: COLORS.listening, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: COLORS.listening, stroke: '#fff', strokeWidth: 2 }}
              />
            )}
            
            {showAll && (
              <Line 
                connectNulls={true}
                name="Reading"
                type="monotone" 
                dataKey="reading_score" 
                stroke={COLORS.reading} 
                strokeWidth={2.5}
                dot={{ fill: COLORS.reading, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: COLORS.reading, stroke: '#fff', strokeWidth: 2 }}
              />
            )}

            {showAll && (
              <Line 
                connectNulls={true}
                name="Writing"
                type="monotone" 
                dataKey="writing_score" 
                stroke={COLORS.writing} 
                strokeWidth={2.5}
                dot={{ fill: COLORS.writing, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: COLORS.writing, stroke: '#fff', strokeWidth: 2 }}
              />
            )}

            {showAll && (
              <Line 
                connectNulls={true}
                name="Speaking"
                type="monotone" 
                dataKey="speaking_score" 
                stroke={COLORS.speaking} 
                strokeWidth={2.5}
                dot={{ fill: COLORS.speaking, r: 3, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: COLORS.speaking, stroke: '#fff', strokeWidth: 2 }}
              />
            )}

            {activeFilter === 'overall' && (
              <Line 
                connectNulls={true}
                name="Overall Band"
                type="monotone" 
                dataKey="overall_score" 
                stroke={COLORS.overall} 
                strokeWidth={4}
                dot={{ fill: COLORS.overall, r: 5, strokeWidth: 0 }}
                activeDot={{ r: 7, fill: COLORS.overall, stroke: '#fff', strokeWidth: 2 }}
                style={{ filter: `drop-shadow(0 0 10px ${COLORS.overall}60)` }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
