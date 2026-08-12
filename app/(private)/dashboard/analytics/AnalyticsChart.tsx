'use client'

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

interface ScoreData {
  test_date: string
  listening_score: number
  reading_score: number
  writing_score: number
  speaking_score: number
}

interface GoalData {
  target_listening: number
  target_reading: number
  target_writing: number
  target_speaking: number
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
}

export function AnalyticsChart({ data, goal }: AnalyticsChartProps) {
  if (data.length === 0) return null

  // Ensure data is sorted by date ascending for the chart
  const sortedData = [...data].sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime())

  return (
    <div className="rounded-2xl border border-white/10 bg-card p-5 md:p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground">Skill Performance Trends</h3>
        <p className="text-sm text-muted-foreground mt-1">Track your 4 core competencies over time.</p>
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
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            
            {/* Target Reference Lines if Goal Exists */}
            {goal && (
              <>
                <ReferenceLine y={goal.target_listening} stroke={COLORS.listening} strokeDasharray="3 3" strokeOpacity={0.3} />
                <ReferenceLine y={goal.target_reading} stroke={COLORS.reading} strokeDasharray="3 3" strokeOpacity={0.3} />
                <ReferenceLine y={goal.target_writing} stroke={COLORS.writing} strokeDasharray="3 3" strokeOpacity={0.3} />
                <ReferenceLine y={goal.target_speaking} stroke={COLORS.speaking} strokeDasharray="3 3" strokeOpacity={0.3} />
              </>
            )}

            <Line 
              name="Listening"
              type="monotone" 
              dataKey="listening_score" 
              stroke={COLORS.listening} 
              strokeWidth={2.5}
              dot={{ fill: COLORS.listening, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: COLORS.listening, stroke: '#fff', strokeWidth: 2 }}
            />
            <Line 
              name="Reading"
              type="monotone" 
              dataKey="reading_score" 
              stroke={COLORS.reading} 
              strokeWidth={2.5}
              dot={{ fill: COLORS.reading, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: COLORS.reading, stroke: '#fff', strokeWidth: 2 }}
            />
            <Line 
              name="Writing"
              type="monotone" 
              dataKey="writing_score" 
              stroke={COLORS.writing} 
              strokeWidth={2.5}
              dot={{ fill: COLORS.writing, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: COLORS.writing, stroke: '#fff', strokeWidth: 2 }}
            />
            <Line 
              name="Speaking"
              type="monotone" 
              dataKey="speaking_score" 
              stroke={COLORS.speaking} 
              strokeWidth={2.5}
              dot={{ fill: COLORS.speaking, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: COLORS.speaking, stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
