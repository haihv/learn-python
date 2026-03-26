# Learn Python — Project Guide

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript** (strict mode, `@/*` path alias)
- **Tailwind CSS v4** (`@theme inline` in `globals.css`, no `tailwind.config.ts`)
- **Zustand v5** with `persist` middleware
- **CodeMirror 6** via `@uiw/react-codemirror` + `@codemirror/lang-python`
- **react-markdown** + **remark-gfm** for markdown rendering
- **canvas-confetti** for celebrations
- **Pyodide** (v0.29.3 via jsDelivr CDN) for Python execution — runs in a Web Worker

## Architecture

```
lib/curriculum/types.ts   ← single source of truth for all TypeScript types
lib/curriculum/modules/   ← one file per module, exports a typed CourseModule
lib/curriculum/index.ts   ← aggregates all modules into `curriculum[]`
                                     ↓
app/learn/[moduleId]/page.tsx  ← server component, resolves slug → module
                                     ↓
components/{lesson,workshop,lab}/  ← client components per activity type
                                     ↓
components/editor/PythonEditor.tsx ← CodeMirror, browser-only
lib/python-runner.ts               ← POSTs to /api/run, parses result
lib/test-runner.ts                 ← evaluates LabTest[] against code + stdout
store/course.ts                    ← Zustand store, persists to localStorage
```

## Color Tokens

All accent colors use the `python-` prefix defined in `app/globals.css`:
- `python-blue` (#3776ab) — primary accent (buttons, links, active tab)
- `python-yellow` (#ffd43b) — hints, warnings
- `python-green` (#4caf50) — success, passing tests
- `python-red` (#f44336) — errors, failing tests
- `python-purple` (#9c27b0) — workshops, strong emphasis
- `python-cyan` (#00bcd4) — lessons, headings

## Key Conventions

- `"use client"` on every component that uses hooks or browser APIs
- CodeMirror and confetti must be dynamically imported with `ssr: false`
- `lib/curriculum/modules/` files must **never** use `"use client"`
- Workshop `validate(code)` functions must be **pure and synchronous**
- Lab `validate(code, stdout)` functions must be **pure and synchronous**
- localStorage key: `"python-course-progress"`
- Prefer stdout substring checks for lab tests over regex on source

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # production build
npm run lint         # ESLint
npx tsc --noEmit     # type-check (must pass before each new phase)
```
