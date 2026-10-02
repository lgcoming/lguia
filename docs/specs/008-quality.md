# SPEC-008 — Quality, testing and delivery

- Status: Approved
- Sprint: 3
- Related: all specs

## Testing strategy

Meaningful tests over many tests. Test behaviour, not implementation details.

| Layer       | Tool                 | Location            | Scope                                                                                                      |
| ----------- | -------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Unit        | Vitest (node)        | `tests/unit`        | Diagnosis validation, scoring, plan rules, service recommendation; lead/email validation; lead service.    |
| Integration | Vitest (node)        | `tests/integration` | Route handlers called with real `Request` objects: diagnosis, leads (incl. production gate), catalog.      |
| Component   | Vitest + RTL (jsdom) | `tests/components`  | Wizard navigation/validation/keyboard; contact form errors and success.                                    |
| E2E         | Playwright           | `tests/e2e`         | One critical flow: `/diagnostico-digital` → complete → recommendation → lead → success (desktop + mobile). |

E2E runs against a production build (`next build && next start`).

## Accessibility (WCAG 2.2 AA target)

- Semantic landmarks, skip link, one `h1`, logical headings, `lang="es"`.
- Native controls first; ARIA only for disclosure state, live regions and error wiring.
- Visible focus on every surface; focus management in the wizard and forms.
- Contrast verified for every token pair (SPEC-002).
- Reduced motion respected (CSS + `MotionConfig`).
- Manual checks: keyboard-only pass of every page and both forms; 200% zoom; screen reader smoke test
  of the wizard.

## Performance

Budgets (initial guardrails, per page, compressed): JS < 300 KB (target well below), CSS < 100 KB,
fonts < 100 KB, no third-party scripts.

- Server Components by default; Client Components only for header nav, motion wrappers, wizard and
  forms.
- No images in the critical path; hero visual is HTML/CSS; icons are inline SVG (tree-shaken).
- Fonts self-hosted with `next/font` (`display: swap`, latin subsets).
- Motion via `LazyMotion` + `domAnimation`; animations limited to transform/opacity.
- Static generation for every public page; static API responses for catalog endpoints.
- Verification: Lighthouse/trace on the production build for `/` and `/diagnostico-digital`
  (mobile), recorded in `MEMORY.md`.

## CI (GitHub Actions — `.github/workflows/ci.yml`)

On push and pull request to `main` and `develop`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run build`
6. `npx playwright install --with-deps chromium` + `npm run test:e2e`

## Delivery

- Vercel project connected to GitHub: `main` → production, `develop` and PRs → preview.
- Environment variables: `NEXT_PUBLIC_SITE_URL` (production domain); `ENABLE_DEMO_ADMIN` only on a
  demo deployment.

## Definition of Done (brief §26)

A feature is done when: requirements implemented · TypeScript passes · lint passes · tests pass ·
responsive behaviour works · accessibility considered · errors handled · loading states exist where
needed · UI consistent with the design system · no unnecessary dependency · docs/spec updated ·
acceptance criteria satisfied.

## Acceptance criteria

- [ ] AC1 — `npm run check` and `npm run test:e2e` pass locally.
- [ ] AC2 — CI workflow runs the steps above.
- [ ] AC3 — Lighthouse (mobile, production build): Accessibility, Best Practices and SEO ≥ 95;
      Performance ≥ 90 on `/`.
- [ ] AC4 — Keyboard-only pass of all pages and the diagnosis flow completed (manual, recorded in
      `MEMORY.md`).
