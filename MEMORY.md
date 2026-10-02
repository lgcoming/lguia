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

- **`zod/mini` for all schemas** (2026-10-02): `import { z } from "zod"` bundled every locale and
  the JSON Schema converter into the client (~90 KB gzip on /contacto and /diagnostico-digital).
  `zod/mini` is the same engine with a tree-shakable functional API. `z.preprocess` becomes
  `z.pipe(z.transform(...), schema)` (see `optionalText()` in `features/leads/schema.ts`).
  Never import from `"zod"` in code that can reach the client.
- **Motion loading** (2026-10-02): `LazyMotion` loads `domAnimation` through a dynamic import
  (`components/motion/motion-features.ts`) and components use `import * as m from "motion/react-m"`.
  Importing `m` from the `motion/react` barrel kept ~30 KB more in the initial bundle.
- **Page metadata must list the OG image explicitly**: a page-level `openGraph` object replaces the
  parent one, including the file-based `opengraph-image`. `createPageMetadata()` adds it.
- **The OG image embeds static WOFF files** (`assets/fonts`, OFL) because Satori cannot read the
  WOFF2/variable files that `next/font` serves.
- **The hero preview is a real engine result** for an example business (`EXAMPLE_ANSWERS` in the
  home page), computed at build time, so the marketing visual never drifts from the product.
- **Calculating screen moves focus to its heading** instead of using a `role="status"` region: the
  submit button unmounts, so focus must land somewhere meaningful (SPEC-004 updated).
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

- **Desktop navigation starts at `lg` (1024px)**: logo + 4 links + CTA overflowed at 768px.
- **Headings scale down and hyphenate below 400px** (`max-[399px]:hyphens-auto`): long Spanish
  words such as "automatizaciones" otherwise force horizontal scroll at 320px. Hyphenation is
  scoped to narrow screens so desktop headings never break words.
- **Hero heading is 3rem on desktop** (not the 3.25rem display token) so "Webs, automatizaciones"
  stays on one line in the 1.3fr column.
- **`cn()` does not merge conflicting utilities**: never override a component's display, size or
  colour through `className` (this caused a header overflow and invisible route stops). Use props,
  variants or a wrapper.
- Concept "la guía" → wayfinding; signature **route line** used only for hero preview, process
  steps and wizard progress.
- Palette pine green + ink + mist + signal amber; contrast verified numerically (see spec table).
- Single typeface Schibsted Grotesk (variable) to keep fonts light and the voice consistent.
- Reveal animations hidden only when JS runs: `noscript` style override keeps content visible
  without JavaScript.

## Dependencies (justification)

| Package                                                         | Why                                                                                                              |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `motion`                                                        | Wizard/result/progress transitions and in-view reveals with reduced-motion support; `LazyMotion` keeps it small. |
| `lucide-react`                                                  | Consistent, tree-shakeable SVG icons.                                                                            |
| `zod` (used via `zod/mini`)                                     | One schema for client + server validation and inferred types; the mini entry keeps the client bundle small.      |
| `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/*` | Unit, integration and component tests.                                                                           |
| `@playwright/test`                                              | The single critical E2E flow.                                                                                    |
| `prettier`, `prettier-plugin-tailwindcss`                       | Consistent formatting and class order.                                                                           |
| `@types/node@24`                                                | Matches Node 24 LTS runtime; required by Vitest 5 peer range.                                                    |

## Tooling notes

- Windows dev environment: repo uses `core.autocrlf=false` + `.gitattributes` (`eol=lf`).
- `npm run typecheck` runs `next typegen` first so `PageProps`/`RouteContext` globals exist.
- Vitest projects: `node` (unit + integration) and `dom` (components, jsdom + jest-dom matchers).
- Vite 8 resolves the `@/*` alias natively via `resolve.tsconfigPaths` (no extra plugin).
- GitHub CLI (`gh`) is not installed locally: issues/project board are described in
  `docs/backlog.md` and can be created once the remote exists.
- Playwright's browser CDN was unreachable from the development machine; local E2E runs use the
  installed Chrome with `PLAYWRIGHT_CHANNEL=chrome`. CI installs the bundled Chromium.
- On Windows, stopping `npm run start` can leave the child `next start` process alive and holding
  the port: a later server fails to bind and checks silently hit the old build. Verify the port
  is free (`netstat -ano | findstr :3100`) before re-testing a production build.
- Scripted multi-line edits must assert that the target text exists: two silent no-op replacements
  (after Prettier reformatting) briefly left the OG image without its font.

## Verification log

### 2026-10-02 — Release candidate (production build, local)

- `npm run check`: lint clean, types clean, **97 tests** passing (11 files).
- `npm run test:e2e`: critical diagnosis → lead flow passing on desktop and mobile (Chrome).
- `npm run format:check`: clean.
- **Lighthouse 13 (mobile, simulated throttling)**:

  | Page                   | Perf | A11y | Best practices | SEO | Agentic browsing | LCP   | TBT   | CLS |
  | ---------------------- | ---- | ---- | -------------- | --- | ---------------- | ----- | ----- | --- |
  | `/`                    | 97   | 100  | 100            | 100 | 100              | 2.7 s | 30 ms | 0   |
  | `/servicios`           | 98   | 100  | 100            | 100 | 100              | 2.4 s | 60 ms | 0   |
  | `/planes`              | 97   | 100  | 100            | 100 | 100              | 2.7 s | 30 ms | 0   |
  | `/contacto`            | 97   | 100  | 100            | 100 | 100              | 2.5 s | 60 ms | 0   |
  | `/diagnostico-digital` | 96   | 100  | 100            | 100 | 100              | 2.8 s | 30 ms | 0   |

  LCP element is the page `<h1>` on every page. With DevTools throttling the home LCP is 2.0 s;
  the simulated estimate attributes early-started JS to the LCP path. Field data (CrUX/RUM) is
  pending until the site has real traffic.

- **Initial JS (gzip, modern browsers, excluding `noModule` polyfills)**: marketing pages 150–155 KB
  (≈117 KB is React + Next.js runtime), `/contacto` 172 KB, `/diagnostico-digital` 200 KB.
- **Structure**: every route has exactly one `h1`, header/nav/main/footer landmarks, no skipped
  heading levels, no duplicate ids, no images without `alt`.
- **Responsive**: no horizontal overflow at 320, 375, 768 and ~1400px on any route.
- **Keyboard**: mobile menu (Escape returns focus to the toggle), contact form (focus first error),
  wizard (Tab between groups, Space to select, Enter to continue; focus moves to each step heading
  and to the result) verified in the browser and covered by component tests.
- **SEO**: unique titles/descriptions, self-referencing canonicals, `og:image` on every page,
  valid sitemap and robots, JSON-LD types as specified. Rich Results Test pending deployment.
- **Pending manual checks**: screen-reader pass (NVDA/VoiceOver) of the wizard, 200% zoom pass,
  Rich Results Test on the deployed URL.
