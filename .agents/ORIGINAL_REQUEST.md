# Original User Request

## Initial Request — 2026-08-21T15:49:20+07:00

# Teamwork Project Prompt — Draft

> Status: Ready for launch — awaiting user approval
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: multi-agent task force (QA, UI/UX, Lead Developer)

Conduct a comprehensive end-to-end audit, UI/UX polish, and bug-fix pass on the TargetBand repository. The goal is to stabilize the UI, ensure flawless light/dark mode parity, resolve layout shifts, and optimize React performance.

Working directory: c:/Users/Minh Khang/Downloads/targetband
Integrity mode: development

## Requirements

### R1. Discovery & Static Analysis
- Run `npm run lint` and `npx tsc --noEmit` to catch type or linting regressions.
- Scan for remaining hardcoded color classes (e.g., `bg-[#09090b]`, `text-white`) in layouts, tools, and auth components.
- Identify unmemoized array sorting or heavy calculations in client components.

### R2. Cross-Examination & Bug Rectification
- Replace all hardcoded color classes with semantic Tailwind variables across the entire app.
- Ensure Recharts containers have proper responsive wrappers (`min-w-0`) and that Tooltip components dynamically map to CSS theme variables instead of hardcoded hex colors.
- Audit the global layout to ensure `overflow-x-hidden` is applied, preventing mobile horizontal scrolling.

### R3. Implementation & Build Verification
- Execute the approved fixes directly into the codebase.
- The team must guarantee a 100% green production build before reporting back.

## Acceptance Criteria

### Verification
- [ ] `npm run lint` executes with 0 errors.
- [ ] `npx tsc --noEmit` executes with 0 errors.
- [ ] `npm run build` completes successfully, generating a 100% green production build.
- [ ] Codebase search reveals 0 instances of hardcoded dark-mode hex backgrounds (e.g., `#09090b`) in page layouts or major components.
- [ ] `overflow-x-hidden` is verified in the global root layout.
