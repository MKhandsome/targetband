# Handoff Report: Milestone 1 — Theme Tokens & Dark/Light Mode Parity

## 1. Observation

All 12 assigned theme token and color parity tasks have been applied across the codebase:

1. **`app/globals.css`** (Lines 118–143):
   - Replaced `border-white\/10` with `border-border`.
   - Replaced `hover:!border-white/30 hover:!bg-white/[0.07]` with `hover:!border-foreground/20 hover:!bg-muted/40`.
   - Replaced `hover:border-white/20` with `hover:border-foreground/20`.
   - Replaced `hover:bg-white/[0.03]` with `hover:bg-muted/40`.

2. **`app/(private)/dashboard/history/ScoreHistoryTable.tsx`**:
   - Added strongly-typed `export interface ScoreEntry` (and alias `ScoreHistoryItem`) replacing `any[]`.
   - Replaced table container `border border-white/10` with `border border-border`.
   - Replaced `thead` `bg-[#171717] border-b border-white/10` with `bg-muted/40 border-b border-border`.
   - Replaced `divide-white/5` and `border-white/5` with `divide-border/50` and `border-border/50`.

3. **`components/dashboard/GoalProgressCard.tsx`**:
   - Replaced progress bar background track `bg-white/10` with `bg-muted`.
   - Replaced card borders `border border-white/10` with `border border-border`.
   - Replaced days-remaining badge `bg-white/5 border border-white/10` with `bg-muted/30 border border-border`.

4. **`components/Navbar.tsx`**:
   - Replaced dropdown container `ring-1 ring-white/10` with `ring-1 ring-border`.

5. **`components/dashboard/ActivityHeatmap.tsx`**:
   - Replaced `scrollbar-thumb-white/10` with `scrollbar-thumb-border`.

6. **`app/(private)/dashboard/log/page.tsx`**:
   - Replaced header panel `bg-[#111]` (line 104) and footer panel `bg-[#111]` (line 212) with `bg-muted/30 border border-border`.
   - Replaced card outer border `border-border/50` with `border-border`.

7. **`app/(private)/dashboard/targets/TargetForm.tsx`**:
   - Added `export interface TargetGoal` and `export interface TargetFormProps`, typing `initialGoal?: TargetGoal | null`.
   - Replaced card border `border border-white/10` with `border border-border`.
   - Removed inline `style={{ colorScheme: 'dark' }}` from native date input.

8. **`app/(private)/dashboard/analytics/page.tsx`**:
   - Replaced banner cards `border border-white/10` with `border border-border` on lines 139 and 160.

9. **`app/cookies/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`**:
   - Replaced title gradient `from-white via-zinc-200 to-zinc-400` with `from-foreground to-foreground/70`.
   - Replaced `border-white/10` with `border-border`.
   - Replaced `text-zinc-400` with `text-muted-foreground`.
   - Replaced all body and list `text-zinc-300` with `text-muted-foreground`.

10. **`app/not-found.tsx`**:
    - Replaced 404 number gradient `from-white to-white/60` with `from-foreground to-foreground/50`.

11. **`app/about/page.tsx`**:
    - Replaced card borders `border border-white/10` on lines 27 & 37 with `border border-border`.

12. **`components/tools/ConverterTool.tsx`**:
    - Replaced `text-white` on active test type buttons (lines 40, 50, 60) with `text-accent-foreground`.

---

## 2. Logic Chain

1. **Light/Dark Mode Parity**: In light mode, backgrounds are `#ffffff` (`hsl(0 0% 100%)`). Using white-alpha utilities (`border-white/10`, `bg-white/10`, `from-white`, `text-zinc-300`) leads to zero or poor contrast (~1.3:1) against white backgrounds.
2. **Semantic Tokens**: By replacing these hardcoded classes with Tailwind CSS variables (`border-border`, `bg-muted`, `bg-muted/30`, `text-muted-foreground`, `from-foreground`, `text-accent-foreground`), elements automatically adapt to both light and dark themes using HSL channel variables defined in `globals.css`.
3. **Hex Background Elimination**: Replacing hardcoded `#171717` and `#111` with `bg-muted/40` and `bg-muted/30` prevents pitch-black rectangular blocks inside light-mode dashboard tables and forms.
4. **TypeScript Safety**: Defining `ScoreEntry` / `ScoreHistoryItem` and `TargetGoal` removes `any` usages and enforces type consistency across server page data fetching and client component props.

---

## 3. Caveats

- **Milestone 2 Scope Exclusions**: Recharts tooltip and chart styling in `AnalyticsChart.tsx` and `ScoreTrendChart.tsx` are specifically allocated to Milestone 2 (Recharts & Responsive Layout).
- **Form Switch Toggle Styling**: The toggle switch in `log/page.tsx` uses custom pseudo-element classes (`after:bg-white after:border-gray-300`) to render the physical toggle knob, which is intentional and distinct from page background/border tokens.

---

## 4. Conclusion

Milestone 1 is 100% complete and cleanly implemented with minimal diffs. All 12 requested items have been replaced with semantic Tailwind tokens and TypeScript interfaces.

---

## 5. Verification Method

To verify the changes:

1. **Ripgrep Checks**:
   - `rg "border-white/10" app/about app/cookies app/privacy app/terms app/\(private\)/dashboard/history app/\(private\)/dashboard/targets app/\(private\)/dashboard/analytics` -> 0 matches.
   - `rg "from-white" app/` -> 0 matches.
   - `rg "text-zinc-(300|400)" app/` -> 0 matches.
   - `rg "bg-\[#(111|171717)\]" app/` -> 0 matches.
   - `rg "colorScheme" app/` -> 0 matches.
   - `rg "text-white" components/tools/ConverterTool.tsx` -> 0 matches.
2. **Type & Lint Checks**:
   - `npx tsc --noEmit`
   - `npm run lint`
