# Handoff Report — Explorer M1-3: Public & Legal Pages, 404 Page, and Tools

## 1. Observation

Direct code inspections and ripgrep searches across the target files identified the following exact occurrences of hardcoded theme values and contrast anti-patterns:

### A. Legal Pages Heading & Body Text
1. **`app/cookies/page.tsx`**:
   - Line 22: `<h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">`
   - Line 26: `<div className="flex items-center gap-2 text-sm font-medium text-zinc-400">`
   - Line 52: `<div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">`
   - Lines 61, 88, 99: `<p className="text-zinc-300 leading-relaxed text-sm sm:text-base">`

2. **`app/privacy/page.tsx`**:
   - Line 23: `<h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">`
   - Line 27: `<div className="flex items-center gap-2 text-sm font-medium text-zinc-400">`
   - Line 55: `<div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">`
   - Lines 64, 75, 100, 135, 146, 166: `<p className="text-zinc-300 leading-relaxed text-sm sm:text-base">` (or with `mb-4`)
   - Lines 79, 83, 87, 104, 108, 112: `<li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">`

3. **`app/terms/page.tsx`**:
   - Line 22: `<h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">`
   - Line 26: `<div className="flex items-center gap-2 text-sm font-medium text-zinc-400">`
   - Line 53: `<div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">`
   - Lines 62, 73, 93, 104, 125: `<p className="text-zinc-300 leading-relaxed text-sm sm:text-base">` (or with `mb-4`)
   - Lines 108, 112: `<li className="flex items-start gap-3 text-zinc-300 text-sm sm:text-base leading-relaxed">`

### B. 404 Page Heading Gradient
1. **`app/not-found.tsx`**:
   - Line 20: `className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] relative"`

### C. About Page Border Tokens
1. **`app/about/page.tsx`**:
   - Line 27: `<div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-4 hover:border-emerald-500/30 transition-colors">`
   - Line 37: `<div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-4 hover:border-violet-500/30 transition-colors">`

### D. Tools Button Text Tokens
1. **`components/tools/ConverterTool.tsx`**:
   - Line 40: `testType === "listening" ? "bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]" : ...`
   - Line 50: `testType === "reading_academic" ? "bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]" : ...`
   - Line 60: `testType === "reading_general" ? "bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]" : ...`

---

## 2. Logic Chain

1. **Premise 1 (Text Gradients against Light Background)**: As observed in Observation A.1, A.2, A.3, and B.1, the gradients `from-white via-zinc-200 to-zinc-400` and `from-white to-white/60` rely on white and light-zinc text clipping. In Light Mode, where `body` has `bg-background` (`#ffffff`), the text blends completely into the background, rendering titles and the "404" indicator illegible.
2. **Deduction 1 (Semantic Gradient Tokens)**: Replacing `from-white via-zinc-200 to-zinc-400` with `from-foreground to-foreground/70` in legal page titles and `from-foreground to-foreground/50` in `not-found.tsx` maps text color to `--foreground` (`hsl(0 0% 5%)` in Light Mode and `hsl(0 0% 98%)` in Dark Mode), creating crisp contrast across both themes.
3. **Premise 2 (Body Text Contrast)**: Hardcoded `text-zinc-300` and `text-zinc-400` have a contrast ratio of ~1.3:1 against a `#ffffff` background, violating WCAG AA guidelines.
4. **Deduction 2 (Body Token Replacement)**: Replacing `text-zinc-300` and `text-zinc-400` with `text-muted-foreground` resolves contrast issues across both themes.
5. **Premise 3 (White Alpha Borders on Light Background)**: As observed in Observation A.1, A.2, A.3, and C.1, `border-white/10` against `#ffffff` light background is invisible.
6. **Deduction 3 (Border Token Replacement)**: Replacing `border-white/10` with `border-border` links borders to CSS `--border` (`hsl(0 0% 90%)` in Light, `hsl(0 0% 14.9%)` in Dark), rendering clear card outlines.
7. **Premise 4 (Tool Button Foreground Token)**: `ConverterTool.tsx` sets button background to `bg-accent` (`hsl(var(--accent))`), but hardcodes `text-white`.
8. **Deduction 4 (Paired Semantic Token)**: Replacing `text-white` with `text-accent-foreground` provides semantic consistency with `app/globals.css` where `--accent-foreground` is explicitly configured.

---

## 3. Caveats

- **Scope Boundary**: Other components (such as `ScoreTrendChart.tsx`, `ScoreHistoryTable.tsx`, `TargetForm.tsx`, `globals.css`) are assigned to peer explorers M1-1 and M1-2 and are excluded here to prevent merge conflicts.
- **Brand Accents**: Colored badges (e.g. `bg-emerald-500/20 text-emerald-400`, `bg-purple-950/20`) remain intentionally styled as thematic callout accents with sufficient background separation.
- **Related Tools**: Checked `CalculatorTool.tsx` and `GapCalculatorTool.tsx`; both are already using semantic tokens (`text-foreground`, `text-muted-foreground`, `border-border`, `text-primary`, `text-accent-foreground`).

---

## 4. Conclusion

All required replacements for Scope M1-3 are verified and specified with exact line locations. The Worker should execute:
1. `app/cookies/page.tsx`: Replace heading gradient on line 22, `text-zinc-400` on line 26, `border-white/10` on line 52, and `text-zinc-300` on lines 61, 88, 99.
2. `app/privacy/page.tsx`: Replace heading gradient on line 23, `text-zinc-400` on line 27, `border-white/10` on line 55, and `text-zinc-300` on lines 64, 75, 79, 83, 87, 100, 104, 108, 112, 135, 146, 166.
3. `app/terms/page.tsx`: Replace heading gradient on line 22, `text-zinc-400` on line 26, `border-white/10` on line 53, and `text-zinc-300` on lines 62, 73, 93, 104, 108, 112, 125.
4. `app/not-found.tsx`: Replace `from-white to-white/60` with `from-foreground to-foreground/50` on line 20.
5. `app/about/page.tsx`: Replace `border-white/10` with `border-border` on lines 27 and 37.
6. `components/tools/ConverterTool.tsx`: Replace `text-white` with `text-accent-foreground` on lines 40, 50, and 60.

---

## 5. Verification Method

### Automated Commands
```bash
# Verify no remaining from-white gradients in app/
rg "from-white" app/

# Verify no remaining hardcoded zinc text colors in app/
rg "text-zinc-(300|400)" app/

# Verify no border-white/10 in app/about/ or legal pages
rg "border-white/10" app/about/ app/cookies/ app/privacy/ app/terms/

# Verify no hardcoded text-white in ConverterTool
rg "text-white" components/tools/ConverterTool.tsx

# Full typecheck and lint
npm run lint
npx tsc --noEmit
```

### Invalidation Conditions
- Any occurrence of `from-white` remaining in `app/cookies/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, or `app/not-found.tsx`.
- Any occurrence of `text-zinc-300` or `text-zinc-400` in legal pages.
- Any TypeScript compilation error (`npx tsc --noEmit` non-zero exit code).
