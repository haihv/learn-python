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

### T-shaped / Bloom deep-stems (additive track)

```
lib/stems/types.ts        ← Stem + Atlas types; 6 Bloom levels as a union
lib/stems/atlas.ts        ← the "one idea" + Python carved into 6–9 domains
lib/stems/<domain>.ts     ← one Stem per file (pure data, no React)
lib/stems/index.ts        ← stems[] registry + atlas, getStemBySlug
                                     ↓
app/atlas/page.tsx         ← Tier 0 map: one idea, ladder, domain cards
app/stem/[slug]/page.tsx   ← resolves slug → Stem (SSG via generateStaticParams)
                                     ↓
components/stem/StemShell.tsx       ← header + Bloom progress + prev/next rails
components/stem/levels/*.tsx        ← one component per Bloom level (L1–L6)
```

A deep stem climbs Remember→Understand→Apply→Analyze→Evaluate→Create, one
interaction shape per level. Authoring a new stem = write one data file in
`lib/stems/`, register it in `index.ts`, and set the matching Atlas domain's
`stemSlug`. No new React. `BLOOM_META` in `types.ts` holds **literal** Tailwind
class names (e.g. `bg-python-cyan`) — never build color classes by string
interpolation, the v4 scanner won't see them.

## Theme & Color Tokens

Light/dark theming lives entirely in `app/globals.css`: two palettes of
runtime `--th-*` CSS variables (`:root` = paper-and-ink light, `.dark` =
candlelit charcoal) mapped to Tailwind tokens via `@theme inline`. The
`.dark` class on `<html>` is applied pre-hydration by a bootstrap script in
`app/layout.tsx` (localStorage `"theme"`, falling back to
`prefers-color-scheme`) and toggled by `components/ui/ThemeToggle.tsx`
(useSyncExternalStore + MutationObserver — no setState-in-effect).

Token roles (never hardcode hex in JSX):
- `navy-{950..500}` — surfaces: 950 page, 900 panels, 800 cards, 700 hover,
  600 borders, 500 muted text
- `python-{blue,yellow,green,red,purple,cyan}` — accents; ink-strength in
  light, candlelit in dark. Blue/yellow lean toward Python brand hues.
  Translucent usages (`bg-python-cyan/15`) become pastel chips
- `stone-{900..400}` — ink text scale, strongest (900) to faintest (400),
  remapped so it flips with the theme; `stone-50` is the inverse ink for
  text on solid accent/ink buttons — use it instead of `text-white`
- Headings use `font-serif` (Source Serif 4); body/UI stays `font-mono`
- Custom CSS must use `--th-*` variables directly; `@theme inline` tokens
  are inlined into utilities and don't exist at runtime

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
pnpm dev          # start dev server (localhost:3000)
pnpm build        # production build
pnpm lint         # ESLint
npx tsc --noEmit     # type-check (must pass before each new phase)
```
