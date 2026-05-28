# CodeDiff Pro

A production-ready code and file difference checker built with Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-style UI primitives, Monaco Editor, Framer Motion, Lucide icons, and the `diff` package.

## Features

- Dual Monaco editors for original and modified code with syntax highlighting, line numbers, responsive sizing, word wrap, and optional minimap.
- Drag-and-drop file upload for common developer formats including TXT, JSON, JS, TS, PHP, Java, Python, SQL, HTML, CSS, XML, YAML, Markdown, Go, Rust, C++, and shell scripts.
- Monaco diff viewer with split and inline modes, sticky toolbar, line numbering, hidden unchanged regions, and dark/light theme support.
- Toolbar actions for compare, clear, swap, copy patch, download `.diff`, export HTML, focus mode, shareable URL, and theme toggle.
- Keyboard shortcuts: `Cmd/Ctrl + Enter` compares, `Cmd/Ctrl + Shift + C` copies the unified diff, and `Cmd/Ctrl + D` clears the workspace.
- Local autosave, recent comparison history, toast notifications, responsive SaaS-style UI, SEO metadata, favicon, and Vercel-ready configuration.
- API route at `/api/diff` for structured patch generation when server-side diffing is useful.

## Tech Stack

- Next.js App Router and React Server Components
- React 19 and TypeScript strict mode
- Tailwind CSS with shadcn-compatible design tokens
- Monaco Editor via `@monaco-editor/react`
- `diff` for unified and structured patch generation
- Zustand for persisted comparison history
- Framer Motion for restrained interface animation
- Radix UI primitives for accessible select, switch, and toast behavior

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev        # Start local development server
npm run build      # Create production build
npm run start      # Serve production build
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript without emitting
npm run format     # Format with Prettier and Tailwind class sorting
```

## Environment

Copy `.env.example` to `.env.local` and adjust values as needed.

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CodeDiff Pro
```

## Deployment

The app is ready for Vercel.

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add `NEXT_PUBLIC_APP_URL` with the deployed URL.
4. Deploy with the default Next.js build command: `npm run build`.

## Architecture

```text
src/
├── app/                 # App Router pages and API routes
├── components/
│   ├── diff/            # Diff workspace, toolbar, stats, history, viewer
│   ├── editor/          # Monaco editor panels and upload controls
│   ├── layout/          # Navbar, footer, theme provider
│   └── ui/              # shadcn-style reusable primitives
├── hooks/               # Debounce, local storage, keyboard shortcuts
├── lib/                 # Constants, env, class utilities
├── services/            # Diff and file reading services
├── store/               # Zustand persisted history store
├── styles/              # Tailwind globals and design tokens
├── types/               # Shared TypeScript contracts
└── utils/               # Language detection and export helpers
```

## Production Notes

- Monaco is dynamically imported on the client to keep server rendering stable.
- Diff stats are memoized and debounced for responsive typing performance.
- File reading is local-first in the browser and capped at 2 MB to protect UI performance.
- The app uses strict TypeScript, ESLint flat config, Prettier, and shadcn-compatible component aliases.
