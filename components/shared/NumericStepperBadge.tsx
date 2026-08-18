'use client'

import React from 'react'
import { Minus, Plus } from 'lucide-react'

interface NumericStepperBadgeProps {
  label?: string
  srLabel?: string
  value: number
  step?: number
  min?: number
  max?: number
  onChange: (value: number) => void
  accent?: 'primary' | 'accent' // emerald for progress/results, violet for editable targets
  formatAsInteger?: boolean
}

export function NumericStepperBadge({
  label,
  srLabel,
  value,
  step = 0.5,
  min = 0,
  max = 9,
  onChange,
  accent = 'primary',
  formatAsInteger = false,
}: NumericStepperBadgeProps) {
  const ringClass =
    accent === 'primary'
      ? 'ring-1 ring-primary/40 border-primary/30 text-primary bg-primary/10'
      : 'ring-1 ring-accent/40 border-accent/30 text-accent bg-accent/10'

  const formattedValue = formatAsInteger
    ? Math.round(value).toString()
    : value.toFixed(1)

  const ariaLabelName = srLabel || label || 'Score'

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-2 shadow-sm transition-all hover:border-border/80">
        <button
          type="button"
          aria-label={`Decrease ${ariaLabelName}`}
          onClick={() =>
            onChange(Math.max(min, Number((value - step).toFixed(2))))
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
        >
          <Minus size={14} />
        </button>

        <span
          className={`min-w-[4ch] rounded-lg px-3 py-1.5 text-center font-mono text-xl font-bold tabular-nums transition-all ${ringClass}`}
        >
          {formattedValue}
        </span>

        <button
          type="button"
          aria-label={`Increase ${ariaLabelName}`}
          onClick={() =>
            onChange(Math.min(max, Number((value + step).toFixed(2))))
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}
