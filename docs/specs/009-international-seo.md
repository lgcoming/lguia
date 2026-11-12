# SPEC-009 — Bilingual site, international SEO and GEO

- Status: Implemented
- Sprint: International (2026-11)
- Related: [003](./003-marketing-site.md), [004](./004-digital-diagnosis.md),
  [005](./005-leads.md), [006](./006-api.md), [007](./007-seo.md)

## Context

lguia sells to Spanish-speaking companies and, in English, to international ones. The site must
rank for buying-intent searches in both languages and be easy for AI assistants (ChatGPT,
Perplexity, Gemini) to understand and quote. Nothing here promises rankings or citations.

## Languages and URLs

| Page      | Spanish (`es`, default) | English (`en`)           |
| --------- | ----------------------- | ------------------------ |
| Home      | `/`                     | `/en`                    |
| Services  | `/servicios`            | `/en/services`           |
| Service   | `/servicios/<slug>`     | `/en/services/<slug>`    |
| Pricing   | `/planes`               | `/en/pricing`            |
| Diagnosis | `/diagnostico-digital`  | `/en/digital-assessment` |
| Contact   | `/contacto`             | `/en/contact`            |

Service slugs: `desarrollo-web-a-medida` / `custom-web-development`, `automatizacion-de-procesos` /
`ai-automation`, `agentes-ia-chatbots` / `ai-agents-chatbots`, `seo-geo` / `seo-geo`. Internal ids
(`desarrollo-web`, `automatizaciones`, `chatbots-ia`, `seo-geo`) never change.

`src/i18n/routes.ts` is the single source of every URL (links, canonical, hreflang, sitemap,
language switcher). `src/i18n/config.ts` defines the languages.

## Architecture

- **One root layout per language**: `src/app/(es)/layout.tsx` and `src/app/(en)/layout.tsx` render
  `RootDocument` (`src/app/_shared/`) with the right `<html lang>`. No proxy, no rewrites, no
  `[lang]` segment, no automatic language redirect: every page is static.
- **Thin route files** per language call shared views in `src/views/` with a `locale`.
- **Unmatched URLs**: `[...rest]/page.tsx` in each tree calls `notFound()`, so each language
  answers 404 with its own `not-found.tsx` (no experimental `globalNotFound`). Unknown `/api/*`
  paths answer with the JSON error shape.
- **Content per language**: catalog in `src/data/<locale>/`, site copy in
  `src/i18n/dictionaries/<locale>.ts`, diagnosis copy in `src/features/diagnosis/content/`, form
  copy in `src/features/leads/content/`. Server Components read them directly; Client Components
  receive only the strings they need as props, so no dictionary ships to the browser.
- **Business logic stays language-free**: rules refer to keys; scores, plans and services are
  identical in both languages (tested). `diagnose(answers, catalog, locale)` resolves wording and
  URLs.
- **API**: `?locale=es|en` on `/api/diagnosis`, `/api/leads`, `/api/plans`, `/api/services`
  (default `es`). Leads store the language of the form (`Lead.locale`).
- **Language switcher**: a plain `<a hreflang lang>` in the header, the mobile menu and the footer,
  linking the same page in the other language (`localizedPath`). Crossing root layouts is a full
  navigation by design.

## International SEO

- `hreflang`: `es`, `en` and `x-default` → English, on every page (Metadata API) and in the sitemap,
  each version listing the full set including itself. Language-only codes: `es` also serves Latin
  America.
- Self-referencing canonical per language; `og:locale` + `og:locale:alternate`; one social image per
  language (`/opengraph-image`, `/og-en.png`).
- Titles, meta descriptions, H1s and slugs open with the term buyers search for (see the keyword
  matrix in `MEMORY.md`). Search volumes were not measured: no keyword tool is connected.
- Sitemap `lastmod` is `siteConfig.contentUpdated`, bumped by hand on content releases.

## GEO (assistant readability)

- Every service has an `answer`: a self-contained definition with price and timeline, shown under
  the hero ("En pocas palabras" / "In short") with a facts strip, and used as the schema.org
  description.
- FAQs answer price, timeline, scope and risk questions in full sentences (home, services, pricing).
- JSON-LD: one organisation entity (`Organization` + `ProfessionalService`, country-level address,
  languages, services) shared by both languages; `WebPage` per page with `inLanguage`; `Service`
  with price range from the related plans; `OfferCatalog` on pricing; `BreadcrumbList`; `FAQPage`.
- `robots.txt` names AI search, user-fetch and training crawlers explicitly (all allowed).
- `/llms.txt` is generated from the catalog in both languages. Optional convention; no promise.
- The diagnosis page renders a static summary of what the assessment covers (the wizard is
  client-side).

## Acceptance criteria

- [x] AC1 — Every public page exists in both languages with translated URL segments and slugs.
- [x] AC2 — `<html lang>`, canonical, hreflang (es, en, x-default) and Open Graph locale are correct
      and reciprocal on every page; the sitemap lists every URL with its alternates.
- [x] AC3 — Catalog, dictionaries, diagnosis and form copy have the same structure in both languages;
      every price quoted in copy equals a plan price (unit tests).
- [x] AC4 — The diagnosis gives the same score, plan and services in both languages; wording, links
      and validation messages follow the language (unit, integration and E2E tests).
- [x] AC5 — Unknown URLs return 404 in the language of their section; unknown API paths return JSON.
- [x] AC6 — No dictionary or second-language content is imported by Client Components.
- [x] AC7 — The brand is written `lguia` in every string of both languages (unit test).

## Open points

- The 404 document is server-sent with status 404 and `noindex`, but its localized content is
  painted on the client (limitation of multiple root layouts without `globalNotFound`).
- A `.es` domain geo-targets Spain. For international English traffic a generic TLD is advisable;
  the domain is still a placeholder.
- English copy should be reviewed by a native speaker before launch.
