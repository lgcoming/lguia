# Backlog — sprints and issues

Source of truth for the GitHub Project board until the repository is published. Each issue below
is written to be pasted into GitHub Issues as-is (template: `.github/ISSUE_TEMPLATE/feature.md`).

**Board columns:** Backlog → Ready → In Progress → Review → Done.
**Definition of Done (all issues):** see [SPEC-008](./specs/008-quality.md#definition-of-done-brief-26).

| Sprint | Goal | Issues |
| ------ | ---- | ------ |
| 0 — Foundation | Tooling, docs, design system, layout | #1 #2 #3 #4 |
| 1 — Marketing website | Home, services, plans, contact | #5 #6 #7 #8 |
| 2 — Diagnosis + API | Engine, wizard, API, lead flow | #9 #10 #11 #12 |
| 3 — Admin + testing + deployment | Admin view, tests, SEO, a11y, perf, CI, deploy | #13 #14 #15 #16 #17 |

---

### #1 Project foundation — Sprint 0

- **Objective:** a typed, linted, testable Next.js base.
- **Requirements:** SPEC-001 R1–R9; scripts; Vitest + Playwright config; `.env.example`.
- **Acceptance criteria:** `npm run check` passes; folder structure per SPEC-001; skills installed.
- **Dependencies:** none.
- **Branch:** `feature/project-setup`.

### #2 SDD documentation — Sprint 0

- **Objective:** specs, `AGENTS.md`, `MEMORY.md`, `README.md` skeleton, backlog.
- **Requirements:** specs 001–008 with acceptance criteria; agent rules.
- **Acceptance criteria:** every later issue links to a spec section.
- **Dependencies:** #1.

### #3 Design system — Sprint 0

- **Objective:** tokens and primitives used by every page.
- **Requirements:** SPEC-002 tokens, typography, Button, Badge, Section, form controls, RouteLine,
  motion provider + Reveal.
- **Acceptance criteria:** SPEC-002 AC1–AC6.
- **Dependencies:** #1.

### #4 Shared layout — Sprint 0

- **Objective:** header, mobile menu, footer, skip link.
- **Requirements:** SPEC-003 "Shared layout".
- **Acceptance criteria:** keyboard-operable menu; landmarks; `aria-current`.
- **Dependencies:** #3.

### #5 Homepage — Sprint 1

- **Objective:** the 11 home sections in order, with real copy.
- **Requirements:** SPEC-003 "Home"; catalog data for services/plans.
- **Acceptance criteria:** SPEC-003 AC1, AC2, AC6.
- **Dependencies:** #4.
- **Branch:** `feature/landing`.

### #6 Services pages — Sprint 1

- **Objective:** `/servicios` and four statically generated category pages.
- **Requirements:** SPEC-003 "Services"; content model.
- **Acceptance criteria:** SPEC-003 AC3, AC4.
- **Dependencies:** #5.
- **Branch:** `feature/services`.

### #7 Plans page — Sprint 1

- **Objective:** `/planes` driven by plan data.
- **Requirements:** SPEC-003 "Plans".
- **Acceptance criteria:** no hard-coded plan data in UI; FAQ; diagnosis CTA.
- **Dependencies:** #5.

### #8 Contact page — Sprint 1

- **Objective:** `/contacto` with validated form UI.
- **Requirements:** SPEC-003 "Contact", SPEC-005 "Forms".
- **Acceptance criteria:** SPEC-005 AC6.
- **Dependencies:** #4.

### #9 Diagnosis engine — Sprint 2

- **Objective:** deterministic scoring and recommendations.
- **Requirements:** SPEC-004 "Scoring", "Plan recommendation", "Recommended services".
- **Acceptance criteria:** SPEC-004 AC1–AC4 (unit tests).
- **Dependencies:** #6, #7 (catalog ids).
- **Branch:** `feature/diagnosis-wizard`.

### #10 DiagnosisWizard — Sprint 2

- **Objective:** accessible multi-step wizard with result view.
- **Requirements:** SPEC-004 "Wizard UX".
- **Acceptance criteria:** SPEC-004 AC6, AC8.
- **Dependencies:** #9, #11 (`POST /api/diagnosis`).

### #11 REST API — Sprint 2

- **Objective:** catalog, diagnosis and leads endpoints.
- **Requirements:** SPEC-006.
- **Acceptance criteria:** SPEC-006 AC1–AC4.
- **Dependencies:** #9.
- **Branch:** `feature/api`.

### #12 Lead flow — Sprint 2

- **Objective:** contact form + diagnosis lead form → `POST /api/leads` → success.
- **Requirements:** SPEC-005 "Business logic", "Forms".
- **Acceptance criteria:** SPEC-005 AC1–AC4.
- **Dependencies:** #8, #10, #11.

### #13 Admin leads view — Sprint 3

- **Objective:** `/admin/leads` gated demo view.
- **Requirements:** SPEC-005 "Admin view".
- **Acceptance criteria:** SPEC-005 AC5, AC7.
- **Dependencies:** #12.

### #14 Integration and E2E tests — Sprint 3

- **Objective:** route-handler integration tests and the critical E2E flow.
- **Requirements:** SPEC-008 "Testing strategy".
- **Acceptance criteria:** SPEC-004 AC5, AC7; SPEC-006 AC1.
- **Dependencies:** #11, #12.
- **Branch:** `feature/tests`.

### #15 SEO — Sprint 3

- **Objective:** metadata, sitemap, robots, structured data, OG image.
- **Requirements:** SPEC-007.
- **Acceptance criteria:** SPEC-007 AC1–AC4.
- **Dependencies:** #5–#8.

### #16 Accessibility, performance and visual polish — Sprint 3

- **Objective:** audit with the web-quality skills and fix findings.
- **Requirements:** SPEC-008 "Accessibility", "Performance".
- **Acceptance criteria:** SPEC-008 AC3, AC4.
- **Dependencies:** #5–#13.

### #17 CI and deployment — Sprint 3

- **Objective:** GitHub Actions pipeline and Vercel deployment.
- **Requirements:** SPEC-008 "CI", "Delivery".
- **Acceptance criteria:** SPEC-008 AC2; production URL serves the site.
- **Dependencies:** #14.
