# TargetBand
## Production-Ready Project Blueprint

**Stack:** Next.js 14+ (App Router) · Tailwind CSS · Supabase (Auth + PostgreSQL) · Recharts
**Theme:** 21st.dev Supabase Theme (forced dark mode)
**Author role:** Senior Full-Stack Architect / UI-UX Engineer
**Doc version:** 1.2 (rebrand + design system + security architecture)

---

## Table of Contents

1. [Project Overview & UI Layout Architecture](#1-project-overview--ui-layout-architecture)
2. [Tech Stack & Architecture Design](#2-tech-stack--architecture-design)
3. [Design System & Theming — 21st.dev Supabase Theme](#3-design-system--theming--21stdev-supabase-theme)
4. [Comprehensive Security Architecture](#4-comprehensive-security-architecture)
5. [Supabase Database Schema (SQL + RLS)](#5-supabase-database-schema-sql--rls)
6. [Next.js App Router Folder Structure](#6-nextjs-app-router-folder-structure)
7. [Core Component Breakdown & Business Logic](#7-core-component-breakdown--business-logic)
8. [Step-by-Step Implementation Roadmap](#8-step-by-step-implementation-roadmap)
9. [Open Questions / Assumptions](#9-open-questions--assumptions)

---

## 1. Project Overview & UI Layout Architecture

### 1.1 Product Concept

A two-tier web app:

- **Public Tier (no auth):** Instant-value, SEO-friendly IELTS score tools — raw-score converter, overall band calculator, and a "gap calculator" that tells a user what they need in their weakest skill. This is the **acquisition funnel**.
- **Authenticated Tier:** A personal dashboard where logged-in users log daily practice results, set goals, and visualize trends over time. This is the **retention/engagement engine**.

The architecture must let a user use 100% of Feature 1 with zero friction, then softly convert them into Feature 2 via contextual CTAs ("Save this result — Sign up free").

### 1.2 Information Architecture / Site Map

```
/                          → Landing page (hero + tool shortcuts + value prop)
/converter                 → Raw Score → Band Converter (Listening/Reading)
/calculator                → Overall Band Calculator (4 skills → overall)
/gap-calculator             → "What Do I Need?" reverse calculator
/login                     → Supabase Auth (magic link / email+password / Google)
/signup                    → Supabase Auth sign-up
/dashboard                 → (protected) Overview: latest scores, goal progress, activity heatmap
/dashboard/log             → (protected) Add/edit a daily test entry
/dashboard/history         → (protected) Table + line charts of all entries
/dashboard/goals           → (protected) Set/edit target band goals + archive
/dashboard/settings        → (protected) Profile, password, delete account
```

### 1.3 UI Layout Hierarchy

```
RootLayout (app/layout.tsx — ThemeProvider forced dark)
 ├─ PublicLayout (marketing header/footer, no auth check)
 │   ├─ Landing
 │   ├─ Converter
 │   ├─ Calculator
 │   └─ GapCalculator
 │
 └─ AppShellLayout (app/(dashboard)/layout.tsx — auth-gated)
     ├─ Sidebar / Topbar nav (Overview, Log Entry, History, Goals, Settings)
     └─ DashboardPages (Server Components fetching via Supabase server client)
```

**Key UX principle:** Public calculator pages and the authenticated dashboard live under **separate route groups** (`(public)` and `(dashboard)`) so each can have its own layout, its own middleware behavior, and so the public tools never trigger an auth redirect or a Supabase session check unless the user explicitly clicks "Save my result."

### 1.4 Visual/UX Notes

- Public calculators: single-column, distraction-free, results shown as large **numerical badges** flanked by interactive stepper controls (see §3.4) rather than plain text inputs — recalculates live, no "Submit" button.
- Every public tool ends with a persistent (but dismissible) banner: *"Want to track this over time? Create a free account."*
- Dashboard: card-based overview (current avg per skill, goal delta, streak), a GitHub-style daily practice **activity heatmap**, full-width Recharts line chart below, recent entries table.
- Entire app runs in **forced dark mode** — deep obsidian canvas, charcoal cards, neon-emerald progress/success states, electric-violet action buttons.
- Mobile-first; charts collapse to swipeable tabs per skill on small screens.

---

## 2. Tech Stack & Architecture Design

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ App Router | Server Components for dashboard data fetching, React Server Actions for mutations, file-based routing matches the public/private split cleanly |
| Styling | Tailwind CSS + shadcn/ui (optional) + 21st.dev Supabase Theme tokens | Utility-first, fast to theme, dark-mode-native design tokens (see §3) |
| Theming | `next-themes` forced to `dark` | App has no light mode — brand is dark-only, matching the 21st.dev Supabase aesthetic |
| Fonts | `Plus Jakarta Sans` (UI text) + `JetBrains Mono` (tabular score metrics) | Distinct, legible interface font paired with a monospace face for numeric alignment in scores/tables |
| Charts | Recharts | Declarative, composable, good for line/trend charts, SSR-safe with `"use client"` |
| Auth | Supabase Auth (`@supabase/ssr`) | Email/password + magic link + Google OAuth, cookie-based sessions work natively with Next.js middleware |
| Database | Supabase Postgres | Same project as Auth; RLS ties rows to `auth.uid()` directly |
| Data fetching | Server Components + Supabase server client for reads; Server Actions for writes | Avoids client-side waterfalls, keeps secrets server-side |
| Validation | Zod | Shared schema between client form and Server Action input validation |
| State (client) | React state + `useOptimistic` for form submits | Keep global state minimal; most state is server-derived |
| Deployment | Vercel | Native Next.js support, edge middleware for auth redirects |

### 2.1 Request Flow — Public Tool (Guest, no login)

```
Browser → Client Component (Converter/Calculator/Gap Calculator)
  → pure TS function (bandConverter.ts / overallScoreCalculator.ts / gapCalculator.ts)
  → result held in local React state (never persisted)
  → render as numeric badge + steppers
```

Conversion tables are fetched once from a **public, read-only Supabase table** (`band_conversion_tables` — see §5.4) so they can be updated without a redeploy, but the band math itself always runs **client-side** so guests get instant, zero-network results. Nothing about a guest's score or goal ever touches the database — it lives only in that page's React state (or `sessionStorage` if you want it to survive a refresh) and is discarded on navigation away, unless the user is logged in.

**Guest goal comparison:** on the calculator/gap-calculator pages, a logged-out user can also set a temporary "what am I aiming for" target in local state to see a live progress comparison against their entered scores — this never touches Supabase and disappears when they leave the page. It exists purely so guests get the "progress bar" experience before signing up.

### 2.2 Request Flow — Authenticated "Save Score to Tracker"

```
Browser (guest calculates result, sees "Save Score to Tracker" button)
  → Server Action (saveScoreFromCalculator)
  → Zod validation
  → Supabase server client (cookies-based session)
  → INSERT into test_scores (RLS enforces user_id = auth.uid())
  → revalidatePath('/dashboard')
```

This is the core conversion moment: the calculator UI is **identical** for guests and logged-in users, but logged-in users see an extra button beneath the result. Clicking it persists the just-calculated entry (including the raw inputs, not just the band) into `test_scores` without re-typing anything. The button uses the **Electric Violet accent** (`--accent`) per the design system, since it's a transactional CTA distinct from passive progress/success states, which stay Neon Emerald.

### 2.3 Request Flow — Authenticated Manual Log Entry

```
Browser (form) → Server Action (app/dashboard/log/actions.ts)
  → Zod validation
  → Supabase server client (cookies-based session)
  → INSERT into test_scores (RLS enforces user_id = auth.uid())
  → revalidatePath('/dashboard') 
  → redirect or optimistic UI update
```

### 2.4 Middleware & Route Protection

`middleware.ts` refreshes the Supabase session cookie on every request and redirects unauthenticated users away from `/dashboard/*` to `/login`, while leaving `/`, `/converter`, `/calculator`, `/gap-calculator` completely untouched.

```ts
// middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}
```

---

## 3. Design System & Theming — 21st.dev Supabase Theme

TargetBand ships with a single, forced dark theme modeled on the **21st.dev Supabase Theme** — no light mode toggle, no `prefers-color-scheme` fallback. Every screen (public tools and dashboard alike) renders on the same obsidian canvas.

### 3.1 Forced Dark Mode Setup

```tsx
// app/layout.tsx
import { ThemeProvider } from 'next-themes'
import { plusJakartaSans, jetBrainsMono } from '@/lib/fonts'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

`forcedTheme="dark"` (combined with `enableSystem={false}`) is what actually locks the app to dark mode regardless of OS setting — `defaultTheme="dark"` alone only controls the *initial* value and would still let a user's system preference override it, so both must be set together.

### 3.2 `globals.css` — CSS Theme Tokens

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root,
  .dark {
    /* Canvas — Deep Obsidian Black */
    --background: 0 0% 5%;              /* #0C0C0C */
    --foreground: 0 0% 98%;

    /* Cards & Surfaces — Dark Charcoal Slate */
    --card: 0 0% 9%;                    /* #171717 */
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 9%;
    --popover-foreground: 0 0% 98%;

    /* Borders — hairline 1px */
    --border: 0 0% 14.9%;               /* also exposed as border-white/10 utility */
    --input: 0 0% 14.9%;
    --ring: 142.1 70.6% 45.3%;

    /* Primary Accent — Neon Emerald (target progress, score matches, success) */
    --primary: 142.1 70.6% 45.3%;       /* #10B981 */
    --primary-foreground: 0 0% 5%;

    /* Secondary / Action Accent — Electric Violet (transactional CTAs) */
    --accent: 263.4 70% 50.4%;          /* #8B5CF6 */
    --accent-foreground: 0 0% 98%;

    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --destructive: 0 62.8% 50.6%;
    --destructive-foreground: 0 0% 98%;

    --radius: 0.75rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 3.3 Tailwind Token Wiring & Typography

```ts
// tailwind.config.ts (excerpt)
export default {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
}
```

```ts
// lib/fonts.ts
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

export const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
})

export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})
```

**Typography rule:** `Plus Jakarta Sans` (the default `font-sans`) is used for all interface text — labels, nav, buttons, body copy. `JetBrains Mono` (`font-mono`) is reserved for **tabular score metrics only** — band numbers, raw scores, table cells, and chart axis labels — so scores stay perfectly aligned and visually distinct from surrounding UI copy (`tabular-nums` should also be applied alongside `font-mono` for digit-width consistency).

### 3.4 Numeric Badge + Stepper Control (replaces plain text inputs)

Public tools no longer use generic `<input type="number">` boxes. Every score input is a **large numeric badge** (mono font, card surface, hairline border) flanked by `−` / `+` stepper buttons that increment in valid IELTS steps (whole numbers for raw scores, `0.5` for band scores).

```tsx
// components/shared/NumericStepperBadge.tsx
'use client'

import { Minus, Plus } from 'lucide-react'

interface NumericStepperBadgeProps {
  label: string
  value: number
  step?: number
  min?: number
  max?: number
  onChange: (value: number) => void
  accent?: 'primary' | 'accent'  // emerald for progress/results, violet for editable targets
}

export function NumericStepperBadge({
  label, value, step = 0.5, min = 0, max = 9, onChange, accent = 'primary',
}: NumericStepperBadgeProps) {
  const ringClass = accent === 'primary' ? 'ring-primary/40' : 'ring-accent/40'

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-card px-3 py-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, Number((value - step).toFixed(2))))}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <Minus size={16} />
        </button>

        <span
          className={`min-w-[3.5ch] rounded-lg px-3 py-1 text-center font-mono text-2xl font-semibold tabular-nums ring-1 ${ringClass}`}
        >
          {value.toFixed(1)}
        </span>

        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, Number((value + step).toFixed(2))))}
          className="rounded-full p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
```

Used across `RawScoreConverterForm`, `OverallScoreCalculatorForm`, and `GapCalculatorForm` — the four skill inputs and the final result badge are all instances of this component, with the **result** badge always rendered in the `primary` (emerald) accent, and any user-editable **target** badge rendered in `accent` (violet) to visually separate "what you got" from "what you're aiming for."

### 3.5 GitHub-Style Daily Practice Activity Heatmap

Added to the authenticated dashboard overview to visualize logging consistency — a 7-row (day-of-week) × ~53-column (week) grid, one cell per calendar day, shaded by whether/how many entries were logged that day.

```tsx
// components/dashboard/ActivityHeatmap.tsx
'use client'

interface DayActivity {
  date: string        // ISO date
  entryCount: number  // 0 = no practice logged that day
}

const INTENSITY_CLASSES = [
  'bg-white/5',        // 0 entries
  'bg-primary/25',      // 1 entry
  'bg-primary/50',      // 2 entries
  'bg-primary/75',      // 3 entries
  'bg-primary',          // 4+ entries
]

function intensityFor(count: number) {
  return INTENSITY_CLASSES[Math.min(count, INTENSITY_CLASSES.length - 1)]
}

export function ActivityHeatmap({ days }: { days: DayActivity[] }) {
  // `days` is pre-chunked server-side into 53 week-columns of 7 day-cells each
  const weeks = chunkIntoWeeks(days)

  return (
    <div className="rounded-xl border border-white/10 bg-card p-4">
      <h3 className="mb-3 text-sm font-medium text-muted-foreground">Practice activity</h3>
      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.entryCount} test${day.entryCount === 1 ? '' : 's'} logged`}
                className={`h-3 w-3 rounded-sm ${intensityFor(day.entryCount)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function chunkIntoWeeks(days: DayActivity[]): DayActivity[][] {
  const weeks: DayActivity[][] = []
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7))
  return weeks
}
```

The heatmap is fed by a Server Component that aggregates `test_scores` rows into `entryCount` per `test_date` (`group by test_date` over the last ~365 days) and passes the result down as a prop — no client-side Supabase calls.

### 3.6 Color Usage Rules (summary)

| Token | Hex / HSL | Used for |
|---|---|---|
| `--background` | `#0C0C0C` / `0 0% 5%` | App canvas |
| `--card` | `#171717` / `0 0% 9%` | Cards, panels, numeric badge surfaces |
| `--border` | `0 0% 14.9%` (`border-white/10`) | All hairline 1px borders |
| `--primary` (Neon Emerald) | `#10B981` / `142.1 70.6% 45.3%` | Target progress bars, goal-achieved states, result badges, heatmap intensity |
| `--accent` (Electric Violet) | `#8B5CF6` / `263.4 70% 50.4%` | Transactional CTAs — "Save Score to Tracker," "Create Goal," primary form submits |
| `--destructive` | `0 62.8% 50.6%` | Delete/archive-destructive actions only |

---

## 4. Comprehensive Security Architecture

TargetBand handles personally identifiable practice data (score history tied to real users), so security is treated as a first-class architectural layer, not an afterthought bolted on in Phase 4. The four controls below are **non-negotiable engineering requirements**, not suggestions — every PR touching auth, data access, or environment config should be checked against this section.

### 4.1 Supabase Row Level Security (RLS) Enforcement

Every user-owned table — `test_scores`, `user_goals`, and `profiles` — **must** have RLS enabled with policies that scope every CRUD operation to `auth.uid() = user_id` (or `auth.uid() = id` for `profiles`, since it's keyed directly on the auth user's id). This is the single most important control in the system: it guarantees **zero cross-tenant data leaks** even if application-layer logic has a bug, because Postgres itself refuses the query rather than the API route being trusted to filter correctly.

**Non-negotiable rules:**
- RLS must be enabled (`alter table ... enable row level security;`) on all three tables **before** any data is inserted — never ship a table "temporarily open" during development.
- Each table needs four explicit policies — `select`, `insert`, `update`, `delete` — each independently scoped to `auth.uid()`. Do not rely on a single blanket policy covering multiple operations; explicit per-operation policies make the intent auditable.
- `insert`/`update` policies must use `with check (auth.uid() = user_id)`, not just `using (...)`, so a user can't insert or rewrite a row and reassign it to someone else's `user_id`.
- `band_conversion_tables` is the one deliberate exception: RLS is still enabled, but its `select` policy uses `using (true)` since it's public reference data — no `insert`/`update`/`delete` policy exists for the `authenticated` or `anon` roles at all, so writes are only possible via the Supabase service role.
- The exact policies are defined per-table in §5 (formerly §4) — this section documents the *requirement*, §5 documents the *implementation*.
- **Verification is mandatory, not optional:** before any dashboard UI ships, create two test accounts in the Supabase SQL editor and confirm User A cannot `select`, `update`, or `delete` a row belonging to User B — for every table. This should also become an automated integration test (see §8 Phase 4).

### 4.2 Server-Side Data Validation (Strict Input Sanitization)

Client-side validation is a UX nicety, not a security boundary — a request can always be crafted by hand and sent directly to a Server Action or API route, bypassing the browser entirely. **Every** mutation path (`createScoreEntry`, `saveScoreFromCalculator`, `createGoal`, `archiveGoal`, and any future mutation) must re-validate with the shared Zod schemas from §7.4 *on the server*, inside the Server Action itself, before any Supabase call is made.

**Enforced constraints (via the `bandScore` Zod primitive):**
- Every band score field (`listening_band`, `reading_band`, `writing_band`, `speaking_band`, and all `target_*` goal fields) is rejected if it falls outside the **0.0–9.0** range.
- Every band score field is rejected if it is not a valid **0.5 increment** — enforced via `.refine((v) => (v * 2) % 1 === 0, ...)`, which rejects values like `6.3` or `7.85` that don't correspond to a real IELTS band.
- Raw scores (`listening_raw`, `reading_raw`) are rejected outside the **0–40** integer range.
- `safeParse` (never `parse`) is used in every Server Action so a malformed payload returns a structured `{ error }` instead of throwing an unhandled exception that could leak a stack trace to the client.
- Database `check` constraints (§5.2, §5.3) act as a **second, independent line of defense** below the Zod layer — even if a Server Action's validation were somehow bypassed or a future direct-to-DB integration were added, Postgres itself still refuses out-of-range values.

> **Defense-in-depth principle:** validation happens in three layers — the `NumericStepperBadge` UI (§3.4) physically can't produce an invalid value under normal use, Zod re-validates server-side in every Server Action, and Postgres `check` constraints reject anything that slips through both. No single layer is trusted alone.

### 4.3 API Key & Environment Variable Isolation

Supabase issues two distinct keys, and mixing them up is one of the most common — and most severe — mistakes in Supabase apps:

| Variable | Exposure | Rule |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-safe | Fine to expose — identifies the project, not a secret |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-safe | Safe *because* RLS (§4.1) is enforced on every table — this key can only do what RLS policies allow |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only, never client-exposed** | Bypasses RLS entirely. Must **never** be prefixed with `NEXT_PUBLIC_`, never imported into a `"use client"` file, and never returned in any API response |

**Enforced rules:**
- `SUPABASE_SERVICE_ROLE_KEY` is read only inside server-only contexts — Server Actions, Route Handlers, or scheduled/admin scripts — and only when a task genuinely requires bypassing RLS (e.g., writing to `band_conversion_tables` from an admin route, per §5.4). It is never imported by any file under `components/` or any module reachable from a Client Component.
- `.env.local` (and any `.env*` file containing real credentials) is added to `.gitignore` **before the first commit** — this is a repo-initialization step, not a later cleanup task. `.env.example` (with placeholder values only) is committed instead, so onboarding doesn't require guessing variable names.
- Vercel project environment variables are configured per-environment (Production / Preview / Development) rather than reusing one set of keys everywhere, so a compromised preview deployment can't expose production data.
- A pre-commit or CI check (e.g., `git-secrets`, or a simple grep step in the CI pipeline) should scan for accidental service-role-key commits — treat an exposed service role key as a **full data breach requiring immediate key rotation** in the Supabase dashboard, not a minor incident.

### 4.4 Rate Limiting & CAPTCHA on Auth Endpoints

Login and signup are the highest-value targets for credential-stuffing and automated abuse, so they get dedicated hardening beyond what RLS or Zod cover:

- **Supabase Auth native rate limits:** Supabase Auth already rate-limits sign-in, sign-up, and password-reset requests per IP/email out of the box. TargetBand relies on these as the first layer and does not attempt to reimplement rate limiting at the application level — the Supabase project's Auth rate-limit settings should be reviewed (not left at defaults without checking them) before launch, since default thresholds are tuned for general use and may need tightening for a smaller, targeted user base.
- **Cloudflare Turnstile on the frontend:** both `/login` and `/signup` forms embed a Turnstile widget; the resulting token is submitted alongside the credentials and verified server-side (via a call to Cloudflare's `siteverify` endpoint) inside the corresponding Server Action *before* the Supabase Auth call is made. A request with a missing or failed Turnstile token is rejected immediately, without ever reaching Supabase Auth — this keeps bot traffic from consuming Supabase's own rate-limit budget.
- Turnstile is used in preference to a traditional CAPTCHA because it's non-interactive by default (no "click all the traffic lights" friction) for legitimate users, which matters for a conversion-sensitive signup flow like TargetBand's guest→user funnel (§2.2).
- The Turnstile **secret key** follows the exact same isolation rule as the Supabase service role key (§4.3): server-only, never `NEXT_PUBLIC_`-prefixed, verified inside a Server Action.

```ts
// app/(auth)/signup/actions.ts (excerpt)
'use server'

async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY!, // server-only, never exposed
      response: token,
    }),
  })
  const data = await res.json()
  return data.success === true
}

export async function signUp(formData: { email: string; password: string; turnstileToken: string }) {
  const isHuman = await verifyTurnstile(formData.turnstileToken)
  if (!isHuman) return { error: 'CAPTCHA verification failed. Please try again.' }

  // Only reached after Turnstile passes — Supabase Auth's own native
  // rate limiting still applies underneath this as a second layer.
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
  })
  if (error) return { error: error.message }
  return { success: true }
}
```

### 4.5 Security Control Summary

| # | Control | Layer | Failure Mode Prevented |
|---|---|---|---|
| 4.1 | RLS on `test_scores`, `user_goals`, `profiles` (`auth.uid() = user_id`) | Database | Cross-tenant data leaks — one user reading/writing another user's rows |
| 4.2 | Zod validation in every Server Action (0.0–9.0 range, 0.5 steps) + DB `check` constraints | Application + Database | Invalid/malformed band scores corrupting data or downstream calculations |
| 4.3 | `SUPABASE_SERVICE_ROLE_KEY` server-only, `.env.local` gitignored | Environment / Deployment | Full RLS bypass exposed to the public client bundle |
| 4.4 | Supabase Auth native rate limits + Cloudflare Turnstile on login/signup | Network / Edge | Credential stuffing, automated account creation, brute-force login attempts |

---

## 5. Supabase Database Schema (SQL + RLS)

> Note: `auth.users` is managed by Supabase Auth. We create a `public.profiles` table (1:1 with `auth.users`) for app-specific user metadata, plus `test_scores` and `user_goals`, both scoped to `auth.uid()`.

```sql
-- ============================================================
-- 5.1 PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  target_test_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- 5.2 TEST_SCORES (daily logged practice / official results)
-- ============================================================
create type public.test_type as enum ('academic', 'general_training', 'practice_mock');

create table public.test_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  test_date date not null default current_date,
  test_type public.test_type not null default 'practice_mock',

  listening_band numeric(2,1) check (listening_band between 0 and 9),
  reading_band   numeric(2,1) check (reading_band between 0 and 9),
  writing_band   numeric(2,1) check (writing_band between 0 and 9),
  speaking_band  numeric(2,1) check (speaking_band between 0 and 9),

  -- optionally store raw scores for listening/reading (out of 40)
  listening_raw smallint check (listening_raw between 0 and 40),
  reading_raw   smallint check (reading_raw between 0 and 40),

  overall_band numeric(2,1) generated always as (
    round((
      coalesce(listening_band,0) + coalesce(reading_band,0) +
      coalesce(writing_band,0) + coalesce(speaking_band,0)
    ) / 4.0 * 2) / 2
  ) stored,

  notes text,
  created_at timestamptz not null default now()
);

create index idx_test_scores_user_date on public.test_scores (user_id, test_date desc);

alter table public.test_scores enable row level security;

create policy "Users can view own scores"
  on public.test_scores for select
  using (auth.uid() = user_id);

create policy "Users can insert own scores"
  on public.test_scores for insert
  with check (auth.uid() = user_id);

create policy "Users can update own scores"
  on public.test_scores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own scores"
  on public.test_scores for delete
  using (auth.uid() = user_id);


-- ============================================================
-- 5.3 USER_GOALS  (supports full goal history / archive, per product decision)
-- ============================================================
create table public.user_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  target_overall numeric(2,1) check (target_overall between 0 and 9),
  target_listening numeric(2,1) check (target_listening between 0 and 9),
  target_reading   numeric(2,1) check (target_reading between 0 and 9),
  target_writing   numeric(2,1) check (target_writing between 0 and 9),
  target_speaking  numeric(2,1) check (target_speaking between 0 and 9),

  label text,                          -- optional user-facing name, e.g. "Sept 2026 attempt"
  target_date date,
  is_active boolean not null default true,
  achieved_at timestamptz,             -- set when the user marks it achieved / it auto-archives
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- NOTE: unlike a single-active-goal design, multiple rows per user are expected here —
-- goal history is a first-class feature. "Active" just flags which goal drives the
-- dashboard's current progress bars; app logic (a Server Action) is responsible for
-- setting the previous active goal's is_active to false when a new one is activated,
-- so this is enforced at the application layer rather than a DB constraint.
create index idx_user_goals_active on public.user_goals (user_id, is_active);

alter table public.user_goals enable row level security;

create policy "Users can view own goals"
  on public.user_goals for select
  using (auth.uid() = user_id);

create policy "Users can insert own goals"
  on public.user_goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update own goals"
  on public.user_goals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own goals"
  on public.user_goals for delete
  using (auth.uid() = user_id);


-- ============================================================
-- 5.4 BAND_CONVERSION_TABLES  (public reference data, no RLS restriction —
-- readable by anyone, including guests, writable only via service role /
-- Supabase dashboard so the public calculator can fetch live values)
-- ============================================================
create type public.skill_type as enum ('listening', 'reading');

create table public.band_conversion_tables (
  id uuid primary key default gen_random_uuid(),
  skill public.skill_type not null,
  test_type public.test_type not null default 'academic',
  min_raw smallint not null check (min_raw between 0 and 40),
  band numeric(2,1) not null check (band between 0 and 9),
  effective_from date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_conversion_lookup on public.band_conversion_tables (skill, test_type, effective_from desc);

alter table public.band_conversion_tables enable row level security;

-- Public, read-only: anyone (including anonymous/guest users) can read.
create policy "Anyone can read conversion tables"
  on public.band_conversion_tables for select
  using (true);

-- No insert/update/delete policy is defined for authenticated/anon roles,
-- so writes are only possible via the Supabase service role (dashboard,
-- migrations, or an admin-only server route) — guests and regular users
-- can never modify these reference values.


-- ============================================================
-- 5.5 updated_at trigger helper (reused across tables)
-- ============================================================
create function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_goals_updated_at
  before update on public.user_goals
  for each row execute procedure public.set_updated_at();
```

**RLS design principle:** every policy checks `auth.uid() = user_id` (or `= id` for profiles). No table is ever readable/writable across users, and there is no "service role" exposure to the client — all authenticated queries run through the Supabase SSR client bound to the request's session cookie.

---

## 6. Next.js App Router Folder Structure

```
targetband/
├─ middleware.ts
├─ next.config.js
├─ tailwind.config.ts
├─ .env.local
│
├─ app/
│  ├─ layout.tsx                     # Root layout — ThemeProvider forced dark, font variables
│  ├─ globals.css                    # 21st.dev Supabase theme tokens (§3.2)
│  │
│  ├─ (public)/                      # Route group — no auth, own layout
│  │  ├─ layout.tsx                  # Public header/footer
│  │  ├─ page.tsx                    # Landing page
│  │  ├─ converter/
│  │  │  └─ page.tsx                 # Server Component: fetches conversion table, passes to client form
│  │  ├─ calculator/
│  │  │  └─ page.tsx
│  │  ├─ gap-calculator/
│  │  │  └─ page.tsx
│  │  └─ actions.ts                  # saveScoreFromCalculator (works for any logged-in user, called from any public tool)
│  │
│  ├─ (auth)/                        # Route group — login/signup
│  │  ├─ layout.tsx
│  │  ├─ login/
│  │  │  └─ page.tsx                 # Email/password + "Continue with Google"
│  │  ├─ signup/
│  │  │  └─ page.tsx
│  │  └─ auth/callback/route.ts      # Supabase OAuth/magic-link callback
│  │
│  └─ (dashboard)/                   # Route group — protected by middleware
│     ├─ layout.tsx                  # Sidebar shell, server-side user fetch
│     ├─ dashboard/
│     │  └─ page.tsx                 # Overview: goal progress, activity heatmap, latest scores
│     ├─ dashboard/log/
│     │  ├─ page.tsx                 # Form to add/edit entry
│     │  └─ actions.ts               # Server Actions: createScore, updateScore
│     ├─ dashboard/history/
│     │  ├─ page.tsx                 # Table + Recharts trend view
│     │  └─ actions.ts               # deleteScore
│     ├─ dashboard/goals/
│     │  ├─ page.tsx                 # Active goal + collapsible "Past Goals" archive list
│     │  └─ actions.ts               # createGoal (archives prior active goal), archiveGoal, reactivateGoal
│     └─ dashboard/settings/
│        └─ page.tsx
│
├─ components/
│  ├─ ui/                            # shadcn/ui primitives (Button, Card, Input…) themed to §3
│  ├─ converter/
│  │  ├─ RawScoreConverterForm.tsx   # Uses NumericStepperBadge
│  │  └─ BandResultDisplay.tsx
│  ├─ calculator/
│  │  ├─ OverallScoreCalculatorForm.tsx
│  │  └─ GuestGoalCompareWidget.tsx   # local-state-only target input + progress bar, no DB
│  ├─ gap-calculator/
│  │  └─ GapCalculatorForm.tsx
│  ├─ dashboard/
│  │  ├─ ScoreLogForm.tsx
│  │  ├─ GoalProgressCard.tsx
│  │  ├─ ActivityHeatmap.tsx         # GitHub-style daily practice heatmap (§3.5)
│  │  ├─ ScoreTrendChart.tsx         # Recharts wrapper, "use client"
│  │  └─ ScoreHistoryTable.tsx
│  └─ shared/
│     ├─ Navbar.tsx
│     ├─ Footer.tsx
│     ├─ SignUpCTA.tsx               # Contextual conversion banner (guests, logged out)
│     ├─ SaveScoreButton.tsx         # Renders only if a session exists; calls saveScoreFromCalculator
│     └─ NumericStepperBadge.tsx     # Numeric badge + stepper controls (§3.4)
│
├─ lib/
│  ├─ supabase/
│  │  ├─ client.ts                   # browser client
│  │  ├─ server.ts                   # server component/action client
│  │  └─ middleware.ts               # session refresh helper
│  ├─ ielts/
│  │  ├─ bandConverter.ts            # raw → band lookup tables + fn
│  │  ├─ overallScoreCalculator.ts   # rounding algorithm
│  │  └─ gapCalculator.ts            # reverse "what do I need" math
│  ├─ validation/
│  │  └─ schemas.ts                  # Zod schemas (scoreEntrySchema, goalSchema)
│  ├─ fonts.ts                       # next/font/google — Plus Jakarta Sans + JetBrains Mono
│  └─ utils.ts
│
├─ types/
│  └─ database.types.ts              # generated via `supabase gen types typescript`
│
└─ supabase/
   └─ migrations/
      ├─ 0001_profiles.sql
      ├─ 0002_test_scores.sql
      ├─ 0003_user_goals.sql
      └─ 0004_band_conversion_tables.sql
```

---

## 7. Core Component Breakdown & Business Logic

### 7.1 `lib/ielts/overallScoreCalculator.ts` — Official Rounding Algorithm

IELTS rounds the average of the four skill bands to the nearest whole or half band, with **ties rounding up** (an average ending in exactly `.25` rounds up to `.5`; an average ending in exactly `.75` rounds up to the next whole band). Because each skill score is itself a multiple of `0.5`, the four-way average always lands on a multiple of `0.125`, so this tie case is common and must be handled explicitly — a naive round-to-nearest-0.5 is not enough if it rounds ties down.

```ts
// lib/ielts/overallScoreCalculator.ts

export interface SkillScores {
  listening: number
  reading: number
  writing: number
  speaking: number
}

/**
 * Rounds a raw average to the nearest valid IELTS band (multiples of 0.5),
 * rounding .25 up to .5 and .75 up to the next whole band (round-half-up).
 */
export function roundToIeltsBand(average: number): number {
  // Multiply by 2 to work in "half-band units", round-half-up, divide back.
  const halfBandUnits = Math.round(average * 2)
  return halfBandUnits / 2
}

export function calculateOverallBand(scores: SkillScores): number {
  const { listening, reading, writing, speaking } = scores
  const values = [listening, reading, writing, speaking]

  values.forEach((v) => {
    if (v < 0 || v > 9) throw new Error('Each band score must be between 0 and 9.')
  })

  const average = values.reduce((sum, v) => sum + v, 0) / 4
  return roundToIeltsBand(average)
}

/*
  Verified examples:
  calculateOverallBand({listening:6.5, reading:6, writing:6, speaking:6.5})
    → average 6.25 → rounds UP to 6.5   ✔ matches spec example
  calculateOverallBand({listening:6, reading:6, writing:6.5, speaking:6})
    → average 6.125 → rounds DOWN to 6.0 ✔ matches spec example
*/
```

**Why `Math.round(average * 2) / 2` works:** shifting to half-band units turns the target grid (0, 0.5, 1.0, …) into integers (0, 1, 2, …). `Math.round()` in JavaScript rounds `.5` away from zero (i.e., up, for positive numbers) — which is exactly the IELTS tie-breaking rule. This one-liner correctly reproduces the official behavior without a lookup table.

### 7.2 `lib/ielts/bandConverter.ts` — Raw Score → Band Conversion

Official raw-to-band conversion tables vary slightly between test administrations (Listening/Reading difficulty is calibrated per sitting), so IELTS does not publish one fixed universal table. The architecture should treat this as **configurable data**, not hardcoded logic:

```ts
// lib/ielts/bandConverter.ts

export interface BandThreshold {
  minRaw: number   // inclusive
  band: number
}

// Representative Academic Reading conversion table (illustrative — update
// with the latest official/estimated table before shipping; consider
// storing this in a `band_conversion_tables` DB table if it needs to be
// updated without a redeploy).
export const READING_ACADEMIC_TABLE: BandThreshold[] = [
  { minRaw: 39, band: 9 }, { minRaw: 37, band: 8.5 }, { minRaw: 35, band: 8 },
  { minRaw: 33, band: 7.5 }, { minRaw: 30, band: 7 }, { minRaw: 27, band: 6.5 },
  { minRaw: 23, band: 6 }, { minRaw: 19, band: 5.5 }, { minRaw: 15, band: 5 },
  { minRaw: 13, band: 4.5 }, { minRaw: 10, band: 4 }, { minRaw: 8, band: 3.5 },
  { minRaw: 0, band: 0 },
]

export const LISTENING_TABLE: BandThreshold[] = [
  { minRaw: 39, band: 9 }, { minRaw: 37, band: 8.5 }, { minRaw: 35, band: 8 },
  { minRaw: 32, band: 7.5 }, { minRaw: 30, band: 7 }, { minRaw: 26, band: 6.5 },
  { minRaw: 23, band: 6 }, { minRaw: 18, band: 5.5 }, { minRaw: 16, band: 5 },
  { minRaw: 13, band: 4.5 }, { minRaw: 10, band: 4 }, { minRaw: 0, band: 3.5 },
]

export function rawScoreToBand(
  rawScore: number,
  table: BandThreshold[]
): number {
  if (rawScore < 0 || rawScore > 40) {
    throw new Error('Raw score must be between 0 and 40.')
  }
  const sorted = [...table].sort((a, b) => b.minRaw - a.minRaw)
  const match = sorted.find((row) => rawScore >= row.minRaw)
  return match ? match.band : 0
}
```

> **Product note:** flag this table as an editable data source (JSON or a Supabase `band_conversion_tables` table) in the UI copy, e.g. *"Band boundaries are estimates and can shift slightly between test administrations."* This avoids over-promising precision the real IELTS scoring doesn't guarantee either.

### 7.3 `lib/ielts/gapCalculator.ts` — "What Do I Need?" Reverse Calculator

```ts
// lib/ielts/gapCalculator.ts
import { roundToIeltsBand } from './overallScoreCalculator'

export interface GapCalculatorInput {
  knownScores: [number, number, number]  // any 3 of the 4 skills
  targetOverall: number
}

export interface GapCalculatorResult {
  requiredScore: number | null   // null if unreachable even at 9.0
  isAchievable: boolean
}

const VALID_BAND_STEPS: number[] = Array.from({ length: 19 }, (_, i) => i * 0.5) // 0..9

/**
 * Finds the minimum band score needed in the 4th (unknown) skill so the
 * rounded overall meets or exceeds the target, by testing every valid
 * 0.5-increment band value from 0 to 9.
 */
export function calculateRequiredScore(
  input: GapCalculatorInput
): GapCalculatorResult {
  const { knownScores, targetOverall } = input
  const sumKnown = knownScores.reduce((a, b) => a + b, 0)

  for (const candidate of VALID_BAND_STEPS) {
    const average = (sumKnown + candidate) / 4
    const overall = roundToIeltsBand(average)
    if (overall >= targetOverall) {
      return { requiredScore: candidate, isAchievable: true }
    }
  }

  return { requiredScore: null, isAchievable: false }
}
```

### 7.4 `lib/validation/schemas.ts` — Shared Zod Schemas

```ts
import { z } from 'zod'

const bandScore = z
  .number()
  .min(0).max(9)
  .refine((v) => (v * 2) % 1 === 0, 'Band score must be in 0.5 increments')

export const scoreEntrySchema = z.object({
  test_date: z.string().date(),
  test_type: z.enum(['academic', 'general_training', 'practice_mock']),
  listening_band: bandScore,
  reading_band: bandScore,
  writing_band: bandScore,
  speaking_band: bandScore,
  listening_raw: z.number().int().min(0).max(40).optional(),
  reading_raw: z.number().int().min(0).max(40).optional(),
  notes: z.string().max(500).optional(),
})

export const goalSchema = z.object({
  target_overall: bandScore,
  target_listening: bandScore,
  target_reading: bandScore,
  target_writing: bandScore,
  target_speaking: bandScore,
  target_date: z.string().date().optional(),
})
```

### 7.5 Server Action Example — Saving a Score Entry

```ts
// app/(dashboard)/dashboard/log/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { scoreEntrySchema } from '@/lib/validation/schemas'

export async function createScoreEntry(formData: unknown) {
  const parsed = scoreEntrySchema.safeParse(formData)
  if (!parsed.success) {
    return { error: parsed.error.flatten() }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('test_scores')
    .insert({ ...parsed.data, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/history')
  return { success: true }
}
```

### 7.6 Server Action — "Save Score to Tracker" from a Public Calculator

This is the bridge between the guest-facing calculators and the authenticated tracker. It's called from the *same* form component whether the user arrived via `/converter`, `/calculator`, or `/gap-calculator` — the button simply doesn't render if there's no session.

```ts
// app/(public)/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { scoreEntrySchema } from '@/lib/validation/schemas'

export async function saveScoreFromCalculator(formData: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Guests silently no-op here — the button should never be visible to
  // them, but this guards against a stale/expired session on submit.
  if (!user) return { error: 'You must be signed in to save a result.' }

  const parsed = scoreEntrySchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const { error } = await supabase
    .from('test_scores')
    .insert({ ...parsed.data, user_id: user.id, test_type: 'practice_mock' })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/history')
  return { success: true }
}
```

```tsx
// components/shared/SaveScoreButton.tsx
'use client'

import { useTransition } from 'react'
import { saveScoreFromCalculator } from '@/app/(public)/actions'

export function SaveScoreButton({ scoreData, isLoggedIn }: {
  scoreData: Record<string, unknown>
  isLoggedIn: boolean
}) {
  const [isPending, startTransition] = useTransition()
  if (!isLoggedIn) return null // guests never see this — result stays client-side only

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => saveScoreFromCalculator(scoreData))}
      className="mt-4 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {isPending ? 'Saving…' : 'Save Score to Tracker'}
    </button>
  )
}
```

Per the design system (§3.6), this is a **transactional CTA**, so it uses `bg-accent` (Electric Violet) rather than the emerald primary — the primary color is reserved for progress/success states, keeping "take an action" visually distinct from "here's how you're doing."

### 7.7 Server Actions — Goal History / Archiving

Because goal history is a first-class feature (not single-active-goal), "creating a new goal" is really "archive the current active goal, then insert a new active one":

```ts
// app/(dashboard)/dashboard/goals/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { goalSchema } from '@/lib/validation/schemas'

export async function createGoal(formData: unknown) {
  const parsed = goalSchema.safeParse(formData)
  if (!parsed.success) return { error: parsed.error.flatten() }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  // Archive whatever goal is currently active before inserting the new one.
  await supabase
    .from('user_goals')
    .update({ is_active: false })
    .eq('user_id', user.id)
    .eq('is_active', true)

  const { error } = await supabase
    .from('user_goals')
    .insert({ ...parsed.data, user_id: user.id, is_active: true })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/goals')
  return { success: true }
}

export async function archiveGoal(goalId: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('user_goals')
    .update({ is_active: false, achieved_at: new Date().toISOString() })
    .eq('id', goalId) // RLS still restricts this to auth.uid() = user_id under the hood
  if (error) return { error: error.message }
  revalidatePath('/dashboard/goals')
  return { success: true }
}
```

**Guest goal comparison** (no Server Action, no Supabase call at all — themed with the shared `NumericStepperBadge` and emerald progress track):

```tsx
// components/calculator/GuestGoalCompareWidget.tsx
'use client'
import { useState } from 'react'
import { NumericStepperBadge } from '@/components/shared/NumericStepperBadge'

export function GuestGoalCompareWidget({ currentOverall }: { currentOverall: number }) {
  const [target, setTarget] = useState(7.0) // purely local state, never persisted

  const progressPct = Math.min(100, Math.round((currentOverall / target) * 100))

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-card p-4">
      <NumericStepperBadge
        label="Compare against a target"
        value={target}
        onChange={setTarget}
        accent="accent"
      />
      <div className="mt-3 h-2 w-full rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progressPct}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Sign up to save this goal and track it over multiple attempts.
      </p>
    </div>
  )
}
```

### 7.8 Component Responsibility Table

| Component | Type | Responsibility |
|---|---|---|
| `NumericStepperBadge` | Client | Shared numeric badge + `−`/`+` steppers; used everywhere a score is entered or displayed |
| `RawScoreConverterForm` | Client | Numeric input via `NumericStepperBadge`, live-calls `rawScoreToBand`, no network |
| `OverallScoreCalculatorForm` | Client | 4 skill badges, live-calls `calculateOverallBand` |
| `GapCalculatorForm` | Client | 3 known-score badges + target, calls `calculateRequiredScore` |
| `ScoreLogForm` | Client (calls Server Action) | Validated form → `createScoreEntry` |
| `SaveScoreButton` | Client (calls Server Action) | Hidden for guests; violet CTA; persists a calculator result → `saveScoreFromCalculator` |
| `GuestGoalCompareWidget` | Client, local state only | Lets guests set a throwaway target and see a live emerald progress bar, no DB writes |
| `ActivityHeatmap` | Server-fed / client render | GitHub-style daily practice grid, emerald intensity scale |
| `ScoreTrendChart` | Client (`"use client"`, Recharts) | Renders `<LineChart>` from server-fetched history prop |
| `GoalProgressCard` | Server Component | Fetches active goal + latest scores, renders emerald progress bars |
| Goals archive list | Server Component | Fetches `is_active = false` goals, renders read-only history with achieved dates |
| `dashboard/page.tsx` | Server Component | Aggregates active goal + activity heatmap data + recent entries via Supabase server client |
| `middleware.ts` | Edge middleware | Refreshes session, gates `/dashboard/*` |

---

## 8. Step-by-Step Implementation Roadmap

### Phase 0 — Design System Foundation
1. Install `next-themes`; wire `app/layout.tsx` with `ThemeProvider` (`forcedTheme="dark"`, `enableSystem={false}`) per §3.1.
2. Author `app/globals.css` with the full token set from §3.2, and extend `tailwind.config.ts` per §3.3.
3. Register `Plus Jakarta Sans` and `JetBrains Mono` via `lib/fonts.ts`; confirm `font-mono` renders correctly on a scratch page before building real UI on top of it.
4. Build `NumericStepperBadge` (§3.4) and `ActivityHeatmap` (§3.5) as standalone, storybook-able components before wiring them into real pages — they're reused across nearly every screen in the app.

### Phase 1 — Public Converter (guest-only, all client-side math)
1. Scaffold Next.js + Tailwind project; set up `(public)` route group and shared layout/navbar, all rendering on the Phase 0 theme.
2. Provision the Supabase project early just for `band_conversion_tables` (§5.4) — it's public/read-only and has no dependency on auth, so it can ship before any auth work exists.
3. Implement `lib/ielts/bandConverter.ts` + unit tests for boundary values; `converter/page.tsx` fetches the table server-side and hands it to a client form so the actual band lookup runs instantly in the browser.
4. Build `/converter` page: `RawScoreConverterForm` using `NumericStepperBadge` for input/output, no plain text boxes.
5. Deploy to Vercel early — this page alone is shippable and SEO-indexable, with zero auth dependency.

### Phase 2 — Overall Calculator + Gap Calculator (still guest-only)
1. Implement `lib/ielts/overallScoreCalculator.ts`; write unit tests covering the `.25`/`.75` tie cases explicitly (per the spec's own examples).
2. Build `/calculator` page reusing the `NumericStepperBadge` pattern from Phase 1.
3. Implement `lib/ielts/gapCalculator.ts`; build `/gap-calculator` with 3-known-scores + target input, surfacing "Not achievable — max is X.X" gracefully.
4. Add `GuestGoalCompareWidget` (violet target badge + emerald progress bar) to the calculator pages so guests get a taste of goal-tracking before signing up.
5. Add the dismissible `SignUpCTA` banner on all three public tools (link to `/signup`, no backend wiring yet).

### Phase 3 — Auth & Dashboard Tracker
1. Run migrations for `profiles`, `test_scores`, `user_goals`, `band_conversion_tables` (§5); verify RLS with the Supabase SQL editor using two test accounts before writing any UI — this is the mandatory §4.1 verification step, not optional cleanup.
2. Add the Cloudflare Turnstile widget to `/login` and `/signup` and wire server-side verification per §4.4, and review the Supabase Auth project's native rate-limit thresholds before any real signups happen.
3. Implement `lib/supabase/{client,server,middleware}.ts` and `middleware.ts` route protection, keeping `SUPABASE_SERVICE_ROLE_KEY` out of every client-reachable module per §4.3.
4. Configure Google OAuth in the Supabase Auth dashboard (client ID/secret, authorized redirect URI); build `/login` and `/signup` with both email/password and a "Continue with Google" button, plus the `auth/callback` route handler for the OAuth redirect.
5. Build `(dashboard)` layout with sidebar; implement `dashboard/log` (Server Action + Zod validation from §7.4, enforced per §4.2).
6. Implement `saveScoreFromCalculator` (§7.6) and mount `SaveScoreButton` on all three public tools — this is the guest→user conversion moment, so test it end-to-end early.
7. Implement `dashboard/goals` with archive-on-create semantics (`createGoal`/`archiveGoal`, §7.7) and a "Past Goals" list.
8. Implement `dashboard/history`: table view (mono-font score cells) + `ScoreTrendChart` (Recharts `<LineChart>` with 4 skill lines + overall, themed to the emerald/violet palette).
9. Implement `dashboard` overview: `GoalProgressCard` reading the *active* goal, the `ActivityHeatmap`, and progress bars (current rolling average vs. target per skill).

### Phase 4 — Polish & Hardening (recommended, not in original scope but worth flagging)
1. Add Supabase Auth email confirmation flow (rate limiting and CAPTCHA are already covered as Phase 3 requirements per §4.4, not deferred here).
2. Add empty states, loading skeletons, and error boundaries per route (themed to the dark card surfaces, not default light skeleton grays).
3. Add `robots.txt` + metadata/OpenGraph tags to public pages for SEO (dark-mode OG image variant recommended, matching the obsidian brand).
4. Formalize the §4.1 manual RLS verification into an automated integration test suite (attempt cross-user reads/writes across all four tables and confirm rejection).
5. Add a CI step that scans for accidentally committed secrets (§4.3) before every merge.
6. Add CSV export of score history for authenticated users.

---

## 9. Open Questions / Assumptions

Resolved via follow-up:
- ✅ Conversion tables live in a public, read-only Supabase table (`band_conversion_tables`); math runs client-side for guests, with a "Save Score to Tracker" button for logged-in users.
- ✅ Goal history is fully supported (archive-on-create pattern); guests get a local-state-only comparison widget instead.
- ✅ Auth includes Google OAuth alongside email/password + magic link.
- ✅ Rebranded to **TargetBand**, running the 21st.dev Supabase Theme in forced dark mode with Neon Emerald / Electric Violet accents, Plus Jakarta Sans / JetBrains Mono typography, numeric-badge score inputs, and a GitHub-style activity heatmap.
- ✅ Added §4 Comprehensive Security Architecture covering RLS enforcement, server-side Zod validation, service-role-key isolation, and Turnstile + native rate limiting on auth endpoints.

Still open:
- **Cloudflare Turnstile account setup:** §4.4 assumes a Cloudflare account and Turnstile site key/secret pair already exist. If you haven't created one yet, that's a prerequisite for the Phase 3 Turnstile step — happy to walk through getting the site/secret key pair when you're ready.
- **Writing/Speaking raw scores:** Only Listening/Reading have raw-out-of-40 scores in real IELTS; Writing/Speaking are examiner-assessed bands directly. The schema reflects that (`writing_band`/`speaking_band` only, no raw columns) — let me know if you actually want a rubric-based Writing/Speaking sub-score estimator too.
- **Guest state persistence:** I assumed guest calculator/goal state resets on page leave (plain `useState`). If you'd rather it survive a refresh, swap it for `sessionStorage` — flag if you want that built in from Phase 2.
- **Google OAuth consent screen branding:** you'll need a verified Google Cloud project + OAuth consent screen (app name "TargetBand," logo, privacy policy URL) before this can go to production users — happy to walk through that setup when you're ready for Phase 3.
- **Logo / favicon / OG image:** the design system covers UI tokens but not a mark — let me know if you want a wordmark or icon concept for "TargetBand" to round out the brand.

Happy to generate the actual starter repo (package.json, initial commits per phase) or expand any single section (e.g., full Recharts theming, or the signup/login forms in the new palette) next — just say which part to build out first.
