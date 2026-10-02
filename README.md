# LGuIA

**LGuIA** is a digital agency for SMEs and local businesses in Spain. It helps traditional
businesses improve their digital presence, automate repetitive work and adopt AI only where it
provides practical value. This repository is the agency's website and lead platform.

> Technology should solve real business problems.

## Project objective

Build a polished, credible, production-ready agency platform — not a coding demo — that
demonstrates professional frontend development, business logic, accessibility, SEO, performance,
testing and a Spec-Driven Development workflow.

## Features

- **Marketing site** in Spanish: home (11 sections), services overview, four service category
  pages, plans, contact and a branded 404.
- **Digital diagnosis** (`/diagnostico-digital`): an 11-question, 5-step wizard that returns a
  digital-maturity score, per-area scores, a recommended plan with reasons, recommended services
  and next steps — computed by a deterministic, fully tested TypeScript engine (no AI API).
- **Lead capture** from the contact page and from the diagnosis result, validated on client and
  server with the same schema, with a honeypot instead of a CAPTCHA.
- **REST API** with Next.js Route Handlers: catalog, diagnosis and leads.
- **Admin view** (`/admin/leads`) for demo deployments, gated and `noindex`.
- **SEO**: per-page metadata and canonicals, generated Open Graph image, sitemap, robots and
  JSON-LD (Organization, WebSite, Service, BreadcrumbList, FAQPage).
- **Accessibility**: WCAG 2.2 AA target — semantic landmarks, skip link, focus management,
  keyboard-operable wizard and forms, linked error messages, reduced-motion support.

## Tech stack

| Area       | Choice                                                              |
| ---------- | ------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict) |
| Styling    | Tailwind CSS v4 with brand tokens (default palette disabled)        |
| Motion     | `motion` (LazyMotion, features loaded after hydration)              |
| Icons      | `lucide-react`                                                      |
| Validation | Zod 4 via `zod/mini` (shared client/server schemas)                 |
| Testing    | Vitest + React Testing Library · Playwright                         |
| Tooling    | ESLint · Prettier (+ Tailwind class sorting) · GitHub Actions       |
| Hosting    | Vercel                                                              |

No database, auth system, CMS, state library or external AI API: the brief excludes them for v1,
and the architecture keeps them pluggable.

## Architecture

```
Browser ──► Server Components (static pages)          ──► CatalogRepository ──► src/data
        └─► Client islands (menu, wizard, forms)
                 │ fetch
                 ▼
            Route Handlers (/api/*)  parse → validate (Zod) → service → HTTP
                 │
                 ├─► diagnosis-service ──► diagnosis model (pure TS engine)
                 └─► lead-service ──────► LeadRepository (in-memory today)
```

- **Business logic is framework-free.** The diagnosis engine
  (`validateDiagnosis → calculateDiagnosis → recommendPlan → getRecommendedServices → DiagnosisResult`)
  lives in `src/features/diagnosis/model` and is tested without React.
- **Repositories** are the only data access. Replacing the static catalog or the in-memory lead
  store with a database means writing a new implementation of the same interface.
- **Server Components by default.** Client Components are limited to the header menu, motion
  wrappers, the wizard and the two forms.
- **The server is the source of truth**: the wizard asks the API for its result, and lead
  submission recomputes the diagnosis from the answers instead of trusting the client.

Detailed requirements, contracts and acceptance criteria live in [`docs/specs`](./docs/specs/README.md).

## Folder structure

```
src/
  app/                    routes only
    (marketing)/          public pages + _components for page-specific sections
    (admin)/admin/leads/  internal view
    api/                  Route Handlers: services, plans, diagnosis, leads
    opengraph-image.tsx · sitemap.ts · robots.ts · icon.svg · not-found.tsx
  components/             reusable UI: ui/, layout/, marketing/, motion/, seo/
  features/
    catalog/              CatalogRepository, routes, price formatting
    diagnosis/            model/ (engine), diagnosis-service, components/ (wizard)
    leads/                schema, repository, service, client, components/ (forms, table)
  lib/                    site config, metadata, structured data, API helpers, validation
  data/                   services, plans, process steps (static content)
  types/                  shared catalog types
tests/                    unit/ · integration/ · components/ · e2e/
docs/                     specs/ (SDD) · backlog.md (sprints and issues)
```

## Development setup

Requirements: Node.js ≥ 22.12 (developed on Node 24 LTS) and npm.

```bash
npm install
cp .env.example .env.local   # optional: NEXT_PUBLIC_SITE_URL, ENABLE_DEMO_ADMIN
npm run dev                  # http://localhost:3000
```

In development the admin view is available at `/admin/leads` with three fictional demo leads.

### Environment variables

| Variable               | Purpose                                                                       | Default                                             |
| ---------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and JSON-LD                            | Vercel production URL, then `http://localhost:3000` |
| `ENABLE_DEMO_ADMIN`    | Expose `/admin/leads` and `GET /api/leads` in production (demo only, no auth) | `false`                                             |

## Available scripts

| Script                            | What it does                                             |
| --------------------------------- | -------------------------------------------------------- |
| `npm run dev`                     | Development server                                       |
| `npm run build` / `npm start`     | Production build / serve it                              |
| `npm run lint`                    | ESLint (Next.js core-web-vitals + TypeScript rules)      |
| `npm run typecheck`               | Generates route types (`next typegen`) and runs `tsc`    |
| `npm test`                        | Vitest: unit, integration and component tests            |
| `npm run test:watch`              | Vitest in watch mode                                     |
| `npm run test:e2e`                | Playwright against a production build (desktop + mobile) |
| `npm run format` / `format:check` | Prettier write / check                                   |
| `npm run check`                   | lint + typecheck + tests                                 |

## Testing

| Layer       | Where               | What                                                                                                                                                                     |
| ----------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit        | `tests/unit`        | Diagnosis validation, scoring, plan rules and tie-breaks, service recommendations, an invariant sweep over 262k answer combinations, lead/email validation, lead service |
| Integration | `tests/integration` | Route Handlers with real `Request` objects: success, invalid JSON, missing/invalid fields, tampering, honeypot, production gate                                          |
| Component   | `tests/components`  | Wizard navigation, validation, keyboard-only use, API success and error recovery; contact form                                                                           |
| E2E         | `tests/e2e`         | `/diagnostico-digital` → complete → recommendation → lead → success, desktop and mobile                                                                                  |

```bash
npm test
npx playwright install chromium   # first time only
npm run test:e2e
# or reuse an installed browser:
PLAYWRIGHT_CHANNEL=chrome npm run test:e2e
```

## API

All responses are JSON: `{ "data": … }` on success, `{ "error": { "code", "message", "issues?" } }`
on failure. Full contracts in [SPEC-006](./docs/specs/006-api.md).

| Method | Endpoint         | Description                                                               |
| ------ | ---------------- | ------------------------------------------------------------------------- |
| `GET`  | `/api/services`  | Service categories and services (prerendered)                             |
| `GET`  | `/api/plans`     | Plans with structured pricing (prerendered)                               |
| `POST` | `/api/diagnosis` | Answers → `DiagnosisResult` (stateless)                                   |
| `POST` | `/api/leads`     | Contact or diagnosis lead → `201 { id, receivedAt }`                      |
| `GET`  | `/api/leads`     | Leads, newest first — `404` in production unless `ENABLE_DEMO_ADMIN=true` |

```bash
curl -X POST http://localhost:3000/api/diagnosis -H "Content-Type: application/json" \
  -d '{"websiteStatus":"none","sellsOnline":"no","webLeads":"none","automationLevel":"none","repetitiveWorkload":"low","aiAdoption":"none","chatbotInterest":"no","seoStatus":"none","visibilityGoal":"interested","companySize":"solo","mainGoal":"presence"}'
```

## Technical decisions

The reasoning behind each decision is recorded in [`MEMORY.md`](./MEMORY.md). Highlights:

- **Deterministic diagnosis engine** with integer-weighted scoring and ordered, explainable rules.
- **`zod/mini`** instead of the classic Zod import: identical validation, ~90 KB less gzipped JS
  on the form pages.
- **Motion features loaded after hydration** and `m` from `motion/react-m`: ~30 KB less initial
  JS on every page.
- **No Cache Components**: the site is static-first; `/admin/leads` opts into request-time
  rendering with `connection()`.
- **Honeypot, not CAPTCHA**: no third-party script, no friction.
- **Design concept "la guía"** (wayfinding): one memorable device — the route line — used only
  for real sequences (hero preview, process, wizard progress).

### Quality snapshot (production build, Lighthouse mobile)

| Page                   | Performance | Accessibility | Best practices | SEO |
| ---------------------- | ----------- | ------------- | -------------- | --- |
| `/`                    | 97          | 100           | 100            | 100 |
| `/servicios`           | 98          | 100           | 100            | 100 |
| `/planes`              | 97          | 100           | 100            | 100 |
| `/contacto`            | 97          | 100           | 100            | 100 |
| `/diagnostico-digital` | 96          | 100           | 100            | 100 |

CLS 0 on every page; total blocking time ≤ 60 ms.

## Roadmap

- Persistent lead storage (database repository) and email notifications for new leads.
- Authentication for the admin area, then `PATCH /api/leads/:id` with a status workflow.
- Legal pages (aviso legal, privacidad, cookies) reviewed by a professional.
- Strict Content-Security-Policy with nonces.
- Real case studies and testimonials once they exist.
- Privacy-friendly analytics and field Core Web Vitals (RUM).
- Validate placeholder prices, contact email and response-time promise with the business.

## Deployment

Designed for **Vercel** (zero configuration for Next.js):

1. Push the repository to GitHub (`main` and `develop` branches).
2. Import it in Vercel. Production deploys from `main`; `develop` and pull requests get previews.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain. Leave `ENABLE_DEMO_ADMIN` unset unless the
   deployment is a demo that will never receive real leads (leads are kept in memory and the admin
   view has no authentication).

CI (`.github/workflows/ci.yml`) runs lint, type checks, formatting, tests, a production build and
the E2E flow on every push and pull request to `main` and `develop`.

## Working on this project

Read [`AGENTS.md`](./AGENTS.md) (rules for contributors and AI agents), [`MEMORY.md`](./MEMORY.md)
(decisions and constraints) and the relevant spec before changing code. The sprint backlog with
issue-ready descriptions is in [`docs/backlog.md`](./docs/backlog.md).
