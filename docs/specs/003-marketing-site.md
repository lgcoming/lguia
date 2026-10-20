# SPEC-003 — Marketing site

- Status: Implemented
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
- **Header** (sticky, 56px / 64px from `lg`, frosted glass with a hairline — SPEC-002 v2): brand logo (home link), primary nav
  (Servicios, Planes, Diagnóstico, Contacto) with `aria-current="page"`, CTA button "Diagnóstico
  gratuito". The bar switches to dark glass (light logo and text) while a dark band
  (`[data-nav-theme="dark"]`) is under it. Below `lg` (1024px), nav collapses into a full-screen
  glass sheet (a modal `<dialog>`): button with `aria-expanded`/`aria-controls`, closes on Escape,
  on link click and on route change, returns focus to the toggle, page scroll locked while open.
- **Footer** (`fog-white` with a hairline on top, Apple-style dense columns at 12–14px): brand logo and statement, service
  links (all 4 categories), company links, contact email, copyright with current year.

## Home — section order (brief §8)

1. **Hero** — full-viewport dark band with the "conexiones" video under a dark gradient overlay;
   it slides under the translucent header. From 768px with motion allowed it is a **pinned
   scroll-scrubbed showcase** (SPEC-002 Motion): the opening stack gives way to the footage, then
   the closing line "Tu web, tus procesos y la IA, por fin conectados." with the subhead "Diseñamos
   cada pieza para que trabaje con las demás, sin herramientas sueltas.". Elsewhere it is a static
   hero on the poster.
   Centered stack: eyebrow (who it is for), H1, subhead, button pair and three reassurances; primary CTA "Haz tu diagnóstico digital" → `/diagnostico-digital`; secondary
   CTA "Ver servicios" → `/servicios`. The H1 (or the optimized poster) is the LCP element.
2. **Qué es LGuIA** — centered editorial statement and three facts as fog tiles.
3. **Servicios** — bento grid of the four categories (one wide, one tall, two regular), each
   tile with its photograph and a glass caption.
4. **Problemas que resolvemos** — pain → solution pairs as fog tiles on white.
5. **Planes destacados** — plans with `featured: true` as white tiles + link to `/planes`.
6. **Para quién trabajamos** — target business types as fog tiles (one column on mobile).
7. **Cómo trabajamos** — dark band with the "neuronal" video (parallax); process steps as glass
   panels revealed in cascade.
8. **Por qué LGuIA** — benefits in a bento grid; the lead tile is dark with the compass watermark.
9. **Diagnóstico CTA** — dark photographic tile (circuit) inside a white section, with the live
   diagnosis preview (a real engine result for an example business) on glass as the "product"
   and the compass watermark. Other pages show the three outcomes instead of the preview.
10. **Contacto CTA** — dark image band (neural-circuit photograph) with the compass mark, centered
    text, "Escríbenos" and the email address as a glass button.
11. Footer (layout).

## Services

- `/servicios`: centered white hero; bento grid of categories; one block per category (photograph,
  name, description, link to detail; full list of services as tiles); diagnosis CTA; contact CTA.
- `/servicios/[slug]`: dark hero band with the category photograph, visible breadcrumbs, category
  headline and CTAs (diagnosis and "Pedir propuesta" → `/contacto`); "Qué incluye" (service items); "Qué consigues" (outcomes);
  process steps; related plans (PlanCard); FAQ (native `<details>`); links to the other
  categories; contact CTA.
- GEO content must not promise rankings or guaranteed appearances in AI answers.

## Plans

- `/planes`: dark photographic hero (neural-circuit); all six plans; pricing note (indicative prices, VAT excluded, closed quote
  after diagnosis); "¿Qué plan encaja contigo?" guide (situation → plan); plans FAQ; diagnosis CTA.
- Plans are **data** (`src/data/plans.ts`); UI never hard-codes plan names, prices or features.

## Contact

- `/contacto`: white hero; `ContactForm` (SPEC-005) in a white tile and an aside with "Qué pasa
  después" (3 steps), contact email and a link to the diagnosis.

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
  seoTitle: string; // page <title> without the brand suffix
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

- [x] AC1 — All routes in the table render with one `<h1>`, a logical heading hierarchy and
      landmarks (`header`, `nav`, `main`, `footer`).
- [x] AC2 — Home sections appear in the order above; hero shows both CTAs with the exact copy.
- [x] AC3 — `/servicios/[slug]` is statically generated for the 4 slugs; unknown slugs return 404.
- [x] AC4 — Plan and service content comes from `src/data` via the catalog repository only
      (site copy such as process steps and plan FAQs is imported from `src/data` directly).
- [x] AC5 — Mobile menu is fully keyboard operable and announces its state.
- [x] AC6 — No horizontal scroll from 320px to 1440px; verified at 320, 375, 768 and ~1400px.
- [x] AC7 — Only the header nav, contact form, wizard and motion wrappers are Client Components.

## Decisions

- Prices are **indicative placeholders** pending business validation (tracked in `MEMORY.md`).
- No testimonials, client logos or statistics: none exist yet, and fabricated social proof would
  contradict the brand's credibility goal.
- Legal pages (aviso legal, privacidad, cookies) are out of scope for this version; forms show the
  basic data-protection notice inline. Listed in the roadmap.
