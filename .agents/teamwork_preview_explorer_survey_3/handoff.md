# Survey Explorer 3 — Handoff Report

## 1. Observation

### 1.1 Recharts Container Architecture & `min-w-0`
- **`app/(private)/dashboard/analytics/AnalyticsChart.tsx:107–108`**:
  ```tsx
  <div className="h-[400px] w-full mt-4 min-w-0">
    <ResponsiveContainer width="100%" height="100%">
  ```
- **`components/dashboard/ScoreTrendChart.tsx:57–58` & `35`**:
  ```tsx
  <div className="h-64 w-full min-w-0">
    <ResponsiveContainer width="100%" height="100%">
  ```
  Empty state:
  ```tsx
  <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-card/50 text-center text-muted-foreground p-6 shadow-sm">
  ```
- **`components/FeatureShowcase.tsx:169–170`**:
  ```tsx
  <div className="h-64 w-full relative min-w-0">
    <ResponsiveContainer width="100%" height="100%">
  ```
- **`app/(private)/dashboard/page.tsx:137, 142`**:
  ```tsx
  <div className="lg:col-span-1 flex flex-col min-h-0">
  ...
  <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
  ```

### 1.2 Recharts CSS Variable Syntax Bug & Hardcoded Theming
- **`components/dashboard/ScoreTrendChart.tsx:81–84`**:
  ```tsx
  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '0.75rem', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
  itemStyle={{ color: '#10B981', fontWeight: 600 }}
  labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }}
  ```
  *Note: In `globals.css`, `--card` is `0 0% 100%`. Using `var(--card)` directly in CSS evaluates to `background-color: 0 0% 100%`, which is invalid CSS without `hsl(...)`.*
- **`app/(private)/dashboard/analytics/AnalyticsChart.tsx:110, 113, 122, 131, 133`**:
  ```tsx
  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
  <XAxis dataKey="test_date" stroke="#ffffff40" ... />
  <YAxis stroke="#ffffff40" ... />
  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255, 255, 255, 0.1)', ... }}
    labelStyle={{ color: '#a3a3a3', marginBottom: '8px', borderBottom: '1px solid #ffffff10', paddingBottom: '4px' }}
  />
  ```
- **`components/FeatureShowcase.tsx:182–186, 194–195`**:
  ```tsx
  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" ... />
  <YAxis stroke="rgba(255,255,255,0.5)" ... />
  <Tooltip contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
  <Line ... dot={{ r: 6, fill: "#10B981", strokeWidth: 2, stroke: "#000" }} activeDot={{ r: 8, fill: "#8B5CF6", stroke: "#000" }} />
  ```

### 1.3 Global Root Layout & Mobile Overflow
- **`app/layout.tsx:56`**:
  ```tsx
  <body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col overflow-x-hidden w-full">
  ```
- **`app/(private)/dashboard/layout.tsx:22, 25, 27–29`**:
  ```tsx
  <div className="flex h-screen overflow-hidden bg-background">
  ...
  <header className="h-16 flex md:hidden items-center justify-between border-b border-border/50 px-4 bg-card">
     <span className="font-bold tracking-tighter text-lg">Target<span className="text-primary">Band</span></span>
  </header>
  ```
- **`components/Navbar.tsx:58`**:
  ```tsx
  if (pathname?.startsWith("/dashboard")) {
    return null
  }
  ```

### 1.4 Dynamic Tables, Heatmap & Form Controls
- **`app/(private)/dashboard/history/ScoreHistoryTable.tsx:34, 36`**:
  ```tsx
  <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-card shadow-sm">
    <thead className="bg-[#171717] border-b border-white/10 text-muted-foreground uppercase text-xs tracking-wider">
  ```
- **`components/dashboard/ActivityHeatmap.tsx:43`**:
  ```tsx
  <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
  ```
- **`app/(private)/dashboard/targets/TargetForm.tsx:97`**:
  ```tsx
  style={{ colorScheme: 'dark' }}
  ```

---

## 2. Logic Chain

1. **Recharts Container Stability**:
   - `AnalyticsChart`, `ScoreTrendChart`, and `FeatureShowcase` all wrap `ResponsiveContainer` in a `<div>` with explicit pixel/utility height (`h-[400px]` or `h-64`) and `min-w-0`.
   - In `ScoreTrendChart`, the empty fallback state has the same `h-64` as the chart state, preventing layout shifts between 0-data and populated states.
   - However, in `app/(private)/dashboard/page.tsx`, the grid wrapper on the right column has `min-h-0` but lacks `min-w-0`. Under CSS Grid rules, adding `min-w-0` ensures the grid cell can shrink below its content size when the viewport is resized.

2. **CSS Variable Validity in Recharts Tooltips**:
   - The CSS variables `--card`, `--border`, and `--muted-foreground` defined in `:root` and `.dark` contain raw channel numbers (e.g. `0 0% 100%`).
   - `ScoreTrendChart.tsx` assigns `backgroundColor: 'var(--card)'` in inline React styles. Browsers reject `background-color: 0 0% 100%` as an invalid value, resulting in transparent or unstyled tooltips.
   - Wrapping them as `hsl(var(--card))` or `hsl(var(--popover))` produces valid CSS colors that dynamically update when switching between light and dark themes.

3. **Light Mode Parity for Recharts SVG Elements**:
   - `AnalyticsChart.tsx` and `FeatureShowcase.tsx` hardcode dark background colors (`#09090b`, `#171717`) for tooltips and white strokes (`#ffffff10`, `#ffffff40`, `rgba(255,255,255,0.1)`) for grid lines and axes.
   - When the user toggles to light mode, these white strokes become invisible against the light card background, and the tooltips retain a dark background with potential contrast failure.
   - Changing grid strokes to `hsl(var(--border))` and axis strokes to `hsl(var(--muted-foreground))` restores 100% theme parity.

4. **Mobile Overflow & Layout Containment**:
   - `app/layout.tsx` applies `overflow-x-hidden` directly on `<body>`.
   - `ScoreHistoryTable` and `ActivityHeatmap` encapsulate wide content inside `overflow-x-auto` wrappers, isolating table and heatmap horizontal scrolling to their respective cards.
   - On the mobile dashboard view, `Navbar` is hidden, and `DashboardSidebar` is hidden on mobile (`hidden md:flex`), leaving the mobile dashboard header without any navigation trigger.

---

## 3. Caveats

- **Device Native Date Picker Styling**: While removing `style={{ colorScheme: 'dark' }}` from `TargetForm.tsx` allows the browser to match the system theme, full theme synchronization for native date pickers in Safari/iOS is browser-controlled.
- **Recharts Tooltip DOM Rendering**: In Recharts 3.x, tooltips render as HTML elements inside a portal or relative container. Theme styling via `contentStyle` with `hsl(var(--...))` is fully compatible across all modern browsers.

---

## 4. Conclusion

1. **Recharts sizing and container constraints are mostly solid**, with all 3 instances properly utilizing `min-w-0` and fixed heights to prevent layout shifts.
2. **A critical CSS syntax error exists in `ScoreTrendChart.tsx`** where raw HSL triplet CSS variables are unwrapped.
3. **Hardcoded dark hex and white alpha colors in `AnalyticsChart.tsx` and `FeatureShowcase.tsx` break light-mode chart readability** (invisible axes and grids).
4. **`overflow-x-hidden` is verified on the global root layout `<body>`**, and table/heatmap components properly contain horizontal scrolling.
5. **Mobile dashboard navigation needs a menu/drawer** since both the main navbar and sidebar are hidden on mobile dashboard screens.

---

## 5. Verification Method

To independently verify these findings:

1. **Inspect CSS Variable Tooltip Bug**:
   - View `components/dashboard/ScoreTrendChart.tsx` lines 81–84.
   - Inspect the tooltip DOM element in browser DevTools to verify that `background-color: var(--card)` is flagged as invalid CSS by the browser engine.
2. **Inspect Hardcoded Chart Colors**:
   - Grep for `#ffffff` and `#09090b` in `app/(private)/dashboard/analytics/AnalyticsChart.tsx`.
   - Grep for `#171717` in `components/FeatureShowcase.tsx`.
3. **Verify Global Root Overflow**:
   - View `app/layout.tsx` line 56.
4. **Build & Typecheck**:
   - Run `npx tsc --noEmit` and `npm run build` to confirm no TypeScript regressions exist.
