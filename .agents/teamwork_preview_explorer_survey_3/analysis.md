# Layout Shifts, Recharts Containers, Dynamic Tooltips & Mobile Overflow Audit

**Audit Date**: 2026-08-21  
**Auditor**: Teamwork Explorer (Survey Explorer 3)  
**Target Repository**: TargetBand IELTS Web Application  

---

## 1. Executive Summary

A comprehensive investigation was conducted across the TargetBand codebase focusing on:
1. **Recharts Container Architecture**: Sizing, layout shifts, 0-width rendering, and `min-w-0` wrapper compliance.
2. **Recharts Tooltip, Legend, Grid, and Axis Theming**: Detection of hardcoded hex/RGBA values vs. semantic CSS variable tokens.
3. **Global Layout & Mobile Overflow**: Root layout `overflow-x-hidden` verification and mobile containment.
4. **Responsive Layout Shift & Mobile UX Risks**: Tables, heatmaps, sidebars, pickers, and viewports.

### Core Findings Matrix:
| Category | Status | Risk Level | Primary Location | Key Issue |
|---|---|---|---|---|
| **Recharts `min-w-0` & Dimensions** | Pass with minor advisory | Low | `AnalyticsChart`, `ScoreTrendChart`, `FeatureShowcase` | Containers have explicit heights and `min-w-0`; parent grid columns in `dashboard/page.tsx` should also include `min-w-0`. |
| **Recharts CSS Variable Bug** | **FAIL (Critical)** | **High** | `ScoreTrendChart.tsx:81-83` | Direct `var(--card)` and `var(--border)` used in inline CSS without `hsl(...)` wrapper — evaluates to invalid CSS `background-color: 0 0% 100%`. |
| **Recharts Tooltips & Hardcoded Colors** | **FAIL** | **High** | `AnalyticsChart.tsx`, `FeatureShowcase.tsx` | Hardcoded dark hex `#09090b`, `#171717`, white grids `#ffffff10`, `#ffffff40`, `rgba(255,255,255,0.1)`. Completely broken in light theme. |
| **Global `overflow-x-hidden`** | Pass | Low | `app/layout.tsx:56` | `overflow-x-hidden` is applied to `<body>`. Advisory to also set on `html` in `globals.css`. |
| **Mobile Dashboard Navigation** | **FAIL (UX)** | **Medium-High** | `app/(private)/dashboard/layout.tsx`, `DashboardSidebar.tsx` | Dashboard navbar is hidden on `/dashboard` and sidebar is `hidden md:flex`; mobile header has no menu/navigation to switch tabs. |
| **Table & Heatmap Overflow** | Pass | Low | `ScoreHistoryTable.tsx`, `ActivityHeatmap.tsx` | Properly wrapped in `overflow-x-auto`. Minor hardcoded colors in table thead (`bg-[#171717]`) and scrollbar thumb (`scrollbar-thumb-white/10`). |

---

## 2. Recharts Containers & Layout Shift Audit

### 2.1 Inspection of Recharts Instances
There are 3 components using Recharts in the codebase:

```
1. app/(private)/dashboard/analytics/AnalyticsChart.tsx
2. components/dashboard/ScoreTrendChart.tsx
3. components/FeatureShowcase.tsx
```

### 2.2 Sizing & `min-w-0` Compliance Breakdown

#### A. `AnalyticsChart.tsx` (Line 107–108)
```tsx
<div className="h-[400px] w-full mt-4 min-w-0">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={sortedData} ...>
```
- **Wrapper Height**: `h-[400px]` (explicit 400px).
- **Wrapper Width**: `w-full` with `min-w-0` present.
- **Layout Shift Assessment**:
  - Empty state (`data.length === 0`) returns `null`, and parent `AnalyticsPage` displays a designated empty state banner.
  - Sizing is stable with 0 layout shift during SVG load because the parent div reserves 400px in the CSS flow.
- **Advisory**: Ensure parent flex/grid containers do not constrain width below minimum chart margins (e.g. mobile 320px screen width).

#### B. `ScoreTrendChart.tsx` (Line 57–58 & Line 35)
```tsx
<div className="h-64 w-full min-w-0">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={sortedData} ...>
```
- **Wrapper Height**: `h-64` (explicit 256px).
- **Wrapper Width**: `w-full` with `min-w-0` present.
- **Empty State**:
  ```tsx
  <div className="flex h-64 w-full flex-col items-center justify-center ...">
  ```
  - **Crucial Positive Finding**: Both the empty state and the populated chart state share the exact same height (`h-64`), ensuring **zero Cumulative Layout Shift (CLS)** when data loads.

#### C. `FeatureShowcase.tsx` (Line 169–170)
```tsx
<div className="h-64 w-full relative min-w-0">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={[...]} ...>
```
- **Wrapper Height**: `h-64` (explicit 256px).
- **Wrapper Width**: `w-full min-w-0`.
- **Tab Layout Shift Assessment**:
  - The right-side demo panel has `min-h-[400px] flex items-center justify-center`.
  - Switching between "Band Calculator", "Gap Analyzer", and "Progress Tracker" occurs within the 400px boundary without jerking the outer landing page scroll position.

### 2.3 Grid Parent Context in `app/(private)/dashboard/page.tsx`
In `app/(private)/dashboard/page.tsx:135–145`:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left Column: Goal Progress */}
  <div className="lg:col-span-1 flex flex-col min-h-0">
    <GoalProgressCard goal={goalData} averages={averages} />
  </div>

  {/* Right Column: Chart & Heatmap */}
  <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
    <ScoreTrendChart data={scores} targetScore={goalData?.target_overall} />
    <ActivityHeatmap days={heatmapDays} />
  </div>
</div>
```
- **Observation**: Both columns have `min-h-0` but lack `min-w-0`.
- **Risk**: In CSS Grid layouts, child items default to `min-width: auto`. If Recharts measures width before SVG rendering or during resize, a grid column without `min-w-0` can prevent the column from shrinking, causing horizontal grid blowout.
- **Fix Recommendation**: Update `lg:col-span-2 flex flex-col gap-6 min-h-0` to `lg:col-span-2 flex flex-col gap-6 min-h-0 min-w-0`.

---

## 3. Recharts Tooltip, Legend & Theming Audit

### 3.1 Critical Syntax Bug in `ScoreTrendChart.tsx`
In `globals.css`, Tailwind v4 / shadcn theme variables are defined as raw HSL channel triplets:
```css
:root {
  --card: 0 0% 100%;
  --border: 0 0% 90%;
  --muted-foreground: 0 0% 45%;
}
.dark {
  --card: 0 0% 9%;
  --border: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
}
```
In `components/dashboard/ScoreTrendChart.tsx:81-84`:
```tsx
// ❌ BROKEN CSS SYNTAX:
<Tooltip 
  contentStyle={{ 
    backgroundColor: 'var(--card)',       // -> background-color: 0 0% 100% (INVALID CSS!)
    borderColor: 'var(--border)',         // -> border-color: 0 0% 90% (INVALID CSS!)
    borderRadius: '0.75rem', 
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' 
  }}
  itemStyle={{ color: '#10B981', fontWeight: 600 }}
  labelStyle={{ color: 'var(--muted-foreground)', marginBottom: '4px' }} // -> color: 0 0% 45% (INVALID CSS!)
/>
```
- **Consequence**: The browser discards invalid CSS properties. The tooltip renders with a transparent background or browser-default white border, resulting in broken aesthetics and theme mismatch.
- **Fix**: Wrap variables in `hsl(...)`:
```tsx
// ✅ VALID CSS:
<Tooltip 
  contentStyle={{ 
    backgroundColor: 'hsl(var(--popover))', 
    borderColor: 'hsl(var(--border))', 
    color: 'hsl(var(--popover-foreground))',
    borderRadius: '0.75rem', 
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' 
  }}
  itemStyle={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
  labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: '4px' }}
/>
```

### 3.2 Hardcoded Dark Hex & RGBA Colors in Chart Components

#### A. `app/(private)/dashboard/analytics/AnalyticsChart.tsx`
| Line | Code | Issue | Recommended Semantic Fix |
|---|---|---|---|
| **82** | `border border-white/10 bg-card` | Hardcoded white border | `border border-border bg-card` |
| **110** | `<CartesianGrid stroke="#ffffff10" vertical={false} />` | Hardcoded white alpha grid (invisible in light mode) | `<CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.6} vertical={false} />` |
| **113, 122** | `<XAxis stroke="#ffffff40" ... />`<br>`<YAxis stroke="#ffffff40" ... />` | Hardcoded white alpha axis stroke and tick color (invisible on white) | `stroke="hsl(var(--muted-foreground))" strokeOpacity={0.6}` |
| **131** | `contentStyle={{ backgroundColor: '#09090b', borderColor: 'rgba(255, 255, 255, 0.1)', ... }}` | Hardcoded dark background `#09090b` and white border | `contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))', ... }}` |
| **133** | `labelStyle={{ color: '#a3a3a3', borderBottom: '1px solid #ffffff10' }}` | Hardcoded hex `#a3a3a3` and white divider `#ffffff10` | `labelStyle={{ color: 'hsl(var(--muted-foreground))', borderBottom: '1px solid hsl(var(--border))', ... }}` |
| **137** | `<Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />` | Default Recharts legend text color can be unreadable in dark mode | `<Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" formatter={(val) => <span className="text-foreground text-xs font-medium">{val}</span>} />` |
| **163, 179, 195, 211, 227** | `activeDot={{ ..., stroke: '#fff' }}` | Hardcoded `#fff` stroke on active dots | `stroke: 'hsl(var(--card))'` or `'hsl(var(--background))'` |

#### B. `components/dashboard/ScoreTrendChart.tsx`
| Line | Code | Issue | Recommended Semantic Fix |
|---|---|---|---|
| **35** | `border border-white/10 bg-card/50` | Hardcoded white border in empty state | `border border-border bg-card/50` |
| **36** | `text-white/20` | Hardcoded white icon | `text-muted-foreground/30` |
| **45** | `border border-white/10 bg-card` | Hardcoded white card border | `border border-border bg-card` |
| **60** | `<CartesianGrid stroke="#ffffff15" ... />` | Hardcoded white alpha grid | `stroke="hsl(var(--border))" strokeOpacity={0.6}` |
| **63, 72** | `<XAxis stroke="#ffffff40" ... />`<br>`<YAxis stroke="#ffffff40" ... />` | Hardcoded white alpha stroke | `stroke="hsl(var(--muted-foreground))" strokeOpacity={0.6}` |
| **81-84** | `backgroundColor: 'var(--card)'` | Missing `hsl(...)` wrapper | `backgroundColor: 'hsl(var(--popover))'` |
| **98** | `activeDot={{ ..., stroke: '#ffffff' }}` | Hardcoded `#ffffff` | `stroke: 'hsl(var(--card))'` |

#### C. `components/FeatureShowcase.tsx`
| Line | Code | Issue | Recommended Semantic Fix |
|---|---|---|---|
| **182** | `<CartesianGrid stroke="rgba(255,255,255,0.1)" ... />` | Hardcoded white rgba grid | `stroke="hsl(var(--border))" strokeOpacity={0.6}` |
| **183, 184** | `<XAxis stroke="rgba(255,255,255,0.5)" ... />`<br>`<YAxis stroke="rgba(255,255,255,0.5)" ... />` | Hardcoded white rgba stroke | `stroke="hsl(var(--muted-foreground))" strokeOpacity={0.6}` |
| **186** | `contentStyle={{ backgroundColor: '#171717', border: '1px solid rgba(255,255,255,0.1)', ... }}` | Hardcoded dark `#171717` | `contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))', ... }}` |
| **194, 195** | `dot={{ stroke: "#000" }}`, `activeDot={{ stroke: "#000" }}` | Hardcoded `#000` dot stroke | `stroke: "hsl(var(--background))"` |

---

## 4. Root Layout & Mobile Horizontal Scroll Audit

### 4.1 Verification of `app/layout.tsx`
```tsx
// app/layout.tsx:56
<body className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col overflow-x-hidden w-full">
```
- **Verification Result**: `overflow-x-hidden` is **present and active** on the `<body>` element.
- **W-Full & Flex-Col**: Ensures children span 100% of viewport width without accidental margin displacement.

### 4.2 Supplementary CSS Hardening Recommendation
In `app/globals.css`, add explicit overflow protection for both `html` and `body`:
```css
@layer base {
  html, body {
    overflow-x: hidden;
    max-width: 100vw;
  }
}
```
*Rationale: On iOS Safari (WebKit), `overflow-x: hidden` solely on `<body>` can occasionally permit horizontal overscroll when nested fixed/sticky or translated motion elements render outside viewport bounds.*

---

## 5. Additional Responsive Layout Shift & Mobile UX Risks

### 5.1 Dashboard Mobile Navigation Gap (UX Risk)
- **Problem**:
  - `Navbar.tsx:58`: `if (pathname?.startsWith("/dashboard")) return null;` (Navbar is hidden in dashboard).
  - `DashboardSidebar.tsx:55`: `<aside className="... hidden md:flex ...">` (Sidebar is hidden on mobile).
  - `app/(private)/dashboard/layout.tsx:27-29`:
    ```tsx
    <header className="h-16 flex md:hidden items-center justify-between border-b border-border/50 px-4 bg-card">
       <span className="font-bold tracking-tighter text-lg">Target<span className="text-primary">Band</span></span>
    </header>
    ```
- **Impact**: On viewports `< 768px`, authenticated users on `/dashboard` have **no navigation menu**, drawer, or bottom tabs to move between Overview, Targets, History, Analytics, or Tools.
- **Recommended Remediation**: Add a mobile slide-out drawer or a mobile hamburger menu button to the mobile dashboard header in `app/(private)/dashboard/layout.tsx`.

### 5.2 Dynamic Tables (`ScoreHistoryTable.tsx`)
- **Container**: Line 34 has `className="w-full overflow-x-auto rounded-xl border border-white/10 bg-card shadow-sm"`.
- **Assessment**:
  - Table columns have `whitespace-nowrap` across 8 columns.
  - Horizontal scrolling is properly contained within the `.overflow-x-auto` card wrapper. The table does not cause page-level horizontal overflow.
  - **Advisories**:
    - Replace hardcoded `bg-[#171717]` in `<thead className="bg-[#171717] ...">` with `bg-muted/50` or `bg-secondary`.
    - Replace `border-white/10`, `divide-white/5`, `border-white/5` with `border-border`, `divide-border`.

### 5.3 Activity Heatmap (`ActivityHeatmap.tsx`)
- **Container**: Line 43 has `className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10"`.
- **Assessment**:
  - 371 squares span ~950px in width.
  - Horizontal scrolling is properly contained within the card.
  - **Advisory**: Replace `scrollbar-thumb-white/10` with `scrollbar-thumb-border` or `scrollbar-thumb-muted-foreground/20`.

### 5.4 Hardcoded `colorScheme: 'dark'` in Date Pickers
- **Location**: `app/(private)/dashboard/targets/TargetForm.tsx:97`
  ```tsx
  <input
    type="date"
    ...
    style={{ colorScheme: 'dark' }}
  />
  ```
- **Issue**: In light mode, the native browser calendar popup is forced to render in dark mode, clashing with the light interface.
- **Fix**: Remove inline `style={{ colorScheme: 'dark' }}`.

### 5.5 Stepper Badges & Form Controls
- **Location**: `components/shared/NumericStepperBadge.tsx`
- **Assessment**:
  - Value display uses `min-w-[4ch] text-center font-mono tabular-nums`.
  - Step transitions (e.g. `6.5` to `7.0`) do not cause layout vibration or width shifts because the character width is constrained with monospace tabular numbers.

---

## 6. Actionable Rectification Checklist for Implementers

- [ ] **Fix CSS Variable Syntax in `ScoreTrendChart.tsx`**:
  - Replace `var(--card)` with `hsl(var(--popover))` or `hsl(var(--card))`.
  - Replace `var(--border)` with `hsl(var(--border))`.
  - Replace `var(--muted-foreground)` with `hsl(var(--muted-foreground))`.
- [ ] **Replace Hardcoded Colors in `AnalyticsChart.tsx`**:
  - Line 82: `border-white/10` → `border-border`.
  - Line 110: `stroke="#ffffff10"` → `stroke="hsl(var(--border))"`.
  - Line 113, 122: `stroke="#ffffff40"` → `stroke="hsl(var(--muted-foreground))"`.
  - Line 131, 133: Tooltip `backgroundColor: '#09090b'`, `labelStyle.color: '#a3a3a3'`, `borderBottom: '#ffffff10'` → semantic tokens (`hsl(var(--popover))`, `hsl(var(--muted-foreground))`, `hsl(var(--border))`).
  - Line 137: Add `formatter` to `Legend` to ensure `text-foreground` label styling.
  - Lines 163, 179, 195, 211, 227: `stroke: '#fff'` → `stroke: 'hsl(var(--card))'`.
- [ ] **Replace Hardcoded Colors in `FeatureShowcase.tsx`**:
  - Line 182: `stroke="rgba(255,255,255,0.1)"` → `stroke="hsl(var(--border))"`.
  - Line 183, 184: `stroke="rgba(255,255,255,0.5)"` → `stroke="hsl(var(--muted-foreground))"`.
  - Line 186: `backgroundColor: '#171717'` → `backgroundColor: 'hsl(var(--popover))'`, `borderColor: 'hsl(var(--border))'`.
  - Line 194, 195: `stroke: "#000"` → `stroke: "hsl(var(--background))"`.
- [ ] **Enhance Grid Shrinkage in `app/(private)/dashboard/page.tsx`**:
  - Line 142: Add `min-w-0` to `<div className="lg:col-span-2 flex flex-col gap-6 min-h-0 min-w-0">`.
- [ ] **Harden Global Root Layout Overflow**:
  - Add `html, body { overflow-x: hidden; }` in `app/globals.css`.
- [ ] **Fix Table & Heatmap Theming**:
  - `ScoreHistoryTable.tsx:36`: `bg-[#171717]` → `bg-muted/50`, `border-white/10` → `border-border`.
  - `ActivityHeatmap.tsx:43`: `scrollbar-thumb-white/10` → `scrollbar-thumb-border`.
- [ ] **Remove Inline Date Picker Dark Scheme**:
  - `TargetForm.tsx:97`: Remove `style={{ colorScheme: 'dark' }}`.
- [ ] **Add Mobile Dashboard Navigation**:
  - Provide a mobile navigation mechanism in `app/(private)/dashboard/layout.tsx`.
