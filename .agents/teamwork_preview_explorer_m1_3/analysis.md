# Milestone 1 — Scope M1-3 Detailed Analysis: Public & Legal Pages, 404 Page, and Tools

## Executive Summary
This analysis details the exact line-by-line defects and required token replacements across Public and Legal Pages (`app/cookies/page.tsx`, `app/privacy/page.tsx`, `app/terms/page.tsx`), the 404 Error Page (`app/not-found.tsx`), the About Page (`app/about/page.tsx`), and Interactive Tool Components (`components/tools/ConverterTool.tsx`).

The issues identified fall into four main categories:
1. **Low-Contrast Page Heading Gradients**: `bg-gradient-to-r from-white via-zinc-200 to-zinc-400` and `bg-gradient-to-b from-white to-white/60` render white-on-white text in light mode, violating WCAG 2.1 AA standards and making titles invisible.
2. **Hardcoded Body Text Colors**: `text-zinc-300` and `text-zinc-400` result in ~1.3:1 contrast against light mode background (`#ffffff`).
3. **Hardcoded White Borders**: `border-white/10` is invisible against light mode card backgrounds.
4. **Hardcoded Button Text Color**: `text-white` inside `ConverterTool.tsx` buttons prevents proper pairing with semantic `--accent-foreground` tokens.

---

## 1. File-by-File Breakdown & Replacement Specifications

### 1.1 `app/cookies/page.tsx`
- **Location**: `app/cookies/page.tsx`
- **Issues**:
  - Line 22: Hardcoded heading gradient `from-white via-zinc-200 to-zinc-400` renders white text on white in light mode.
  - Line 26: `text-zinc-400` in "Last updated" metadata row has low contrast.
  - Line 52: `border-white/10` in main content card border.
  - Lines 61, 88, 99: `text-zinc-300` body text in sections 1, 3, and 4.

#### Exact Replacements

**Replacement 1 (Hero Title Gradient & Date Metadata, lines 22–26)**:
```tsx
<<<< BEFORE (Line 22-26)
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          Cookie Policy
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
==== AFTER
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Cookie Policy
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
>>>>
```

**Replacement 2 (Main Content Container Border, line 52)**:
```tsx
<<<< BEFORE (Line 52)
        <div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
==== AFTER
        <div className="lg:col-span-9 bg-card/40 border border-border rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
>>>>
```

**Replacement 3 (Body Paragraphs, lines 61, 88, 99)**:
```tsx
<<<< BEFORE (Lines 61, 88, 99)
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
==== AFTER
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
>>>>
```

---

### 1.2 `app/privacy/page.tsx`
- **Location**: `app/privacy/page.tsx`
- **Issues**:
  - Line 23: Heading gradient `from-white via-zinc-200 to-zinc-400`.
  - Line 27: `text-zinc-400` in date subtitle.
  - Line 55: `border-white/10` in main content container.
  - Lines 64, 75, 79, 83, 87, 100, 104, 108, 112, 135, 146, 166: `text-zinc-300` in paragraphs and bullet points.

#### Exact Replacements

**Replacement 1 (Hero Title Gradient & Date Metadata, lines 23–27)**:
```tsx
<<<< BEFORE (Lines 23-27)
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          Privacy Policy
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
==== AFTER
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Privacy Policy
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
>>>>
```

**Replacement 2 (Main Container Card Border, line 55)**:
```tsx
<<<< BEFORE (Line 55)
        <div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
==== AFTER
        <div className="lg:col-span-9 bg-card/40 border border-border rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
>>>>
```

**Replacement 3 (Body Text and Bullet Lists, lines 64, 75, 79, 83, 87, 100, 104, 108, 112, 135, 146, 166)**:
- In `<p className="text-zinc-300 ...">` → replace `text-zinc-300` with `text-muted-foreground`
- In `<li className="flex items-start gap-3 text-zinc-300 ...">` → replace `text-zinc-300` with `text-muted-foreground`

---

### 1.3 `app/terms/page.tsx`
- **Location**: `app/terms/page.tsx`
- **Issues**:
  - Line 22: Heading gradient `from-white via-zinc-200 to-zinc-400`.
  - Line 26: `text-zinc-400` in date subtitle.
  - Line 53: `border-white/10` in main content container.
  - Lines 62, 73, 93, 104, 108, 112, 125: `text-zinc-300` in paragraphs and bullet points.

#### Exact Replacements

**Replacement 1 (Hero Title Gradient & Date Metadata, lines 22–26)**:
```tsx
<<<< BEFORE (Lines 22-26)
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
          Terms of Service
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400">
==== AFTER
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          Terms of Service
        </h1>
        
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
>>>>
```

**Replacement 2 (Main Container Card Border, line 53)**:
```tsx
<<<< BEFORE (Line 53)
        <div className="lg:col-span-9 bg-card/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
==== AFTER
        <div className="lg:col-span-9 bg-card/40 border border-border rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-sm shadow-xl">
>>>>
```

**Replacement 3 (Body Text and Bullet Lists, lines 62, 73, 93, 104, 108, 112, 125)**:
- In `<p className="text-zinc-300 ...">` → replace `text-zinc-300` with `text-muted-foreground`
- In `<li className="flex items-start gap-3 text-zinc-300 ...">` → replace `text-zinc-300` with `text-muted-foreground`

---

### 1.4 `app/not-found.tsx`
- **Location**: `app/not-found.tsx`
- **Issue**:
  - Line 20: Heading gradient `from-white to-white/60` causes the giant "404" number to render white text on white background in Light Mode (completely illegible).

#### Exact Replacements

**Replacement 1 (404 Gradient Number, line 19–25)**:
```tsx
<<<< BEFORE (Lines 19-25)
          <h1 
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] relative"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            404
          </h1>
==== AFTER
          <h1 
            className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50 tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.3)] relative"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            404
          </h1>
>>>>
```

---

### 1.5 `app/about/page.tsx`
- **Location**: `app/about/page.tsx`
- **Issues**:
  - Lines 27 & 37: `border-white/10` on value cards creates invisible borders in light mode.

#### Exact Replacements

**Replacement 1 (Precision Tracking Card, line 27)**:
```tsx
<<<< BEFORE (Line 27)
        <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-4 hover:border-emerald-500/30 transition-colors">
==== AFTER
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:border-emerald-500/30 transition-colors">
>>>>
```

**Replacement 2 (Actionable Analytics Card, line 37)**:
```tsx
<<<< BEFORE (Line 37)
        <div className="bg-card/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-4 hover:border-violet-500/30 transition-colors">
==== AFTER
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-4 hover:border-violet-500/30 transition-colors">
>>>>
```

---

### 1.6 `components/tools/ConverterTool.tsx`
- **Location**: `components/tools/ConverterTool.tsx`
- **Issue**:
  - Lines 40, 50, 60: Active state button classes use `bg-accent text-white` instead of `bg-accent text-accent-foreground`.

#### Exact Replacements

**Replacement 1 (Test Type Toggle Buttons, lines 37–67)**:
```tsx
<<<< BEFORE (Lines 37-67)
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "listening" 
                  ? "bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("listening")}
            >
              Listening
            </button>
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "reading_academic" 
                  ? "bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("reading_academic")}
            >
              Academic Reading
            </button>
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "reading_general" 
                  ? "bg-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("reading_general")}
            >
              General Reading
            </button>
==== AFTER
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "listening" 
                  ? "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("listening")}
            >
              Listening
            </button>
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "reading_academic" 
                  ? "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("reading_academic")}
            >
              Academic Reading
            </button>
            <button 
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                testType === "reading_general" 
                  ? "bg-accent text-accent-foreground shadow-[0_0_15px_rgba(139,92,246,0.4)]" 
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setTestType("reading_general")}
            >
              General Reading
            </button>
>>>>
```

---

## 2. Verification Plan for Implementer (Worker)
1. **Search Scan**:
   - Run `rg "from-white" app/` → Confirm 0 occurrences.
   - Run `rg "text-zinc-" app/` → Confirm 0 occurrences.
   - Run `rg "border-white/10" app/about/` → Confirm 0 occurrences.
   - Run `rg "text-white" components/tools/` → Confirm 0 occurrences.
2. **Build and Typecheck**:
   - `npm run lint`
   - `npx tsc --noEmit`
