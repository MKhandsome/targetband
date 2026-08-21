# Project: TargetBand UI/UX Polish, Theme Parity & Codebase Stabilization

## Architecture
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, CSS Variables (HSL channel tokens in `:root` and `.dark`)
- **Charting**: Recharts with ResponsiveContainer wrappers
- **State & Backend**: Supabase Client & Server Actions, Zod validation schemas
- **Icons & Animation**: Lucide React, Framer Motion

## Feature & Remediation Inventory
| # | Item / Feature | Description | Milestone | Source |
|---|----------------|-------------|-----------|--------|
| 1 | Dark Hex Elimination | Replace `bg-[#171717]`, `bg-[#111]`, `bg-[#09090b]` with semantic tokens | M1 | Survey 2 |
| 2 | White Alpha Border/Bg Replacement | Replace `border-white/10`, `bg-white/10`, `bg-white/5` with `border-border`, `bg-muted` | M1 | Survey 2 |
| 3 | Legal & 404 Pages Contrast | Fix `from-white` gradients and `text-zinc-300`/`400` in cookies, privacy, terms, 404 | M1 | Survey 2 |
| 4 | Native Date Picker Fix | Remove `style={{ colorScheme: 'dark' }}` from TargetForm date input | M1 | Survey 2 |
| 5 | Recharts CSS Var Syntax Fix | Fix `var(--card)` to `hsl(var(--card))` in ScoreTrendChart | M2 | Survey 3 & 1 |
| 6 | Recharts Light Mode Parity | Convert CartesianGrid, X/Y axes, and tooltips in AnalyticsChart & FeatureShowcase to CSS vars | M2 | Survey 3 & 2 |
| 7 | Recharts Responsive Sizing | Ensure `min-w-0` on Recharts wrappers and parent CSS Grid column | M2 | Survey 3 |
| 8 | Root Layout Overflow-x | Ensure `overflow-x-hidden` on root layout body and responsive tables | M2 | Survey 3 |
| 9 | Performance & Memoization | Memoize AnalyticsChart computations, pre-sort bandConverter tables, hoist static arrays | M3 | Survey 1 |
| 10 | React Hook & Hydration Fixes | Fix `use-mobile.ts` initial mount sync and Navbar setTimeout anti-patterns | M3 | Survey 1 |
| 11 | TypeScript Type Safety | Replace `any` types in ScoreHistoryTable, TargetForm, and server actions | M3 | Survey 1 |
| 12 | Next.js 15 Suspense Boundary | Wrap `useSearchParams()` in dashboard tools page with `<Suspense>` | M3 | Survey 1 |
| 13 | Final Build & Production Verification | Execute `npm run lint`, `npx tsc --noEmit`, `npm run build`, and 0-hex scan | M4 | Original Request |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Theme Tokens & Light/Dark Parity | Replace hardcoded colors, dark hexes, white alpha classes, legal page contrast | none | PLANNED |
| M2 | Recharts & Responsive Layout | Fix Recharts CSS variable syntax, chart theming, responsive wrappers, overflow-x | M1 | PLANNED |
| M3 | Performance, Hooks & Type Safety | Memoization, static hoisting, use-mobile fix, Suspense, TypeScript `any` cleanup | none | PLANNED |
| M4 | Final Build & Acceptance Verification | Run lint, tsc, build, full hex scan, overflow check | M1, M2, M3 | PLANNED |

## Code Layout & File Boundaries
- **Theme & Styles**: `app/globals.css`
- **Dashboard & Layout Components**: `app/(private)/dashboard/layout.tsx`, `app/(private)/dashboard/page.tsx`, `components/DashboardSidebar.tsx`, `components/Navbar.tsx`
- **Dashboard Feature Components**: `app/(private)/dashboard/history/ScoreHistoryTable.tsx`, `app/(private)/dashboard/log/page.tsx`, `app/(private)/dashboard/analytics/page.tsx`, `app/(private)/dashboard/targets/TargetForm.tsx`, `components/dashboard/GoalProgressCard.tsx`
- **Charting Components**: `components/dashboard/ScoreTrendChart.tsx`, `app/(private)/dashboard/analytics/AnalyticsChart.tsx`, `components/FeatureShowcase.tsx`
- **Public & Legal Pages**: `app/about/page.tsx`, `app/cookies/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/not-found.tsx`, `app/layout.tsx`
- **Tools & Libs**: `components/tools/ConverterTool.tsx`, `lib/ielts/bandConverter.ts`, `hooks/use-mobile.ts`, `app/(private)/dashboard/tools/page.tsx`
- **Actions & Types**: `app/actions/targets.ts`, `app/(private)/dashboard/log/actions.ts`, `app/actions/scores.ts`
