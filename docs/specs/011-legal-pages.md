# SPEC-011 — Legal notice, privacy and cookie policies

- Status: Implemented
- Sprint: Launch (2026-11)
- Related: [005](./005-leads.md), [009](./009-international-seo.md), [010](./010-cloudflare-workers.md)

## Context

The site collects personal data through its forms, so it needs a legal notice (LSSI-CE), a privacy
policy (GDPR, LOPDGDD) and a cookie policy, in both languages.

## Decisions

- Pages: `/aviso-legal`, `/privacidad`, `/cookies` and `/en/legal-notice`, `/en/privacy`,
  `/en/cookies`, rendered by `LegalView` from `legal.pages` in the dictionaries; linked from the
  footer and in the sitemap (priority 0.2).
- Owner: `siteConfig.owner` ("Luis Gómez"), trading as `lguia`; also `founder` in the organisation
  JSON-LD. The form notice names the owner and links to the privacy policy.
- **No tax id or postal address is published**, at the owner's request (2026-11-14): they are the
  owner's personal ID number and home. Article 10 LSSI-CE requires both from service providers;
  this stays an open compliance gap until the owner provides a business address and id (see
  Open points).
- No cookie banner: the site sets no analytics, advertising or tracking cookies and stores nothing
  in the browser. Adding analytics or embeds that set cookies requires a consent mechanism first.
- Text is a reasonable template, not legal advice; the owner should have it reviewed.

## Acceptance criteria

- [x] AC1 — The three pages exist in both languages with hreflang, canonical and footer links.
- [x] AC2 — Both forms name the data controller and link to the privacy policy.
- [x] AC3 — Copy has the same structure in both languages (parity tests).

## Open points

- Publish a tax id (NIF/CIF) and an address: a business address service (virtual office) avoids
  showing the home address; a company (S.L.) would have its own CIF and registered office.
