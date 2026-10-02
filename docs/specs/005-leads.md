# SPEC-005 — Leads and admin view

- Status: Approved
- Sprint: 2 (capture) · 3 (admin view)
- Related: [004](./004-digital-diagnosis.md), [006](./006-api.md)

## Context

A lead is a business that asked LGuIA to get in touch, either from the contact page or at the end
of the diagnosis. Version 1 stores leads in memory behind a repository interface; a database
replaces it later without touching validation, business logic or UI.

## Lead sources

| Source      | Where                        | Extra data                                           |
| ----------- | ---------------------------- | ---------------------------------------------------- |
| `contact`   | `/contacto` → `ContactForm`  | `interest` (category or general), required `message` |
| `diagnosis` | Diagnosis result → lead form | Diagnosis `answers` (required), optional `message`   |

## Validation (`src/features/leads/schema.ts`, shared by client and server)

| Field      | Rule                                                                         | Message (es)                                               |
| ---------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `name`     | trimmed, 2–80 chars                                                          | Escribe tu nombre (mínimo 2 caracteres).                   |
| `email`    | trimmed, lowercased, valid email, ≤ 254 chars                                | Introduce un email válido, por ejemplo nombre@empresa.com. |
| `company`  | optional, trimmed, ≤ 120 chars; empty → undefined                            | El nombre de la empresa es demasiado largo.                |
| `phone`    | optional; `+`, digits, spaces, `-`, `(`, `)`; 9–15 digits; empty → undefined | Introduce un teléfono válido (mínimo 9 dígitos).           |
| `interest` | contact only: one of the 4 category ids or `general`                         | Selecciona en qué podemos ayudarte.                        |
| `message`  | contact: trimmed, 10–2000 chars · diagnosis: optional, ≤ 2000                | Cuéntanos un poco más (mínimo 10 caracteres).              |
| `consent`  | must be `true`                                                               | Necesitamos tu consentimiento para poder responderte.      |
| `answers`  | diagnosis only: valid `DiagnosisAnswers` (SPEC-004)                          | —                                                          |
| `website`  | honeypot, optional string, must be empty for a real submission               | —                                                          |

The payload is a discriminated union on `source`.

## Business logic (`src/features/leads/lead-service.ts`)

`submitLead(input, deps?)`:

1. If the honeypot `website` is filled, return a success-shaped result **without storing** (bots
   get no signal).
2. For `diagnosis` leads, recompute the diagnosis on the server from `answers` (client-provided
   scores are never trusted) and store `{ answers, score, level, recommendedPlanId,
recommendedServiceIds }`.
3. Create the `Lead` with `id` (UUID), `createdAt` (ISO), `status: "new"` and persist it.

Dependencies (`repository`, `now`, `createId`) are injectable for tests.

```ts
interface Lead {
  id: string;
  createdAt: string; // ISO 8601
  status: "new"; // "contacted" | "won" | "lost" arrive with PATCH /api/leads/:id
  source: "contact" | "diagnosis";
  name: string;
  email: string;
  company?: string;
  phone?: string;
  interest?: ServiceCategoryId | "general";
  message?: string;
  diagnosis?: {
    answers: DiagnosisAnswers;
    score: number;
    level: MaturityLevelId;
    recommendedPlanId: PlanId;
    recommendedServiceIds: string[];
  };
}

interface LeadRepository {
  create(lead: Lead): Promise<Lead>;
  list(): Promise<Lead[]>; // newest first
}
```

`InMemoryLeadRepository` keeps its `Map` on `globalThis` so the store survives dev hot reloads and
is shared between route handlers and Server Components in the same process. It is an intentional
process-wide mock database, not request state. Seed: three clearly fictional demo leads
(`@example.com`) in non-production environments so the admin view is demonstrable.

**Limitation**: on serverless platforms each instance has its own memory and it is reset on cold
start, so in-memory leads are not durable. Acceptable for the demo; a real repository is required
before collecting real leads.

## Forms

Both forms share `Field`, inputs and the client helper `postLead()`.

- Validate on submit with the shared schema; after the first submit, re-validate a field on change.
- Errors: message under the field (`aria-describedby`), `aria-invalid`, focus the first invalid
  field; a form-level error (`role="alert"`) for network/server failures with a retry.
- Submit button shows a loading state ("Enviando…") and is disabled while submitting.
- Server-side 400 issues are mapped back to the corresponding fields.
- Success: the form is replaced by a confirmation message that receives focus.
- `autocomplete` attributes: `name`, `email`, `organization`, `tel`.
- Inline data-protection notice: who is responsible (LGuIA), purpose (answering the request),
  no data sharing, rights (access, rectification, deletion) via the contact email.
- Honeypot: visually hidden, `tabIndex=-1`, `autoComplete="off"`, `aria-hidden`.

## Admin view — `/admin/leads`

- Route group `(admin)` with its own minimal layout and `robots: noindex, nofollow`.
- Access: `isAdminEnabled()` = `NODE_ENV !== "production"` **or** `ENABLE_DEMO_ADMIN === "true"`.
  Otherwise `notFound()`. Same gate for `GET /api/leads`.
- Server Component reading the repository directly (no HTTP round-trip to its own API); dynamic via
  `connection()`.
- `LeadTable`: date, name + company, contact (email/phone), source, interest or recommended plan,
  score. Semantic `<table>` with `<caption>`, horizontal scroll container on small screens,
  empty state when there are no leads.
- Banner: demo environment, in-memory data, no authentication.

## Acceptance criteria

- [ ] AC1 — Schema unit tests: valid contact/diagnosis payloads pass; invalid email, short name,
      missing consent, short contact message and missing diagnosis answers fail with field paths.
- [ ] AC2 — `POST /api/leads` stores a valid lead (201) and rejects invalid payloads (400 + issues).
- [ ] AC3 — Diagnosis leads are stored with the server-computed plan and score.
- [ ] AC4 — Honeypot submissions get a success response and are not stored.
- [ ] AC5 — `GET /api/leads` and `/admin/leads` return 404 in production unless
      `ENABLE_DEMO_ADMIN=true`.
- [ ] AC6 — Forms are operable by keyboard, errors are announced and associated with fields.
- [ ] AC7 — Admin table is readable at 375px and has an empty state.
