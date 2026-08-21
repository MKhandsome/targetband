# Handoff Report — Explorer M1-1 (Milestone 1)

## 1. Observation

A full code-level audit was conducted across the target files for Milestone 1 (Global CSS and Dashboard Layout Components).

### Directly Observed Code Locations & Exact Snippets:

1. **`app/globals.css`** (Lines 118–143):
   ```css
   118:   .btn-ghost, 
   119:   .btn-outline,
   120:   a.border.border-white\/10,
   121:   button.border.border-white\/10 {
   122:     @apply !transition-all !duration-200 !ease-out hover:!border-white/30 hover:!bg-white/[0.07] active:!scale-[0.98] active:!translate-y-0;
   123:   }
   ...
   135:   .card-hover,
   136:   .bg-card {
   137:     @apply transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:shadow-xl hover:shadow-black/40;
   138:   }
   139:   
   140:   tbody tr {
   141:     @apply transition-colors duration-150 ease-in-out hover:bg-white/[0.03];
   142:   }
   ```

2. **`app/(private)/dashboard/history/ScoreHistoryTable.tsx`** (Lines 9, 34, 36, 48, 92):
   ```tsx
   9: export function ScoreHistoryTable({ scores }: { scores: any[] }) {
   ...
   34:     <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-card shadow-sm">
   ...
   36:         <thead className="bg-[#171717] border-b border-white/10 text-muted-foreground uppercase text-xs tracking-wider">
   ...
   48:         <tbody className="divide-y divide-white/5 bg-transparent">
   ...
   92:                     <td colSpan={8} className="px-6 py-4 text-sm text-muted-foreground border-t border-white/5">
   ```

3. **`components/dashboard/GoalProgressCard.tsx`** (Lines 40, 53, 84, 90):
   ```tsx
   40:       <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
   ...
   53:       <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex flex-col justify-center items-center h-full min-h-[300px] text-center">
   ...
   84:     <div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm flex flex-col h-full">
   ...
   90:           <div className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-white/10">
   ```

4. **`components/Navbar.tsx`** (Line 103):
   ```tsx
   103:                     <div className="rounded-xl border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden p-2 flex flex-col gap-1 ring-1 ring-white/10 animate-in fade-in zoom-in-95 duration-200">
   ```

5. **`components/dashboard/ActivityHeatmap.tsx`** (Line 43):
   ```tsx
   43:       <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
   ```

---

## 2. Logic Chain

1. **Premise 1 (Light Theme Invisibility)**: In light mode, the root background is pure white (`--background: 0 0% 100%`, `--card: 0 0% 100%`). Any element styled with `border-white/10`, `bg-white/10`, `bg-white/5`, `hover:border-white/20`, or `hover:bg-white/[0.03]` blends into `#ffffff` with 0 perceptible contrast.
2. **Premise 2 (Dark Hex Header Inversion)**: `bg-[#171717]` in `ScoreHistoryTable.tsx` hardcodes a dark background onto table headers regardless of whether the user is in light or dark mode, creating an unstyled pitch-black rectangle inside a light dashboard.
3. **Premise 3 (CSS Variable Mapping)**: Tailwind v4 theme variables `--color-border`, `--color-muted`, `--color-foreground`, and `--color-card` are already defined in `@theme` and `:root` / `.dark`. Using `border-border`, `bg-muted`, `hover:bg-muted/40`, and `hover:border-foreground/20` provides automatic, responsive adaptation across both themes.
4. **Premise 4 (TypeScript Rigor)**: `ScoreHistoryTable` accepts `scores: any[]`, which bypasses compiler validation and risks runtime issues if score fields change. Typing it with `ScoreHistoryItem[]` guarantees type consistency.

---

## 3. Caveats

- **Out of Scope for M1-1**: Other Milestone 1 files (`TargetForm.tsx`, `AnalyticsChart.tsx`, `ScoreTrendChart.tsx`, legal pages `cookies/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `about/page.tsx`) are assigned to parallel explorers M1-2 and M1-3.
- **Scrollbar Styling**: `scrollbar-thumb-white/10` in `ActivityHeatmap.tsx` is an optional polish item flagged in analysis for the Worker's attention.

---

## 4. Conclusion

Worker M1-1 should execute the exact replacements documented in `analysis.md`:
1. In `app/globals.css`: Replace white-alpha hover styles on outline buttons, cards, and table rows with `hover:!border-foreground/20 hover:!bg-muted/50`, `hover:border-foreground/20 hover:shadow-black/5 dark:hover:shadow-black/40`, and `hover:bg-muted/40`.
2. In `app/(private)/dashboard/history/ScoreHistoryTable.tsx`: Replace `any[]` with `ScoreHistoryItem[]`, replace `bg-[#171717]` with `bg-muted/40`, replace `border-white/10` with `border-border`, and replace `divide-white/5` and `border-white/5` with `divide-border/50` and `border-border/50`.
3. In `components/dashboard/GoalProgressCard.tsx`: Replace `bg-white/10` track with `bg-muted`, card `border-white/10` with `border-border`, and badge `bg-white/5 border-white/10` with `bg-muted/30 border-border`.
4. In `components/Navbar.tsx`: Replace `ring-1 ring-white/10` with `ring-1 ring-border/50`.

---

## 5. Verification Method

To independently verify the implementation:
1. **Type Check**: Run `npx tsc --noEmit` to confirm zero TypeScript type errors.
2. **Lint Check**: Run `npm run lint` to verify zero ESLint errors/warnings.
3. **Build Check**: Run `npm run build` to confirm clean production bundle compilation.
4. **Visual Inspection**:
   - Open `/dashboard/history` in Light Mode: the table header must render in soft gray (`bg-muted/40`) with crisp borders.
   - Open `/dashboard` in Light Mode: the `GoalProgressCard` progress bar background track must be visible gray (`bg-muted`), and card borders must be crisp `--border`.
   - Hover over cards and table rows in both Light and Dark mode to confirm subtle hover feedback.
