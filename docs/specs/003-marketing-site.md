# SPEC-003 — Marketing site

- Status: Approved
- Sprint: 1
- Related: [002](./002-design-system.md), [004](./004-digital-diagnosis.md), [007](./007-seo.md)

## Context

The public site has one job: help a business owner understand what LGuIA does, trust it, and take
the next step — ideally the digital diagnosis, otherwise the contact form. Content is in Spanish
(es-ES); code identifiers are in English.

## Routes

| Route                  | Purpose                                            | Rendering                    |
| ---------------------- | -------------------------------------------------- | ---------------------------- |
| `/`                    | Home                                               | Static                       |
| `/servicios`           | Overview of the four service categories            | Static                       |
| `/servicios/[slug]`    | Category detail (4 slugs, `dynamicParams = false`) | Static (SSG)                 |
| `/planes`              | All plans + how to choose + FAQ                    | Static                       |
| `/diagnostico-digital` | Digital diagnosis wizard (SPEC-004)                | Static shell + client wizard |
| `/contacto`            | Contact form + what happens next                   | Static shell + client form   |
| `/admin/leads`         | Internal lead list (SPEC-005)                      | Dynamic, gated, `noindex`    |

Category slugs: `desarrollo-web`, `automatizaciones`, `chatbots-ia`, `seo-geo`.

## Shared layout — `(marketing)` route group

- Skip link "Saltar al contenido" as the first focusable element, targeting `<main id="contenido">`.
- **Header** (sticky, solid background): logo (home link), primary nav (Servicios, Planes,
  Diagnóstico, Contacto) with `aria-current="page"`, CTA button "Diagnóstico gratuito".
  Below `md`, nav collapses into a disclosure menu: button with `aria-expanded`/`aria-controls`,
  closes on Escape, on link click and on route change, returns focus to the toggle on Escape.
- **Footer**: brand statement, service links (all 4 categories), company links, contact email,
  copyright with current year.

## Home — section order (brief §8)

1. **Hero** — states what LGuIA does, for whom and the outcome; primary CTA "Haz tu diagnóstico
   digital" → `/diagnostico-digital`; secondary CTA "Ver servicios" → `/servicios`. Visual: a
   static-HTML preview of a diagnosis result (score, areas, recommended plan) drawn with the route
   line — no image request, the H1 is the LCP element.
2. **Qué es LGuIA** — short editorial explanation of the agency and its approach.
3. **Servicios** — the four categories (cards → detail pages).
4. **Problemas que resolvemos** — pain → solution rows.
5. **Planes destacados** — plans with `featured: true` + link to `/planes`.
6. **Para quién trabajamos** — target business types.
7. **Cómo trabajamos** — shared process steps on the route line.
8. **Por qué LGuIA** — benefits.
9. **Diagnóstico CTA** — dark band.
10. **Contacto CTA**.
11. Footer (layout).

## Services

- `/servicios`: page hero; one block per category (icon, name, description, full list of
  services, link to detail); diagnosis CTA; contact CTA.
- `/servicios/[slug]`: visible breadcrumbs; hero with category headline and CTAs (diagnosis and
  "Pedir propuesta" → `/contacto`); "Qué incluye" (service items); "Qué consigues" (outcomes);
  process steps; related plans (PlanCard); FAQ (native `<details>`); links to the other
  categories; contact CTA.
- GEO content must not promise rankings or guaranteed appearances in AI answers.

## Plans

- `/planes`: page hero; all six plans; pricing note (indicative prices, VAT excluded, closed quote
  after diagnosis); "¿Qué plan encaja contigo?" guide (situation → plan); plans FAQ; diagnosis CTA.
- Plans are **data** (`src/data/plans.ts`); UI never hard-codes plan names, prices or features.

## Contact

- `/contacto`: page hero; `ContactForm` (SPEC-005) and an aside with "Qué pasa después"
  (3 steps), contact email and a link to the diagnosis.

## Content model (`src/types/catalog.ts`)

```ts
type ServiceCategoryId = "desarrollo-web" | "automatizaciones" | "chatbots-ia" | "seo-geo";
type CategoryIconKey = "web" | "automation" | "ai" | "search";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
}
interface Faq {
  question: string;
  answer: string;
}

interface ServiceCategory {
  id: ServiceCategoryId; // also the URL slug
  name: string; // "Desarrollo web"
  icon: CategoryIconKey; // mapped to a Lucide icon in the UI
  headline: string; // H1 on the detail page
  summary: string; // card copy
  description: string; // detail intro
  outcomes: string[];
  services: ServiceItem[];
  faqs: Faq[];
  relatedPlanIds: PlanId[];
}

type PlanId =
  | "starter-local"
  | "web-pro"
  | "ia-starter"
  | "automation-pack"
  | "growth-web-ia"
  | "custom-enterprise";

type PlanPricing =
  { kind: "from"; amount: number; currency: "EUR" } | { kind: "custom"; label: string };

interface Plan {
  id: PlanId;
  name: string; // "Starter Local"
  tagline: string; // who it is for
  idealFor: string;
  pricing: PlanPricing;
  timeline: string; // "2–3 semanas"
  features: string[];
  categories: ServiceCategoryId[];
  featured: boolean;
  highlight?: string; // badge, e.g. "Más completo"
}
```

Icons are stored as keys (not components) so the same data can be served by the API as JSON.

## Acceptance criteria

- [ ] AC1 — All routes in the table render with one `<h1>`, a logical heading hierarchy and
      landmarks (`header`, `nav`, `main`, `footer`).
- [ ] AC2 — Home sections appear in the order above; hero shows both CTAs with the exact copy.
- [ ] AC3 — `/servicios/[slug]` is statically generated for the 4 slugs; unknown slugs return 404.
- [ ] AC4 — Plan and service content comes from `src/data` via the catalog repository only.
- [ ] AC5 — Mobile menu is fully keyboard operable and announces its state.
- [ ] AC6 — No horizontal scroll from 320px to 1440px; layouts verified at 375, 768 and 1280px.
- [ ] AC7 — Only the header nav, contact form, wizard and motion wrappers are Client Components.

## Decisions

- Prices are **indicative placeholders** pending business validation (tracked in `MEMORY.md`).
- No testimonials, client logos or statistics: none exist yet, and fabricated social proof would
  contradict the brand's credibility goal.
- Legal pages (aviso legal, privacidad, cookies) are out of scope for this version; forms show the
  basic data-protection notice inline. Listed in the roadmap.
