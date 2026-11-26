# SPEC-012 — Free website prototype request

- Status: Implemented
- Sprint: Growth (2026-11)
- Related: [005](./005-leads.md), [006](./006-api.md), [009](./009-international-seo.md),
  [010](./010-cloudflare-workers.md)

## Context

To win web development clients, lguia offers a free, no-obligation prototype: a design of the home
page (desktop and mobile) based on the client's brand and taste. The request form collects enough
about style, colours, logo and current website to make the prototype close to what they want.

## Offer (copy in both languages)

- What they get: a home page design for desktop and mobile, made for their business.
- When: in about 4 business days after the request (confirmed by the owner, 2026-11-26).
- Free and without obligation; the request is answered within 2 business days like any lead.

## Pages and entry points

- `/prototipo-web-gratis` and `/en/free-website-prototype` (`PAGE_IDS` entry `prototype`), in the
  sitemap with hreflang.
- A dark band on the custom web development service page introduces the offer and links to it;
  the footer lists it under the company links.

## Form (`source: "prototype"` on `POST /api/leads`)

Contact fields as in SPEC-005 (name, email, company, phone, consent, honeypot) plus:

| Field         | Type                                                                                   | Rule                                |
| ------------- | -------------------------------------------------------------------------------------- | ----------------------------------- |
| `projectType` | `new` \| `redesign`                                                                    | required                            |
| `currentSite` | URL (protocol optional, normalised to https)                                           | required when `redesign`            |
| `business`    | text: what the business does and for whom                                              | 10–600 chars                        |
| `goal`        | `leads` \| `sales` \| `bookings` \| `brand` \| `portfolio`                             | required                            |
| `styles`      | 1–3 of `minimal`, `corporate`, `modern`, `warm`, `bold`, `premium`                     | required                            |
| `palette`     | `brand` \| `custom` \| `suggest`                                                       | required                            |
| `colors`      | up to 3 `#rrggbb`                                                                      | at least 1 when `custom`            |
| `tone`        | `light` \| `dark` \| `any`                                                             | required                            |
| `sections`    | 0–8 of `home`, `services`, `about`, `portfolio`, `blog`, `shop`, `bookings`, `contact` | optional                            |
| `references`  | websites they like                                                                     | ≤ 1000 chars, optional              |
| `message`     | anything else                                                                          | ≤ 2000 chars, optional              |
| `logo`        | `{ name, type, data }`, base64                                                         | PNG, JPEG, WebP, SVG or PDF, ≤ 3 MB |

- The logo travels as base64 inside the JSON body, so the endpoint, validation and error shape stay
  the ones of every other lead. It is attached to the notification email and never stored.
- The stored lead keeps the brief (`lead.prototype`) and only the logo file name.
- The notification email lists the brief and attaches the logo.

## Acceptance criteria

- [x] AC1 — Valid requests return 201 and produce one email with the brief and the logo attached.
- [x] AC2 — Redesign without a website, custom palette without colours, more than 3 styles, a
      wrong file type or a file over 3 MB are rejected with field errors (unit + integration).
- [x] AC3 — The form works with keyboard and screen readers: grouped options use fieldsets and
      legends, errors are announced and focus moves to the first invalid field.
- [x] AC4 — Both languages have the same structure (parity tests); pages have canonical and hreflang.
