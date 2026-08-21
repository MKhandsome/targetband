# Milestone 1: Theme Tokens & Dark/Light Mode Parity — Explorer M1-1 Analysis

**Scope**: Global CSS (`app/globals.css`) & Dashboard Layout Components (`ScoreHistoryTable.tsx`, `GoalProgressCard.tsx`, `Navbar.tsx`, `ActivityHeatmap.tsx`).  
**Investigated by**: Explorer M1-1  
**Target Execution**: Worker M1-1  

---

## 1. Executive Summary

Milestone 1 focuses on eliminating hardcoded dark colors (such as `bg-[#171717]`), hardcoded white-alpha colors (such as `border-white/10`, `bg-white/10`, `bg-white/5`, `ring-white/10`, and `hover:bg-white/[0.03]`), and replacing them with semantic Tailwind CSS variables defined in `@theme` and `:root` / `.dark`.

All findings in this report include exact line numbers, verified existing code, rationale for change, and exact replacement code blocks ready for drop-in application by Worker M1-1.

---

## 2. File-by-File Audit & Exact Replacement Specifications

### File 1: `app/globals.css`
- **Absolute Path**: `c:\Users\Minh Khang\Downloads\targetband\app\globals.css`
- **Target Section**: `@layer components` (Lines 118–143)

#### Observations & Root Causes:
1. **Lines 120–122**:
   ```css
   .btn-ghost, 
   .btn-outline,
   a.border.border-white\/10,
   button.border.border-white\/10 {
     @apply !transition-all !duration-200 !ease-out hover:!border-white/30 hover:!bg-white/[0.07] active:!scale-[0.98] active:!translate-y-0;
   }
   ```
   - *Problem*: In light mode (`--background: 0 0% 100%`), `hover:!border-white/30` and `hover:!bg-white/[0.07]` turn button borders and backgrounds to faint white on a white page, causing them to completely wash out or disappear.
   - *Fix*: Update selectors to include `a.border.border-border, button.border.border-border`, and use semantic hover tokens `hover:!border-foreground/20 hover:!bg-muted/50`.
2. **Lines 135–138**:
   ```css
   .card-hover,
   .bg-card {
     @apply transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/40;
   }
   ```
   - *Problem*: `hover:border-white/20` turns card borders white when hovered on light mode surfaces. `hover:shadow-black/40` produces a jarring, pitch-black drop shadow on white cards.
   - *Fix*: Replace `hover:border-white/20` with `hover:border-foreground/20` (or `hover:border-border`) and adjust shadow to `hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40`.
3. **Lines 140–142**:
   ```css
   tbody tr {
     @apply transition-colors duration-150 ease-in-out hover:bg-white/[0.03];
   }
   ```
   - *Problem*: `hover:bg-white/[0.03]` adds 3% white over pure white table rows in light mode (completely invisible).
   - *Fix*: Replace `hover:bg-white/[0.03]` with `hover:bg-muted/40`.

#### Exact Line-by-Line Replacement for Worker M1-1:

**Target Lines in `app/globals.css`**: Lines 118–143
```css
<<<< BEFORE (Lines 118-143)
  .btn-ghost, 
  .btn-outline,
  a.border.border-white\/10,
  button.border.border-white\/10 {
    @apply !transition-all !duration-200 !ease-out hover:!border-white/30 hover:!bg-white/[0.07] active:!scale-[0.98] active:!translate-y-0;
  }

  a:hover svg.lucide-arrow-right,
  button:hover svg.lucide-arrow-right {
    transform: translateX(4px) !important;
  }
  
  a svg.lucide-arrow-right,
  button svg.lucide-arrow-right {
    transition: transform 0.2s ease-out !important;
  }
  
  .card-hover,
  .bg-card {
    @apply transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/40;
  }
  
  tbody tr {
    @apply transition-colors duration-150 ease-in-out hover:bg-white/[0.03];
  }
==== AFTER
  .btn-ghost, 
  .btn-outline,
  a.border.border-border,
  button.border.border-border,
  a.border.border-white\/10,
  button.border.border-white\/10 {
    @apply !transition-all !duration-200 !ease-out hover:!border-foreground/20 hover:!bg-muted/50 active:!scale-[0.98] active:!translate-y-0;
  }

  a:hover svg.lucide-arrow-right,
  button:hover svg.lucide-arrow-right {
    transform: translateX(4px) !important;
  }
  
  a svg.lucide-arrow-right,
  button svg.lucide-arrow-right {
    transition: transform 0.2s ease-out !important;
  }
  
  .card-hover,
  .bg-card {
    @apply transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/40;
  }
  
  tbody tr {
    @apply transition-colors duration-150 ease-in-out hover:bg-muted/40;
  }
>>>>
```

---

### File 2: `app/(private)/dashboard/history/ScoreHistoryTable.tsx`
- **Absolute Path**: `c:\Users\Minh Khang\Downloads\targetband\app\(private)\dashboard\history\ScoreHistoryTable.tsx`
- **Target Changes**: Type definition & theme token replacements

#### Observations & Root Causes:
1. **Line 9**: `export function ScoreHistoryTable({ scores }: { scores: any[] })` uses `any[]`, which bypasses TypeScript type checks and causes lint warnings.
   - *Fix*: Define `ScoreHistoryItem` and `ScoreHistoryTableProps` interfaces.
2. **Line 34**: `<div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-card shadow-sm">`
   - *Problem*: `border-white/10` is an invisible white border on light mode cards.
   - *Fix*: Replace `border-white/10` with `border-border`.
3. **Line 36**: `<thead className="bg-[#171717] border-b border-white/10 text-muted-foreground uppercase text-xs tracking-wider">`
   - *Problem*: `bg-[#171717]` forces a pitch-black table header even when user is in light mode. `border-white/10` has 0 contrast against light backgrounds.
   - *Fix*: Replace `bg-[#171717] border-b border-white/10` with `bg-muted/40 border-b border-border`.
4. **Line 48**: `<tbody className="divide-y divide-white/5 bg-transparent">`
   - *Problem*: `divide-white/5` dividers are invisible in light mode.
   - *Fix*: Replace with `divide-y divide-border/50 bg-transparent`.
5. **Line 92**: `<td colSpan={8} className="px-6 py-4 text-sm text-muted-foreground border-t border-white/5">`
   - *Problem*: `border-t border-white/5` accordion row separator is invisible in light mode.
   - *Fix*: Replace with `border-t border-border/50`.

#### Exact Line-by-Line Replacement for Worker M1-1:

**Target File**: `app/(private)/dashboard/history/ScoreHistoryTable.tsx`

```tsx
<<<< BEFORE (Lines 9-13)
export function ScoreHistoryTable({ scores }: { scores: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
==== AFTER
export interface ScoreHistoryItem {
  id: string
  test_date: string
  test_type: string
  listening_score: number | null
  reading_score: number | null
  writing_score: number | null
  speaking_score: number | null
  overall_score: number
  notes?: string | null
  listening_raw?: number | null
  reading_raw?: number | null
  created_at?: string
  user_id?: string
}

interface ScoreHistoryTableProps {
  scores: ScoreHistoryItem[]
}

export function ScoreHistoryTable({ scores }: ScoreHistoryTableProps) {
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
>>>>
```

```tsx
<<<< BEFORE (Lines 34-48)
    <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-card shadow-sm">
      <table className="w-full text-left text-sm text-foreground">
        <thead className="bg-[#171717] border-b border-white/10 text-muted-foreground uppercase text-xs tracking-wider">
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
        <tbody className="divide-y divide-white/5 bg-transparent">
==== AFTER
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
>>>>
```

```tsx
<<<< BEFORE (Lines 91-93)
                {isExpanded && hasNotes && (
                  <tr className="bg-muted/20">
                    <td colSpan={8} className="px-6 py-4 text-sm text-muted-foreground border-t border-white/5">
==== AFTER
                {isExpanded && hasNotes && (
                  <tr className="bg-muted/20">
                    <td colSpan={8} className="px-6 py-4 text-sm text-muted-foreground border-t border-border/50">
>>>>
```

---

### File 3: `components/dashboard/GoalProgressCard.tsx`
- **Absolute Path**: `c:\Users\Minh Khang\Downloads\targetband\components\dashboard\GoalProgressCard.tsx`
- **Target Changes**: Progress track background, card borders, badge tokens

#### Observations & Root Causes:
1. **Line 40**: `<div className="h-2 w-full overflow-hidden rounded-full bg-white/10">`
   - *Problem*: Progress bar background track is `bg-white/10`. On light mode cards (`#ffffff`), 10% white on white is completely invisible, leaving users unable to see the total track length.
   - *Fix*: Replace `bg-white/10` with `bg-muted`.
2. **Line 53**: `<div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex flex-col justify-center items-center h-full min-h-[300px] text-center">`
   - *Problem*: `border-white/10` on empty state card is invisible in light mode.
   - *Fix*: Replace `border-white/10` with `border-border`.
3. **Line 84**: `<div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex flex-col h-full">`
   - *Problem*: `border-white/10` on filled state card is invisible in light mode.
   - *Fix*: Replace `border-white/10` with `border-border`.
4. **Line 90**: `<div className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-white/10">`
   - *Problem*: Badge background `bg-white/5` and border `border-white/10` wash out completely on white card background.
   - *Fix*: Replace with `bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-border`.

#### Exact Line-by-Line Replacement for Worker M1-1:

**Target File**: `components/dashboard/GoalProgressCard.tsx`

```tsx
<<<< BEFORE (Lines 40-46)
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${achieved ? 'bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-primary/70'}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
==== AFTER
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div 
          className={`h-full transition-all duration-1000 ease-out rounded-full ${achieved ? 'bg-primary shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-primary/70'}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
>>>>
```

```tsx
<<<< BEFORE (Lines 52-54)
  if (!goal) {
    return (
      <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex flex-col justify-center items-center h-full min-h-[300px] text-center">
==== AFTER
  if (!goal) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-center items-center h-full min-h-[300px] text-center">
>>>>
```

```tsx
<<<< BEFORE (Lines 84-94)
    <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Current Progress
        </h3>
        {daysRemaining !== null && (
          <div className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-white/10">
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
          </div>
        )}
      </div>
==== AFTER
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Current Progress
        </h3>
        {daysRemaining !== null && (
          <div className="rounded-full bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-border">
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left
          </div>
        )}
      </div>
>>>>
```

---

### File 4: `components/Navbar.tsx`
- **Absolute Path**: `c:\Users\Minh Khang\Downloads\targetband\components\Navbar.tsx`
- **Target Changes**: Tools glassmorphism dropdown menu ring token

#### Observations & Root Causes:
1. **Line 103**: `<div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden p-2 flex flex-col gap-1 ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">`
   - *Problem*: `ring-1 ring-white/10` is a white ring designed for dark mode backgrounds. On light mode, white ring on a light card has no contrast or creates visual artifacts.
   - *Fix*: Replace `ring-white/10` with `ring-border/50` or `ring-border`.

#### Exact Line-by-Line Replacement for Worker M1-1:

**Target File**: `components/Navbar.tsx`

```tsx
<<<< BEFORE (Lines 102-104)
                {isToolsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64">
                    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden p-2 flex flex-col gap-1 ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
==== AFTER
                {isToolsOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-64">
                    <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden p-2 flex flex-col gap-1 ring-1 ring-border/50 animate-in fade-in zoom-in-95 duration-200">
>>>>
```

---

### Supplementary Audit Item: `components/dashboard/ActivityHeatmap.tsx`
- **Absolute Path**: `c:\Users\Minh Khang\Downloads\targetband\components\dashboard\ActivityHeatmap.tsx`
- **Line 43**:
  ```tsx
  <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
  ```
  - *Observation*: `scrollbar-thumb-white/10` uses hardcoded white alpha for scrollbar thumb.
  - *Recommendation for Worker*: Change `scrollbar-thumb-white/10` to `scrollbar-thumb-border` or `scrollbar-thumb-muted-foreground/20` so the scrollbar track remains visible in light mode.

---

## 3. Summary Mapping Table

| File | Line(s) | Current Hardcoded / Suboptimal Token | Semantic Replacement |
|---|---|---|---|
| `app/globals.css` | 120–122 | `hover:!border-white/30 hover:!bg-white/[0.07]` | `hover:!border-foreground/20 hover:!bg-muted/50` |
| `app/globals.css` | 137 | `hover:border-white/20 hover:shadow-black/40` | `hover:border-foreground/20 hover:shadow-black/5 dark:hover:shadow-black/40` |
| `app/globals.css` | 141 | `hover:bg-white/[0.03]` | `hover:bg-muted/40` |
| `ScoreHistoryTable.tsx` | 9 | `scores: any[]` | `scores: ScoreHistoryItem[]` |
| `ScoreHistoryTable.tsx` | 34 | `border border-white/10` | `border border-border` |
| `ScoreHistoryTable.tsx` | 36 | `bg-[#171717] border-b border-white/10` | `bg-muted/40 border-b border-border` |
| `ScoreHistoryTable.tsx` | 48 | `divide-white/5` | `divide-border/50` |
| `ScoreHistoryTable.tsx` | 92 | `border-t border-white/5` | `border-t border-border/50` |
| `GoalProgressCard.tsx` | 40 | `bg-white/10` (progress track) | `bg-muted` |
| `GoalProgressCard.tsx` | 53, 84 | `border border-white/10` (card border) | `border border-border` |
| `GoalProgressCard.tsx` | 90 | `bg-white/5 ... border border-white/10` (badge) | `bg-muted/30 ... border border-border` |
| `Navbar.tsx` | 103 | `ring-1 ring-white/10` (dropdown ring) | `ring-1 ring-border/50` |
| `ActivityHeatmap.tsx` | 43 | `scrollbar-thumb-white/10` | `scrollbar-thumb-border` |

---

## 4. Verification Checkpoints for Implementer

1. **TypeScript Type Safety**: Run `npx tsc --noEmit` to verify `ScoreHistoryTableProps` conforms across `app/(private)/dashboard/history/page.tsx` and `ScoreHistoryTable.tsx`.
2. **Light Mode UI Verification**:
   - Inspect table header (`<thead>`): background should be soft neutral (`bg-muted/40`) rather than pitch black `#171717`.
   - Inspect `GoalProgressCard`: progress bar track should be visible light gray (`bg-muted`), and the "X days left" badge should have crisp border.
   - Inspect `Navbar`: tools dropdown ring should seamlessly blend with `--border` in both themes.
   - Hover over cards (`.bg-card`): borders should darken subtly with `hover:border-foreground/20` rather than turning white.
