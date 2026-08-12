'use client'

import { useState } from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createScoreEntry } from './actions'
import { calculateOverallBand, SkillScores } from '@/lib/ielts/overallScoreCalculator'
import { NumericStepperBadge } from '@/components/shared/NumericStepperBadge'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function ScoreLoggerPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form State
  const [testDate, setTestDate] = useState(() => new Date().toISOString().split('T')[0])
  const [testType, setTestType] = useState<'practice_mock' | 'academic' | 'general_training'>('practice_mock')
  
  const [scores, setScores] = useState<SkillScores>({
    listening: 6.5,
    reading: 6.5,
    writing: 6.0,
    speaking: 6.0
  })

  const [listeningRaw, setListeningRaw] = useState<number | ''>('')
  const [readingRaw, setReadingRaw] = useState<number | ''>('')
  const [notes, setNotes] = useState('')

  const handleScoreChange = (skill: keyof SkillScores, value: number) => {
    setScores(prev => ({ ...prev, [skill]: value }))
  }

  const overallBand = calculateOverallBand(scores)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      test_date: testDate,
      test_type: testType,
      listening_band: scores.listening,
      reading_band: scores.reading,
      writing_band: scores.writing,
      speaking_band: scores.speaking,
      listening_raw: listeningRaw === '' ? undefined : Number(listeningRaw),
      reading_raw: readingRaw === '' ? undefined : Number(readingRaw),
      notes: notes.trim() === '' ? undefined : notes.trim(),
    }

    startTransition(async () => {
      const result = await createScoreEntry(formData)
      
      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success("Test score logged successfully!")
      router.push('/dashboard')
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Log Practice Score</h1>
        <p className="text-muted-foreground mt-2">
          Record your latest test results to track your progress over time.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border border-border/50 rounded-2xl shadow-lg overflow-hidden">
        
        {/* Top Section: Date & Type */}
        <div className="p-6 md:p-8 border-b border-border/50 bg-[#111] grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Test Date</label>
            <input 
              type="date"
              required
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Test Type</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value as any)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <option value="practice_mock">Practice / Mock Test</option>
              <option value="academic">Official IELTS (Academic)</option>
              <option value="general_training">Official IELTS (General)</option>
            </select>
          </div>
        </div>

        {/* Middle Section: Scores */}
        <div className="p-6 md:p-8 space-y-10">
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Band Scores
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <NumericStepperBadge label="Listening" value={scores.listening} onChange={(v) => handleScoreChange('listening', v)} />
              <NumericStepperBadge label="Reading" value={scores.reading} onChange={(v) => handleScoreChange('reading', v)} />
              <NumericStepperBadge label="Writing" value={scores.writing} onChange={(v) => handleScoreChange('writing', v)} />
              <NumericStepperBadge label="Speaking" value={scores.speaking} onChange={(v) => handleScoreChange('speaking', v)} />
            </div>
          </div>

          <div className="pt-8 border-t border-border/50">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="bg-primary/20 text-primary w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Optional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Listening Raw Score (0-40)</label>
                <input 
                  type="number"
                  min="0"
                  max="40"
                  value={listeningRaw}
                  onChange={(e) => setListeningRaw(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 32"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Reading Raw Score (0-40)</label>
                <input 
                  type="number"
                  min="0"
                  max="40"
                  value={readingRaw}
                  onChange={(e) => setReadingRaw(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 35"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Reflection & Notes</label>
              <textarea 
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What went well? What do you need to improve next time?"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Summary & Submit */}
        <div className="p-6 md:p-8 border-t border-border/50 bg-[#111] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground text-right">
              Calculated<br/>Overall Band
            </div>
            <div className="flex items-center justify-center h-16 min-w-[4ch] rounded-xl border border-primary/30 bg-primary/10 px-4 ring-1 ring-primary/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="text-3xl font-mono font-bold tabular-nums text-primary">
                {overallBand.toFixed(1)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 py-3 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Entry...
              </>
            ) : (
              "Save Test Score"
            )}
          </button>
        </div>

      </form>
    </div>
  )
}
