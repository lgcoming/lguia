# SPEC-001 — Foundation

- Status: Approved
- Sprint: 0
- Related: [002](./002-design-system.md), [008](./008-quality.md)

## Context

LGuIA needs a technical base that a small team (or AI agents) can extend for years: typed,
tested, documented, and free of dependencies that do not earn their place.

## Scope

In scope: project scaffold, tooling, folder architecture, environment variables, scripts, git
workflow and agent documentation. Out of scope: features (covered by later specs).

## Requirements

- R1. Next.js App Router project with TypeScript (`strict`), Tailwind CSS v4 and ESLint
  (`eslint-config-next` core-web-vitals + typescript presets).
- R2. Runtime dependencies are limited to: `next`, `react`, `react-dom`, `motion`, `lucide-react`,
  `zod`. Any addition must be justified in `MEMORY.md`.
- R3. Dev tooling: Vitest + React Testing Library (unit, integration, components), Playwright (one
  critical E2E flow), Prettier with the Tailwind class-sorting plugin.
- R4. Folder architecture:

  | Path             | Contents                                                                              |
  | ---------------- | ------------------------------------------------------------------------------------- |
  | `src/app`        | Routes only: pages, layouts, route handlers, metadata files.                          |
  | `src/components` | Reusable, feature-agnostic UI (`ui`, `layout`, `marketing`, `motion`, `seo`).         |
  | `src/features`   | Feature modules with business logic and feature UI (`catalog`, `diagnosis`, `leads`). |
  | `src/lib`        | Shared infrastructure: site config, API helpers, utilities.                           |
  | `src/data`       | Static/mock content: services, plans, process steps.                                  |
  | `src/types`      | Shared domain types used across features.                                             |
  | `tests`          | `unit`, `integration`, `components`, `e2e`.                                           |
  | `docs/specs`     | SDD specifications.                                                                   |

- R5. Route groups: `(marketing)` for the public site (shared header/footer) and `(admin)` for
  internal views (separate, minimal chrome, `noindex`).
- R6. Business logic never lives inside React components or route handlers. Components render;
  route handlers validate input, call a service, and map the result to HTTP.
- R7. Persistence goes through repository interfaces (`CatalogRepository`, `LeadRepository`). The
  first implementations are static/in-memory; swapping them for a database must not touch UI or
  business logic.
- R8. Environment variables are documented in `.env.example`:
  - `NEXT_PUBLIC_SITE_URL` — canonical origin (fallback: Vercel production URL, then localhost).
  - `ENABLE_DEMO_ADMIN` — exposes lead data in production for demo deployments only.
- R9. Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:watch`, `test:e2e`,
  `format`, `format:check`, `check` (lint + typecheck + tests).
- R10. Git workflow: `main` (released), `develop` (integration), `feature/*` branches merged into
  `develop` with `--no-ff`; conventional commits.
- R11. `AGENTS.md`, `MEMORY.md` and `README.md` exist and are kept current. `CLAUDE.md` imports
  `AGENTS.md`.

## Acceptance criteria

- [ ] AC1 — `npm run check` passes on a clean clone after `npm ci`.
- [ ] AC2 — `npm run build` produces a production build without warnings from our code.
- [ ] AC3 — Folder structure matches R4; no business logic in `src/app` or presentational components.
- [ ] AC4 — `.env.example` documents every environment variable read by the code.
- [ ] AC5 — Agent skills used by the project are installed at project level and listed in `AGENTS.md`.

## Decisions

- **npm** as package manager: default on Vercel and CI, no extra tooling.
- **No Cache Components** (`cacheComponents` off): almost every page is static content, and the
  only request-time page (`/admin/leads`) opts in explicitly with `connection()`. This keeps the
  rendering model simple; it can be revisited when real data sources exist.
- **No React Compiler**: client components are few and small; it would add a Babel dependency
  for no measurable gain today.
- **No `clsx`/`tailwind-merge`**: a 3-line `cn()` helper joins class names; variants are designed
  so classes never conflict.
- **`@types/node` 24** to match the Node 24 LTS runtime (and Vitest 5 peer requirements).
