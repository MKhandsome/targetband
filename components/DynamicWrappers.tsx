"use client"

import dynamic from 'next/dynamic'

export const ScoreTrendChart = dynamic(
  () => import('@/components/dashboard/ScoreTrendChart').then(mod => mod.ScoreTrendChart),
  { ssr: false }
)

export const AnalyticsChart = dynamic(
  () => import('@/app/(private)/dashboard/analytics/AnalyticsChart').then(mod => mod.AnalyticsChart),
  { ssr: false }
)

export const CalculatorTool = dynamic(
  () => import('@/components/tools/CalculatorTool').then(mod => mod.CalculatorTool),
  { ssr: false }
)

export const ConverterTool = dynamic(
  () => import('@/components/tools/ConverterTool').then(mod => mod.ConverterTool),
  { ssr: false }
)

export const GapCalculatorTool = dynamic(
  () => import('@/components/tools/GapCalculatorTool').then(mod => mod.GapCalculatorTool),
  { ssr: false }
)
