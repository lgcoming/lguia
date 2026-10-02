# Specifications

LGuIA is built with **Spec-Driven Development (SDD)**. Every substantial feature has a
specification here _before_ it is implemented, and the spec is updated whenever the
implementation changes its behaviour or contracts.

## Workflow

1. Understand the requirement (product brief, issue, conversation).
2. Create or update the spec in this folder.
3. Write acceptance criteria that can be verified (by a test or by a documented manual check).
4. Define data structures and API contracts when the feature needs them.
5. Write a short implementation plan.
6. Implement the smallest coherent increment.
7. Write or update tests.
8. Run validation (`npm run check`, plus `npm run test:e2e` for user-flow changes).
9. Review accessibility, performance and maintainability.
10. Mark the spec as **Implemented** only when every acceptance criterion is met.

## Index

| ID  | Spec                                              | Status   | Sprint |
| --- | ------------------------------------------------- | -------- | ------ |
| 001 | [Foundation](./001-foundation.md)                 | Approved | 0      |
| 002 | [Design system](./002-design-system.md)           | Approved | 0      |
| 003 | [Marketing site](./003-marketing-site.md)         | Approved | 1      |
| 004 | [Digital diagnosis](./004-digital-diagnosis.md)   | Approved | 2      |
| 005 | [Leads and admin view](./005-leads.md)            | Approved | 2–3    |
| 006 | [REST API](./006-api.md)                          | Approved | 2      |
| 007 | [SEO](./007-seo.md)                               | Approved | 3      |
| 008 | [Quality, testing and delivery](./008-quality.md) | Approved | 3      |

## Template

```md
# SPEC-0XX — Title

- Status: Draft | Approved | Implemented
- Sprint: N
- Related: links to other specs / issues

## Context

Why this exists and what problem it solves.

## Scope

In scope / out of scope.

## Requirements

Numbered functional requirements (R1, R2…).

## Data and contracts

Types, schemas and API shapes.

## Acceptance criteria

- [ ] AC1 — verifiable statement (and how it is verified)

## Implementation plan

Ordered, small steps.

## Test plan

Unit / integration / E2E / manual checks.

## Decisions and open questions
```
