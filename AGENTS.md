<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# LGuIA — rules for contributors and AI agents

LGuIA is a digital agency for SMEs and local businesses (web, automation, practical AI). This
repository is its production website. It must look and behave like a real commercial product.

Read this file, then [`MEMORY.md`](./MEMORY.md) and the relevant spec in
[`docs/specs/`](./docs/specs/README.md) before changing anything.

## Working method: Spec-Driven Development

1. Inspect the existing code and docs. Reuse before creating.
2. Create or update the spec in `docs/specs/` (requirements, contracts, acceptance criteria).
3. Explain the approach briefly, then implement only the requested scope, in small increments.
4. Write or update tests; run `npm run check` (and `npm run test:e2e` for user-flow changes).
5. Review accessibility, performance and maintainability.
6. Update the spec status, `MEMORY.md` (decisions) and `README.md` when architecture changes.

Never invent requirements silently: if something is unclear, choose the simplest option consistent
with the existing architecture and record the decision in `MEMORY.md`. Never rewrite working code
without a reason.

## Stack and dependency policy

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Motion · Lucide React ·
Zod · Vitest + React Testing Library · Playwright · Vercel.

- Runtime dependencies are limited to `next`, `react`, `react-dom`, `motion`, `lucide-react`, `zod`.
- Do **not** add Redux, Zustand, Prisma, PostgreSQL, Redis, Supabase, Firebase, OpenAI/LangChain or
  any external AI API, authentication systems or a CMS unless a spec explicitly requires it.
- Every new dependency needs a written justification in `MEMORY.md`. Prefer platform features and
  small explicit TypeScript.

## Architecture

```
src/
  app/            routes only (pages, layouts, route handlers, metadata files)
    (marketing)/  public site with Header/Footer; _components/ for route-specific sections
    (admin)/      internal views, noindex, gated by isAdminEnabled()
    api/          Route Handlers (thin)
  components/     reusable UI: ui/, layout/, marketing/, motion/, seo/
  features/       feature modules: catalog/, diagnosis/, leads/ (model + services + feature UI)
  lib/            shared infrastructure (site config, api helpers, utils)
  data/           static/mock content (services, plans, process)
  types/          shared domain types
tests/            unit/, integration/, components/, e2e/
docs/specs/       SDD specifications
```

Rules:

- **Business logic is framework-free.** Scoring, recommendations, validation and lead building live
  in `src/features/*/model` or services as pure TypeScript. React components render; route handlers
  parse → validate → call a service → map to HTTP.
- **Repositories** (`CatalogRepository`, `LeadRepository`) are the only way to read/write data.
  Implementations are static/in-memory today; a database must be swappable without touching UI or
  business logic.
- **Server Components by default.** Add `"use client"` only for interactivity (header menu, motion
  wrappers, wizard, forms). Pass the minimum serializable props to Client Components.
- **Data, not hard-coded copy**, for plans and services: UI reads them from the catalog repository.
- Import directly from the module that defines something; no barrel files.
- No module-level mutable request state on the server. The in-memory lead store on `globalThis` is
  the single intentional exception (it is a mock database).

## Coding standards

- TypeScript strict; no `any`; prefer `type`/`interface` from `src/types` or the feature module.
- Names: components `PascalCase`, files `kebab-case.tsx`, functions `camelCase`, constants
  `SCREAMING_SNAKE_CASE` only for true constants.
- UI copy in Spanish (es-ES), sentence case, plain verbs, no hype; code and comments in English.
- Comments explain _why_, not _what_. Keep them rare.
- Tailwind utilities with design tokens from `globals.css`; never hard-code hex values in components.
  Use `cn()` from `src/lib/utils.ts` to compose classes.
- Formatting: Prettier (`npm run format`). Linting: ESLint (`npm run lint`).

## Design system (SPEC-002)

- Tokens in `src/app/globals.css` (`@theme`). Palette: ink, ink-soft, paper, mist, line, control,
  pine, signal, danger.
- One typeface (Schibsted Grotesk). Left-aligned layouts. Radius by hierarchy (pill buttons, 12px
  inputs, 20px cards).
- Signature device: the route line (`RouteLine`) — use it only for real sequences or position.
- Avoid: AI gradients/glow, glassmorphism, all-caps eyebrows, `→` in link text, `A · B · C` meta
  strings, highlighted single words in headlines, identical card grids everywhere, fake social proof.

## Accessibility (WCAG 2.2 AA)

Semantic HTML first; one `h1` per page; skip link; visible `:focus-visible` on every surface; labels
for every control; errors linked with `aria-describedby` and announced; focus management on step
changes; targets ≥ 44px; contrast per SPEC-002; respect `prefers-reduced-motion`. ARIA only where
HTML cannot express the state.

## Performance

Static rendering wherever possible; minimal client JS; `LazyMotion` + `m` components; animate only
`transform`/`opacity`; no scroll listeners; `next/font` self-hosting; no third-party scripts; no
images in the critical path unless optimized with `next/image`.

## SEO

Use `createPageMetadata()` for every public page (title, description, canonical, OG). Structured
data only for visible content (`JsonLd` component). Keep `sitemap.ts` in sync with public routes.

## Testing expectations

- Unit tests for every business rule (diagnosis, leads validation, services).
- Integration tests for every Route Handler (success + invalid input).
- Component tests only for meaningful interaction (wizard, forms).
- One E2E for the critical diagnosis → lead flow. Keep it green.
- Test behaviour through public APIs and accessible roles/labels, not implementation details.

## Git workflow

- `main` = released, `develop` = integration, `feature/<name>` from `develop`, merged back with
  `--no-ff`. Release = merge `develop` into `main` and tag.
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`, `style:`, `ci:`.
- No meaningless commits; each commit leaves the project building.

## Definition of Done

Requirements implemented · `npm run check` passes · responsive (320–1440px) · accessibility
reviewed · errors and loading states handled · consistent with the design system · no unnecessary
dependency · spec/docs updated · acceptance criteria satisfied.

## Agent skills

Installed at project level in `.claude/skills/` and `.agents/skills/` (lockfile: `skills-lock.json`,
restore with `npx skills experimental_install`):

| Skill | Use it when |
| ----- | ----------- |
| `web-quality-audit` | Auditing a page or the whole site before a release. |
| `performance`, `core-web-vitals` | Any change to rendering, assets, fonts, scripts or animation. |
| `accessibility` | Any UI change, especially forms and the wizard. |
| `seo` | Metadata, routes, structured data, sitemap/robots. |
| `best-practices` | Security headers, dependencies, console errors. |
| `frontend-design` | New sections or visual changes (respect SPEC-002 over generic taste). |
| `vercel-react-best-practices` | Writing or reviewing React/Next.js code. |

Next.js framework knowledge comes from the bundled docs in `node_modules/next/dist/docs/` (see the
managed block at the top), not from a skill. Verify UI changes in a real browser (built-in browser
or Playwright) before marking them done.
