# learn-python

An interactive Python learning platform built with Next.js. Work through lessons, workshops, and labs — write real Python code in the browser and see it run instantly.

## Features

- Structured curriculum with lessons, workshops (guided exercises), and labs (open-ended challenges)
- In-browser Python execution via [Pyodide](https://pyodide.org) (runs in a Web Worker, no server needed)
- Progress tracked locally in `localStorage`
- Syntax highlighting with CodeMirror 6

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Or visit the live site at [learn-python.haihv.dev](https://learn-python.haihv.dev).

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- TypeScript + Tailwind CSS v4
- Zustand v5 for state management
- CodeMirror 6 for the code editor

## Scripts

```bash
pnpm dev      # development server
pnpm build    # production build
pnpm lint     # ESLint
```

## Built with

This project was built with [Claude](https://claude.ai) (Anthropic's AI assistant) using [Claude Code](https://claude.ai/code).

## License

MIT © haihv
