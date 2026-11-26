# SPEC-013 — Keyword-led titles, headings and slugs

- Status: Implemented
- Sprint: Growth (2026-11)
- Related: [007](./007-seo.md), [009](./009-international-seo.md)

## Context

The first copy led with benefits ("Webs a medida que…"). Buyers search for the service by its
common name, so titles, H1s, H2s and slugs now open with the term people type. Search volumes were
not measured (no keyword tool connected): terms were chosen by buying intent in each market.

## Keyword map

| Page        | Spanish head term                             | English head term                    |
| ----------- | --------------------------------------------- | ------------------------------------ |
| Home        | diseño web, automatización e IA para empresas | web design, AI automation, AI agents |
| Web service | diseño web a medida (diseño de páginas web)   | custom web design and development    |
| Automation  | automatización de procesos con IA             | AI automation services               |
| AI service  | chatbots y agentes de IA para empresas        | AI chatbots and AI agents            |
| SEO service | posicionamiento web SEO y GEO                 | SEO and GEO services                 |
| Pricing     | cuánto cuesta una página web / precios        | how much does a website cost         |
| Contact     | pedir presupuesto de página web               | get a website quote                  |
| Prototype   | prototipo de página web gratis                | free website prototype               |

## Rules

- `<title>`: head term first, brand last, ≤ 60 characters with " | lguia"; unique per page.
- Meta description: 110–160 characters, head term in the first words, price or proof, unique.
- H1: the head term plus who it is for. Benefits move to the intro paragraph.
- Service H2s name the page's term through `ServiceCategory.topic` ("Precios de {topic}",
  "Preguntas frecuentes sobre {topic}") instead of repeating generic labels on every page.
- Spanish service slugs carry the head term: `diseno-web-a-medida`, `chatbots-agentes-ia`,
  `posicionamiento-seo-geo`. Old slugs answer with a permanent redirect (`next.config.ts`).
- Pricing answers "¿Cuánto cuesta una página web para una empresa?" as its first FAQ (FAQPage).
- Root metadata allows full snippets and large image previews (`max-image-preview: large`).
- The organisation schema lists the service names and their search terms (`knowsAbout`) and the
  visible price range (`priceRange`).
- HTTPS is enforced with `Strict-Transport-Security` (one year, no preload).

## Acceptance criteria

- [x] AC1 — Unit test: titles ≤ 60 characters and unique, descriptions 110–160 and unique, in both
      languages; every service H1 contains its topic.
- [x] AC2 — Old service URLs redirect with 308 to the new ones.
- [x] AC3 — One H1 per page; canonical, hreflang and sitemap use the new slugs.
