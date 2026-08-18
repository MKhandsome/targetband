'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { upsertTargetGoalAction } from '@/app/actions/targets'
import { NumericStepperBadge } from '@/components/shared/NumericStepperBadge'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function TargetManagementPage({
  initialGoal
}: {
  initialGoal: any
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [targets, setTargets] = useState({
    overall: initialGoal?.target_overall || 7.0,
    listening: initialGoal?.target_listening || 7.0,
    reading: initialGoal?.target_reading || 7.0,
    writing: initialGoal?.target_writing || 6.5,
    speaking: initialGoal?.target_speaking || 6.5,
  })

  const [targetDate, setTargetDate] = useState(() => {
    if (initialGoal?.target_date) return initialGoal.target_date
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d.toISOString().split('T')[0]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const formData = {
      target_overall: targets.overall,
      target_listening: targets.listening,
      target_reading: targets.reading,
      target_writing: targets.writing,
      target_speaking: targets.speaking,
      target_date: targetDate,
    }

    startTransition(async () => {
      const result = await upsertTargetGoalAction(formData)
      
      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.dismiss()
      toast.success("Target goal saved successfully!")
      router.push('/dashboard')
    })
  }

  const updateTarget = (key: keyof typeof targets, value: number) => {
    setTargets(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-8 animate-fade-in-scale max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Target Management</h1>
        <p className="text-muted-foreground mt-2">
          Define your desired IELTS band scores and set a target test date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-card p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="text-primary">01.</span> Set Your Goal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">Overall Band Target</label>
                <NumericStepperBadge 
                  label="Overall"
                  value={targets.overall} 
                  onChange={(v) => updateTarget('overall', v)} 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Target Test Date</label>
                <input
                  type="date"
                  required
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
            </div>

            <div className="space-y-6 p-6 rounded-xl bg-card border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-4">Individual Skill Targets</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Listening</label>
                  <NumericStepperBadge label="L" value={targets.listening} onChange={(v) => updateTarget('listening', v)} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Reading</label>
                  <NumericStepperBadge label="R" value={targets.reading} onChange={(v) => updateTarget('reading', v)} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Writing</label>
                  <NumericStepperBadge label="W" value={targets.writing} onChange={(v) => updateTarget('writing', v)} />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Speaking</label>
                  <NumericStepperBadge label="S" value={targets.speaking} onChange={(v) => updateTarget('speaking', v)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 py-3 text-sm font-bold text-accent-foreground shadow-md shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving Target...
              </>
            ) : (
              'Save Target Goal'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
