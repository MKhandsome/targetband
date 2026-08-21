'use client'

import React, { useState, useTransition } from 'react'
import { format, parseISO } from 'date-fns'
import { deleteScoreAction } from '@/app/actions/scores'
import { toast } from 'sonner'
import { Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

export interface ScoreEntry {
  id: string
  test_date: string
  test_type: string
  listening_score: number | null
  reading_score: number | null
  writing_score: number | null
  speaking_score: number | null
  overall_score: number
  notes?: string | null
  user_id?: string
  created_at?: string
}

export type ScoreHistoryItem = ScoreEntry

export function ScoreHistoryTable({ scores }: { scores: ScoreEntry[] }) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this test score?')) return

    setDeletingId(id)
    startTransition(async () => {
      const result = await deleteScoreAction(id)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('Test score deleted.')
      }
      setDeletingId(null)
    })
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
      <table className="w-full text-left text-sm text-foreground">
        <thead className="bg-muted/40 border-b border-border text-muted-foreground uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4 font-medium">Test Date</th>
            <th className="px-6 py-4 font-medium">Type</th>
            <th className="px-4 py-4 font-medium text-center">L</th>
            <th className="px-4 py-4 font-medium text-center">R</th>
            <th className="px-4 py-4 font-medium text-center">W</th>
            <th className="px-4 py-4 font-medium text-center">S</th>
            <th className="px-6 py-4 font-bold text-primary text-center">Overall</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 bg-transparent">
          {scores.map((score) => {
            const isDeleting = isPending && deletingId === score.id
            const isExpanded = expandedId === score.id
            const hasNotes = Boolean(score.notes)

            return (
              <React.Fragment key={score.id}>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(parseISO(score.test_date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    {score.test_type.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-4 text-center font-mono">{score.listening_score !== null ? Number(score.listening_score).toFixed(1) : '-'}</td>
                  <td className="px-4 py-4 text-center font-mono">{score.reading_score !== null ? Number(score.reading_score).toFixed(1) : '-'}</td>
                  <td className="px-4 py-4 text-center font-mono">{score.writing_score !== null ? Number(score.writing_score).toFixed(1) : '-'}</td>
                  <td className="px-4 py-4 text-center font-mono">{score.speaking_score !== null ? Number(score.speaking_score).toFixed(1) : '-'}</td>
                  <td className="px-6 py-4 text-center font-mono font-bold text-primary">
                    {Number(score.overall_score).toFixed(1)}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                    {hasNotes && (
                      <button 
                        onClick={() => toggleExpand(score.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Toggle Notes"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4 inline" /> : <ChevronDown className="h-4 w-4 inline" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(score.id)}
                      disabled={isPending}
                      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      title="Delete Entry"
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 inline animate-spin" /> : <Trash2 className="h-4 w-4 inline" />}
                    </button>
                  </td>
                </tr>
                {isExpanded && hasNotes && (
                  <tr className="bg-muted/20">
                    <td colSpan={8} className="px-6 py-4 text-sm text-muted-foreground border-t border-border/50">
                      <div className="flex gap-2">
                        <span className="font-semibold text-foreground">Reflection:</span>
                        <p className="italic">{score.notes}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
