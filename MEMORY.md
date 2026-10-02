# MEMORY — durable project knowledge

Decisions, conventions and constraints that are not obvious from the code. Newest entries at the
top of each section. Keep entries short; link to specs for detail.

## Product facts and placeholders

- Site language: Spanish (es-ES). Market: Spain. Code and docs: English.
- **Prices in `src/data/plans.ts` are indicative placeholders** (Starter Local 690 €, Web Pro
  1900 €, IA Starter 1200 €, Automation Pack 950 €, Growth Web + IA 3900 €, Custom Enterprise "a
  medida"; VAT excluded). Validate with the business before launch.
- **Contact email `hola@lguia.es` is a placeholder** in `src/lib/site.ts`. Confirm the real domain
  and mailbox before launch; also set `NEXT_PUBLIC_SITE_URL`.
- Response-time promise in forms ("2 días laborables") is a placeholder commitment to confirm.
- No testimonials, logos or stats until real ones exist (credibility over decoration).
- Legal pages (aviso legal, privacidad, cookies) are pending; forms carry an inline basic
  data-protection notice. No cookies or analytics are used yet, so no cookie banner is needed.

## Architecture decisions

- **Deterministic diagnosis engine** (SPEC-004): pure functions in `src/features/diagnosis/model`.
  The wizard calls `POST /api/diagnosis` (single source of truth on the server); lead submission
  recomputes the diagnosis server-side from the answers instead of trusting client results.
- **Repositories**: `CatalogRepository` (static data) and `LeadRepository` (in-memory on
  `globalThis`). Swapping to a DB = new implementation + change the `get*Repository()` factory.
- **In-memory leads are not durable on serverless** (per-instance memory, reset on cold start).
  Fine for the demo; a persistent repository is required before collecting real leads.
- **Admin gate**: `isAdminEnabled()` = not production, or `ENABLE_DEMO_ADMIN=true`. No auth yet,
  so never enable the flag on a deployment that receives real leads.
- **Cache Components disabled**: static-first site; the only dynamic page (`/admin/leads`) uses
  `connection()`.
- **Diagnosis questions merged**: "has website" + "is it updated" → one `websiteStatus` question to
  avoid conditional steps.
- **Question definitions live with the model** (`features/diagnosis/model/questions.ts`) because
  option values and scoring are coupled; labels are typed `Record<Value, string>` so every option
  must have a label.
- **Honeypot instead of CAPTCHA** for spam on lead forms: zero third-party JS, no user friction.

## Design decisions (SPEC-002)

- Concept "la guía" → wayfinding; signature **route line** used only for hero preview, process
  steps and wizard progress.
- Palette pine green + ink + mist + signal amber; contrast verified numerically (see spec table).
- Single typeface Schibsted Grotesk (variable) to keep fonts light and the voice consistent.
- Reveal animations hidden only when JS runs: `noscript` style override keeps content visible
  without JavaScript.

## Dependencies (justification)

| Package | Why |
| ------- | --- |
| `motion` | Wizard/result/progress transitions and in-view reveals with reduced-motion support; `LazyMotion` keeps it small. |
| `lucide-react` | Consistent, tree-shakeable SVG icons. |
| `zod` | One schema for client + server validation and inferred types. |
| `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/*` | Unit, integration and component tests. |
| `@playwright/test` | The single critical E2E flow. |
| `prettier`, `prettier-plugin-tailwindcss` | Consistent formatting and class order. |
| `@types/node@24` | Matches Node 24 LTS runtime; required by Vitest 5 peer range. |

## Tooling notes

- Windows dev environment: repo uses `core.autocrlf=false` + `.gitattributes` (`eol=lf`).
- `npm run typecheck` runs `next typegen` first so `PageProps`/`RouteContext` globals exist.
- Vitest projects: `node` (unit + integration) and `dom` (components, jsdom + jest-dom matchers).
- Vite 8 resolves the `@/*` alias natively via `resolve.tsconfigPaths` (no extra plugin).
- GitHub CLI (`gh`) is not installed locally: issues/project board are described in
  `docs/backlog.md` and can be created once the remote exists.

## Verification log

_(Filled in as features are verified: audits, manual keyboard passes, Lighthouse results.)_
