# Theme Tokens, Hardcoded Colors, & Dark/Light Mode Parity Analysis

**TargetBand Codebase Investigation**  
**Explorer**: Survey Explorer 2  
**Date**: 2026-08-21  

---

## Executive Summary

A comprehensive, full-codebase scan across all pages, layouts, auth flows, tools, and UI components was conducted to audit theme token utilization, hardcoded color classes, Recharts dynamic theme mappings, and light/dark mode parity.

### Core Discoveries:
1. **Hardcoded Dark Hex Backgrounds**:
   - `app/(private)/dashboard/history/ScoreHistoryTable.tsx:36`: `bg-[#171717]` in table `<thead>` renders as pitch black in light mode.
   - `app/(private)/dashboard/log/page.tsx:104, 212`: `bg-[#111]` in top form panel and bottom submission bar renders as pitch black in light mode.
   - `app/(private)/dashboard/analytics/AnalyticsChart.tsx:131`: Hardcoded `backgroundColor: '#09090b'` in Recharts Tooltip.
   - `components/FeatureShowcase.tsx:186`: Hardcoded `backgroundColor: '#171717'` in Recharts Tooltip.
2. **Hardcoded White Borders & Alpha Overlays (`border-white/10`, `bg-white/10`)**:
   - Found across 14+ component and page locations (`app/globals.css`, `ScoreHistoryTable.tsx`, `GoalProgressCard.tsx`, `AnalyticsChart.tsx`, `TargetForm.tsx`, `cookies/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `about/page.tsx`, etc.). In light mode, these white borders and white overlays are completely invisible against white cards or create low-contrast artifacts.
3. **Severe Light Mode Contrast / Invisible Text in Legal & 404 Pages**:
   - `app/cookies/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`:
     - Titles use `bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent`, making page titles invisible or washed out in light mode.
     - Body text extensively uses `text-zinc-300` and `text-zinc-400`, resulting in a ~1.3:1 contrast ratio against the white background (violating WCAG AA/AAA).
   - `app/not-found.tsx:20`: Giant 404 number uses `from-white to-white/60 bg-clip-text text-transparent`, rendering invisible on light backgrounds.
4. **Recharts Theme Variable Resolution Issues**:
   - In `components/dashboard/ScoreTrendChart.tsx:81`, `contentStyle` specifies `backgroundColor: 'var(--card)'`, but in Tailwind CSS variables `--card` is raw HSL `0 0% 100%`. Without wrapping in `hsl(var(--card))`, this is invalid CSS in inline styles.
   - Recharts `CartesianGrid` and `XAxis`/`YAxis` use hardcoded `#ffffff10`, `#ffffff15`, and `#ffffff40`, rendering gridlines and axis ticks invisible in light mode.
5. **Hardcoded `colorScheme: 'dark'`**:
   - `app/(private)/dashboard/targets/TargetForm.tsx:98`: `style={{ colorScheme: 'dark' }}` forces dark calendar popups even when the UI is in light mode.
6. **Hardcoded `text-white`**:
   - `components/tools/ConverterTool.tsx:40, 50, 60`: Button active states use `bg-accent text-white` instead of semantic `bg-accent text-accent-foreground`.

---

## 1. Design System Semantic Tokens Catalog

The project uses **Tailwind CSS v4** with CSS variables defined in `@layer base` and mapped via `@theme` in `app/globals.css`.

### Theme Variables Mapping Table

| CSS Variable | Light Mode (`:root`) | Dark Mode (`.dark`) | Tailwind Utility Class | Semantic Role |
| :--- | :--- | :--- | :--- | :--- |
| `--background` | `0 0% 100%` (#ffffff) | `0 0% 5%` (#0d0d0d) | `bg-background`, `text-background` | Page background |
| `--foreground` | `0 0% 5%` (#0d0d0d) | `0 0% 98%` (#fafafa) | `text-foreground`, `bg-foreground` | Main body text |
| `--card` | `0 0% 100%` (#ffffff) | `0 0% 9%` (#171717) | `bg-card` | Card & surface background |
| `--card-foreground`| `0 0% 5%` (#0d0d0d) | `0 0% 98%` (#fafafa) | `text-card-foreground` | Card text |
| `--popover` | `0 0% 100%` (#ffffff) | `0 0% 9%` (#171717) | `bg-popover` | Popovers / dropdowns |
| `--popover-foreground`| `0 0% 5%` (#0d0d0d) | `0 0% 98%` (#fafafa) | `text-popover-foreground` | Popover text |
| `--border` | `0 0% 90%` (#e5e5e5) | `0 0% 14.9%` (#262626) | `border-border`, `divide-border` | Borders & dividers |
| `--input` | `0 0% 90%` (#e5e5e5) | `0 0% 14.9%` (#262626) | `border-input`, `bg-input` | Input element borders |
| `--ring` | `142.1 70.6% 45.3%` | `142.1 70.6% 45.3%` | `ring-ring` | Focus ring color |
| `--primary` | `142.1 70.6% 45.3%` (#10b981) | `142.1 70.6% 45.3%` (#10b981) | `bg-primary`, `text-primary` | Brand emerald primary |
| `--primary-foreground`| `0 0% 98%` (#fafafa) | `0 0% 5%` (#0d0d0d) | `text-primary-foreground` | Text on primary |
| `--accent` | `263.4 70% 50.4%` (#8b5cf6) | `263.4 70% 50.4%` (#8b5cf6) | `bg-accent`, `text-accent` | Violet accent |
| `--accent-foreground`| `0 0% 98%` (#fafafa) | `0 0% 98%` (#fafafa) | `text-accent-foreground` | Text on accent |
| `--secondary` | `0 0% 96%` (#f5f5f5) | `0 0% 14.9%` (#262626) | `bg-secondary` | Secondary button/badge background |
| `--secondary-foreground`| `0 0% 5%` (#0d0d0d) | `0 0% 98%` (#fafafa) | `text-secondary-foreground` | Text on secondary |
| `--muted` | `0 0% 96%` (#f5f5f5) | `0 0% 14.9%` (#262626) | `bg-muted` | Muted backgrounds/steppers |
| `--muted-foreground`| `0 0% 45%` (#737373) | `0 0% 63.9%` (#a3a3a3) | `text-muted-foreground` | Secondary/subdued text |
| `--destructive` | `0 84% 60%` | `0 62.8% 50.6%` | `bg-destructive`, `text-destructive` | Destructive actions / errors |
| `--destructive-foreground`| `0 0% 98%` | `0 0% 98%` | `text-destructive-foreground` | Text on destructive |

---

## 2. Exhaustive File-by-File Audit & Replacement Map

### A. Global Styles (`app/globals.css`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **120–123** | `a.border.border-white\/10, button.border.border-white\/10 { @apply ... hover:!border-white/30 hover:!bg-white/[0.07]; }` | White border/overlay invisible on light pages | `a.btn-outline, button.btn-outline { @apply !transition-all !duration-200 !ease-out hover:!border-border hover:!bg-muted/50 active:!scale-[0.98] active:!translate-y-0; }` |
| **137** | `.card-hover, .bg-card { @apply ... hover:border-white/20 hover:shadow-xl hover:shadow-black/40; }` | Hovering produces white border flash on white cards; shadow is harsh | `@apply transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-border hover:shadow-lg;` |
| **141** | `tbody tr { @apply transition-colors duration-150 ease-in-out hover:bg-white/[0.03]; }` | `hover:bg-white/[0.03]` invisible on white backgrounds | `tbody tr { @apply transition-colors duration-150 ease-in-out hover:bg-muted/50; }` |

---

### B. Dashboard Score History Table (`app/(private)/dashboard/history/ScoreHistoryTable.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **34** | `border border-white/10 bg-card` | White border invisible on white card | `border border-border bg-card` |
| **36** | `<thead className="bg-[#171717] border-b border-white/10 text-muted-foreground uppercase text-xs tracking-wider">` | `bg-[#171717]` forces dark table header in light mode; `border-white/10` is invisible | `<thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs tracking-wider">` |
| **48** | `<tbody className="divide-y divide-white/5 bg-transparent">` | `divide-white/5` is invisible on light backgrounds | `<tbody className="divide-y divide-border bg-transparent">` |
| **92** | `border-t border-white/5` | White divider invisible in light mode | `border-t border-border` |

---

### C. Dashboard Score Logger (`app/(private)/dashboard/log/page.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **104** | `<div className="p-6 md:p-8 border-b border-border/50 bg-[#111] grid grid-cols-1 md:grid-cols-2 gap-6">` | `bg-[#111]` causes pitch-black top header box in light mode | `<div className="p-6 md:p-8 border-b border-border/50 bg-muted/20 grid grid-cols-1 md:grid-cols-2 gap-6">` |
| **212** | `<div className="p-6 md:p-8 border-t border-border/50 bg-[#111] flex flex-col sm:flex-row items-center justify-between gap-6">` | `bg-[#111]` causes pitch-black submit footer box in light mode | `<div className="p-6 md:p-8 border-t border-border/50 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-6">` |

---

### D. Analytics Chart Component (`app/(private)/dashboard/analytics/AnalyticsChart.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **82** | `border border-white/10 bg-card` | White border on white card | `border border-border bg-card` |
| **110** | `<CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />` | Grid lines invisible on white background | `<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />` |
| **113, 122** | `<XAxis stroke="#ffffff40" ... />`, `<YAxis stroke="#ffffff40" ... />` | Axis ticks and labels invisible on white background | `stroke="hsl(var(--muted-foreground))"` |
| **131** | `contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255, 255, 255, 0.1)', ... }}` | Tooltip stays dark black with white border in light mode | `contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))', borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)' }}` |
| **133** | `labelStyle={{ color: '#a3a3a3', marginBottom: '8px', borderBottom: '1px solid #ffffff10', paddingBottom: '4px' }}` | Hardcoded `#a3a3a3` and `#ffffff10` | `labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '8px', borderBottom: '1px solid hsl(var(--border))', paddingBottom: '4px' }}` |
| **163, 179, 195, 211, 227** | `activeDot={{ ..., stroke: '#fff', strokeWidth: 2 }}` | Stroke is hardcoded `#fff` | `stroke: 'hsl(var(--card))'` or `stroke: 'hsl(var(--background))'` |

---

### E. Analytics Overview Page (`app/(private)/dashboard/analytics/page.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **139, 160** | `<div className="rounded-2xl border border-white/10 bg-card p-6 shadow-sm ...">` | Hardcoded `border-white/10` | `<div className="rounded-2xl border border-border bg-card p-6 shadow-sm ...">` |

---

### F. Target Form Component (`app/(private)/dashboard/targets/TargetForm.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **73** | `border border-white/10 bg-card` | Hardcoded `border-white/10` | `border border-border bg-card` |
| **98** | `style={{ colorScheme: 'dark' }}` | Forces date picker popup to dark mode even in light mode | Remove `style={{ colorScheme: 'dark' }}` |

---

### G. Score Trend Chart Component (`components/dashboard/ScoreTrendChart.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **35** | `border border-white/10 bg-card/50` | Hardcoded `border-white/10` | `border border-border bg-card/50` |
| **36** | `text-white/20` | Icon invisible on white background | `text-muted-foreground/30` |
| **45** | `border border-white/10 bg-card` | Hardcoded `border-white/10` | `border border-border bg-card` |
| **60** | `<CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />` | Hardcoded `#ffffff15` invisible on white | `<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />` |
| **63, 72** | `<XAxis stroke="#ffffff40" ... />`, `<YAxis stroke="#ffffff40" ... />` | Hardcoded `#ffffff40` invisible on white | `stroke="hsl(var(--muted-foreground))"` |
| **81** | `contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', ... }}` | Missing `hsl(...)` wrapper makes CSS invalid; default tooltip styling breaks | `contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))', borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)' }}` |
| **83** | `labelStyle={{ color: 'var(--muted-foreground)', ... }}` | Missing `hsl(...)` wrapper makes CSS invalid | `labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}` |
| **98** | `activeDot={{ ..., stroke: '#ffffff', strokeWidth: 2 }}` | Stroke is hardcoded `#ffffff` | `stroke: 'hsl(var(--card))'` |

---

### H. Goal Progress Card (`components/dashboard/GoalProgressCard.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **40** | `bg-white/10` in progress track | Progress bar track is white on white card (invisible) | `bg-secondary` or `bg-muted` |
| **53** | `border border-white/10 bg-card` | Hardcoded `border-white/10` | `border border-border bg-card` |
| **84** | `border border-white/10 bg-card` | Hardcoded `border-white/10` | `border border-border bg-card` |
| **90** | `bg-white/5 ... border border-white/10` | Badge is invisible on white background | `bg-muted/50 border border-border` |

---

### I. Activity Heatmap (`components/dashboard/ActivityHeatmap.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **43** | `scrollbar-thumb-white/10` | Scrollbar thumb invisible in light mode | `scrollbar-thumb-border` |

---

### J. Feature Showcase Component (`components/FeatureShowcase.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **182** | `<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />` | Invisible on light card | `<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />` |
| **183, 184** | `<XAxis stroke="rgba(255,255,255,0.5)" ... />`, `<YAxis stroke="rgba(255,255,255,0.5)" ... />` | Invisible on light card | `stroke="hsl(var(--muted-foreground))"` |
| **186** | `contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}` | Stays dark `#171717` in light mode | `contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--card-foreground))', borderRadius: '8px' }}` |
| **194, 195** | `stroke: "#000"` on dot and activeDot | Hardcoded black stroke | `stroke: "hsl(var(--card))"` |

---

### K. Converter Tool (`components/tools/ConverterTool.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **40, 50, 60** | `bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]` | Hardcoded `text-white` | `bg-accent text-accent-foreground shadow-md shadow-accent/20` |

---

### L. Calculator Tool (`components/tools/CalculatorTool.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **81** | `bg-emerald-950/20 border border-emerald-500/30` | `emerald-950/20` creates muddy brownish-green in light mode | `bg-primary/10 border border-primary/30` |

---

### M. Navbar Component (`components/Navbar.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **103** | `ring-1 ring-white/10` | Ring invisible on light background | `ring-1 ring-border/50` |

---

### N. Legal Pages (`cookies/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`)

| File & Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| `cookies/page.tsx:22`<br>`privacy/page.tsx:23`<br>`terms/page.tsx:22` | `className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400"` | **Critical**: White-to-zinc gradient is invisible against white background in light mode | `className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground"` |
| `cookies/page.tsx:26`<br>`privacy/page.tsx:27`<br>`terms/page.tsx:26` | `text-zinc-400` | Contrast ratio < 2:1 against light background | `text-muted-foreground` |
| `cookies/page.tsx:52`<br>`privacy/page.tsx:55`<br>`terms/page.tsx:53` | `border border-white/10` | White border on white background | `border border-border` |
| `cookies/page.tsx:61,88,99`<br>`privacy/page.tsx:64,75,79,83,87,100,104,108,112,135,146,166`<br>`terms/page.tsx:62,73,93,104,108,112,125` | `text-zinc-300` | **Critical**: `text-zinc-300` has ~1.3:1 contrast ratio against white; totally unreadable | `text-muted-foreground` or `text-foreground` |
| `cookies/page.tsx:73`<br>`privacy/page.tsx:127` | `bg-emerald-950/20 border border-emerald-500/30 text-emerald-300` | Muddy background & poor contrast in light mode | `bg-primary/10 border border-primary/20 text-foreground` (with `text-primary` for highlights) |
| `cookies/page.tsx:104`<br>`privacy/page.tsx:151`<br>`terms/page.tsx:78` | `bg-purple-950/20 border border-purple-500/30 text-purple-300` | Muddy background & poor contrast in light mode | `bg-accent/10 border border-accent/20 text-foreground` (with `text-accent` for highlights) |

---

### O. About Page (`app/about/page.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **27, 37** | `border border-white/10` | White border invisible on white background | `border border-border` |
| **49** | `border border-emerald-500/30 bg-emerald-950/10` | Muddy dark tint in light mode | `border border-primary/20 bg-primary/5` |

---

### P. 404 Page (`app/not-found.tsx`)

| Line(s) | Current Hardcoded Code | Issue in Light Mode | Proposed Semantic Replacement |
| :--- | :--- | :--- | :--- |
| **20** | `bg-gradient-to-b from-white to-white/60 text-transparent bg-clip-text` | **Critical**: 404 text is white on white in light mode (completely invisible) | `bg-gradient-to-b from-foreground to-foreground/60 text-transparent bg-clip-text` or `text-foreground` |

---

## 3. Theme Provider & Toggle Parity Verification

- **Theme Provider** (`app/layout.tsx:58-63` & `components/theme-provider.tsx`):
  - Properly wrapped with `next-themes` (`ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}`).
  - `html` has `suppressHydrationWarning`.
  - `body` uses `bg-background text-foreground transition-colors duration-300`.
- **Theme Toggle Button** (`components/Navbar.tsx:161-174`):
  - Switches between `light` and `dark` with smooth transition.
  - Mount state check (`mounted`) prevents hydration mismatch.
- **Dashboard Sidebar / Layout**:
  - The dashboard layout (`app/(private)/dashboard/layout.tsx`) hides the public `Navbar` and renders `DashboardSidebar`.
  - In `DashboardSidebar`, all backgrounds use `bg-card` and `border-border`, but the sidebar currently does not have a theme toggle. Users in dashboard can toggle theme from public pages or system preference.

---

## 4. Recharts Dynamic Variable Integration Strategy

When rendering Recharts in client components (`ScoreTrendChart.tsx`, `AnalyticsChart.tsx`, `FeatureShowcase.tsx`), avoid passing raw CSS variable names without `hsl(...)`.

### Safe Dynamic Tooltip Config:
```tsx
<Tooltip
  animationDuration={150}
  animationEasing="ease-out"
  contentStyle={{
    backgroundColor: 'hsl(var(--card))',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--card-foreground))',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
  }}
  itemStyle={{
    color: 'hsl(var(--primary))',
    fontWeight: 600,
  }}
  labelStyle={{
    color: 'hsl(var(--muted-foreground))',
    marginBottom: '4px',
    borderBottom: '1px solid hsl(var(--border))',
    paddingBottom: '4px',
  }}
/>
```

### Safe Dynamic Grid & Axes Config:
```tsx
<CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
<XAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
<YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
```

---

## 5. Summary Checklist of Violations to Resolve

- [ ] `app/globals.css`: Replace `border-white/10`, `hover:border-white/20`, `hover:bg-white/[0.07]`, `hover:bg-white/[0.03]` with semantic tokens.
- [ ] `app/(private)/dashboard/history/ScoreHistoryTable.tsx`: Replace `bg-[#171717]`, `border-white/10`, `divide-white/5`, `border-white/5`.
- [ ] `app/(private)/dashboard/log/page.tsx`: Replace `bg-[#111]` (lines 104, 212) with `bg-muted/20`.
- [ ] `app/(private)/dashboard/analytics/AnalyticsChart.tsx`: Replace `border-white/10`, `#ffffff10`, `#ffffff40`, `#09090b`, `#a3a3a3`.
- [ ] `app/(private)/dashboard/analytics/page.tsx`: Replace `border-white/10`.
- [ ] `app/(private)/dashboard/targets/TargetForm.tsx`: Replace `border-white/10` and remove `style={{ colorScheme: 'dark' }}`.
- [ ] `components/dashboard/ScoreTrendChart.tsx`: Replace `border-white/10`, `text-white/20`, `#ffffff15`, `#ffffff40`, wrap `var(--card)` in `hsl(...)`.
- [ ] `components/dashboard/GoalProgressCard.tsx`: Replace `bg-white/10`, `border-white/10`, `bg-white/5`.
- [ ] `components/dashboard/ActivityHeatmap.tsx`: Replace `scrollbar-thumb-white/10`.
- [ ] `components/FeatureShowcase.tsx`: Replace `rgba(255,255,255,0.1)`, `rgba(255,255,255,0.5)`, `#171717`, `#000`.
- [ ] `components/tools/ConverterTool.tsx`: Replace `text-white` with `text-accent-foreground`.
- [ ] `components/tools/CalculatorTool.tsx`: Replace `bg-emerald-950/20` with `bg-primary/10`.
- [ ] `components/Navbar.tsx`: Replace `ring-white/10` with `ring-border/50`.
- [ ] `app/cookies/page.tsx`: Replace `from-white via-zinc-200 to-zinc-400`, `text-zinc-300`, `text-zinc-400`, `border-white/10`, `bg-emerald-950/20`, `bg-purple-950/20`.
- [ ] `app/privacy/page.tsx`: Replace `from-white via-zinc-200 to-zinc-400`, `text-zinc-300`, `text-zinc-400`, `border-white/10`, `bg-emerald-950/20`, `bg-purple-950/20`.
- [ ] `app/terms/page.tsx`: Replace `from-white via-zinc-200 to-zinc-400`, `text-zinc-300`, `text-zinc-400`, `border-white/10`, `bg-purple-950/20`.
- [ ] `app/about/page.tsx`: Replace `border-white/10`, `bg-emerald-950/10`.
- [ ] `app/not-found.tsx`: Replace `from-white to-white/60` with `from-foreground to-foreground/60`.
