# SPEC-002 — Design system (v2, Apple-inspired)

- Status: Approved
- Sprint: Redesign (2026-10)
- Supersedes: v1 "la guía" (wayfinding, pine palette, Schibsted Grotesk) — see git history
- Related: [003](./003-marketing-site.md), [004](./004-digital-diagnosis.md)
- Reference: [`docs/design/refero-apple/`](../design/refero-apple/DESIGN.md) (Refero "Apple (España)"
  style: `DESIGN.md`, `theme.css`, `variables.css`, `tokens.json`)

## Context

The owner asked for an integral, premium redesign following Apple's visual system (Human Interface
Guidelines, as captured by the Refero reference) and using the brand assets added to `/public`:
logos, dark technology photography and two background videos. Content, routes, business logic and
accessibility requirements do not change.

## Principles

1. **Gallery in daylight, cinema in the dark.** Information lives on a near-white canvas
   (`fog-white`); atmosphere lives in full-bleed dark bands (hero video, process video, image CTAs).
   Sections are separated by a change of surface, never by rules or shadows.
2. **The product is the hero.** LGuIA's product is its advice: services, plans and the diagnosis
   result are presented like Apple presents a device — centered, generous, unframed.
3. **One chromatic action.** `iris-blue` is reserved for the filled primary button. Links and
   outlined buttons use `sapphire` (light) or `sky-signal` (dark). Everything else is monochrome;
   colour comes from the brand logo and the photography.
4. **Centered headline stacks.** Section headers and heroes are centered (headline → subhead →
   button pair). Text inside tiles, forms and lists stays left-aligned for readability.
5. **Glass is chrome, not decoration.** Frosted glass (`backdrop-filter`) is used for the navigation,
   the mobile menu sheet and content panels that sit on top of imagery or dark bands. Never on plain
   light canvas, never stacked.
6. **Quiet motion.** 200–300 ms `ease-out` for hover, press and selection; one entrance reveal per
   group; videos only where they add atmosphere, never at the cost of legibility or data.

## Tokens

Defined in `src/app/globals.css` (`@theme`) with the names of the Refero files. The Tailwind default
palette is disabled, so only these colours exist.

### Colour

| Token            | Hex       | Use                                                    | Contrast (AA)                      |
| ---------------- | --------- | ------------------------------------------------------ | ---------------------------------- |
| `fog-white`      | `#f5f5f7` | Canvas, alternate sections, footer                     |                                    |
| `pure-white`     | `#ffffff` | Tiles, nav (light), text on dark                       |                                    |
| `obsidian`       | `#1d1d1f` | Headlines and body text                                | 15.5:1 fog · 16.8:1 white          |
| `carbon`         | `#000000` | Dark bands                                             |                                    |
| `pewter`         | `#707070` | Secondary text on light                                | 4.55:1 fog · 4.95:1 white          |
| `slate`          | `#505050` | Tertiary text where more contrast is needed            | 7.4:1 fog                          |
| `graphite`       | `#474747` | Nav text at rest (light)                               | ≥ 8:1                              |
| `silver`         | `#858585` | Form control borders; secondary text on dark           | 3.7:1 white (UI) · 5.6:1 black     |
| `pale-mist`      | `#d6d6d6` | Decorative hairlines only (never as the only boundary) | 1.45:1                             |
| `ash-veil`       | `#e2e2e5` | Secondary filled surfaces, pressed states              |                                    |
| `iris-blue`      | `#0071e3` | Filled primary button (white text)                     | 4.7:1 with white                   |
| `sapphire`       | `#0066cc` | Links and outlined buttons on light                    | 5.1:1 fog · 5.6:1 white            |
| `sky-signal`     | `#2997ff` | Links and outlined buttons on dark                     | 7.0:1 black                        |
| `cornflower`     | `#509be7` | Link hover accent (decorative)                         |                                    |
| `ice-wash`       | `#aad0f6` | One soft blue band; text on it is `obsidian` only      | obsidian 10.5:1 · sapphire 3.5:1 ✗ |
| `danger` (added) | `#e30000` | Form errors (Apple's error red)                        | 4.9:1 white                        |

### Typography

- **Family:** SF Pro is not licensed for web embedding, so the stack is
  `-apple-system, BlinkMacSystemFont` (SF Pro on Apple devices) → **Inter** variable with optical
  size (`opsz`), self-hosted with `next/font`, as the substitute everywhere else.
- **Scale** (Refero tokens, display sizes extended for heroes):

  | Token        | Size / line height | Tracking | Use                       |
  | ------------ | ------------------ | -------- | ------------------------- |
  | `caption`    | 12 / 1.33          | -0.01em  | Footer, legal, micro-copy |
  | `footnote`   | 14 / 1.43          | -0.016em | Buttons, nav, helper text |
  | `body`       | 17 / 1.47          | -0.022em | Body copy (the workhorse) |
  | `subheading` | 21 / 1.19          | 0.011em  | Subheads under headlines  |
  | `heading-sm` | 28 / 1.14          | 0.007em  | Tile titles               |
  | `heading-lg` | 40 / 1.1           | 0        | Section headlines         |
  | `display`    | 56 / 1.07          | -0.005em | Page heroes               |
  | `display-xl` | 80 / 1.05          | -0.015em | Home hero (desktop only)  |

- Headlines weight 600; body 400; never display weights below 21px.

### Spacing, layout, radius

- **Spacing:** Refero's 4px base equals Tailwind's default scale (`1` = 4px … `15` = 60px). The
  `--spacing-N` variables from `theme.css` are **not** imported: in Tailwind v4 they would redefine
  the numeric scale (`p-4` would become 4px instead of 16px).
- **Widths:** text stacks max 980px; grids max 1200px; 16px gutters on mobile.
- **Section gap:** 80px mobile, 112–128px desktop.
- **Radius:** pills `980px` (`rounded-full`) for every button and tag · tiles 28px (`rounded-tile`) ·
  inputs and option tiles 12px · nav and sections 0.
- **Elevation:** no box shadows. Depth comes from surface contrast and glass.

### Surfaces and glass

| Surface     | Recipe                                                                  |
| ----------- | ----------------------------------------------------------------------- |
| Canvas      | `fog-white`                                                             |
| Tile        | `pure-white`, radius 28px, no border, no shadow                         |
| Dark band   | `carbon` + photography/video + gradient overlay (`carbon` 55–85%)       |
| Glass light | `rgb(255 255 255 / 72%)` + `saturate(180%) blur(20px)`                  |
| Glass dark  | `rgb(22 22 23 / 72%)` + `saturate(180%) blur(20px)` + `border white/10` |

Fallbacks: without `backdrop-filter` support, and with `prefers-reduced-transparency: reduce`,
glass becomes the opaque surface (`pure-white` / `#161617`).

## Components

| Component                                | Location                                | Notes                                                                                                                                                                                 |
| ---------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `buttonStyles` / `Button` / `ButtonLink` | `components/ui/button.tsx`              | `primary` (iris), `secondary` (sapphire outline), `on-dark` (sky outline), `glass` (white glass on media), `light` (white fill on dark); `md` 14px, `lg` 17px; pill; min target 44px. |
| `TextLink`                               | `components/ui/text-link.tsx`           | Apple-style link with chevron icon (not a `→` character); `tone` light/dark.                                                                                                          |
| `Section`, `SectionHeader`, `Container`  | `components/ui/layout-primitives.tsx`   | `tone`: `canvas` / `white` / `ice` / `dark`; header centered.                                                                                                                         |
| `Tile`                                   | `components/ui/tile.tsx`                | White tile (28px); `MediaTile` with `next/image` background + overlay + glass panel.                                                                                                  |
| `GlassPanel`                             | `components/ui/glass.tsx`               | Dark glass panel for content over imagery.                                                                                                                                            |
| `BackgroundVideo`                        | `components/media/background-video.tsx` | Client. Loads only ≥768px, without reduced motion or Save-Data; poster image always; plays only while visible.                                                                        |
| `MediaBand`                              | `components/media/media-band.tsx`       | Full-bleed dark band with image or video + overlay; sets `data-nav-theme="dark"`.                                                                                                     |
| `SiteHeader` / `MainNav`                 | `components/layout/`                    | 48px glass bar; switches to dark glass while a `[data-nav-theme="dark"]` band is under it (IntersectionObserver, no scroll listeners); full-screen glass sheet on mobile.             |
| `Logo`                                   | `components/layout/logo.tsx`            | Brand PNGs (transparent) with dark and light variants.                                                                                                                                |
| Form controls                            | `components/ui/form.tsx`                | 12px radius, `silver` border, blue focus ring, `danger` errors.                                                                                                                       |

## Brand assets (`/public`)

| Asset                                       | Source                                       | Used in                                                     |
| ------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| `brand/lguia-logo-{dark,light}.png`         | `lguia_logo.jfif` (white background removed) | Nav, footer, 404                                            |
| `brand/lguia-mark.png`                      | `lguia_icono.jfif`                           | Favicon/app icon, watermark in the diagnosis band, OG image |
| `brand/lguia-logo-stacked-{dark,light}.png` | `lguia_logo_apilado.jfif`                    | Footer (mobile), contact CTA                                |
| `media/video/hero-connections.mp4`          | `fondo conexiones.mp4`                       | Home hero                                                   |
| `media/video/process-neural.mp4`            | `fondo neuronal.mp4`                         | Home "Cómo trabajamos" band                                 |
| `media/images/web-development.jpg`          | `desarrollo_con_ia.jpg`                      | Desarrollo web tile and category hero                       |
| `media/images/automation.avif`              | `desarrollo_automatizacion.avif`             | Automatizaciones tile and category hero                     |
| `media/images/business-ai.jpg`              | `señor_traje_tablet_ia.jfif`                 | IA para empresas tile and category hero                     |
| `media/images/connections.jpg`              | `fondo_conexiones.jpg`                       | SEO + GEO tile and category hero                            |
| `media/images/circuit.jpg`                  | `fondo_chip.jpg`                             | Diagnosis CTA band                                          |
| `media/images/neural-circuit.jpg`           | `fondo_tecnologico.jpg`                      | Contact CTA band, plans hero                                |

Originals are kept in `assets/brand-source/` (not served); `scripts/prepare-brand-assets.mjs`
regenerates the derivatives.

## Motion

| Where                    | What                                                     | Duration           |
| ------------------------ | -------------------------------------------------------- | ------------------ |
| Buttons, links, tiles    | colour/opacity; tile media `scale(1.03)` on hover        | 200–300ms ease-out |
| Section entrance (grids) | opacity + 16px rise, once, staggered                     | 450ms              |
| Nav theme change         | background/colour cross-fade                             | 250ms              |
| Wizard / result          | unchanged from SPEC-004                                  |                    |
| Videos                   | muted loop, paused off-screen; never with reduced motion |                    |

## Acceptance criteria

- [ ] AC1 — Only the tokens above exist in `globals.css`; no hex values in components.
- [ ] AC2 — Every text/background pair used meets WCAG AA, including text over video and photography
      (overlay keeps ≥ 4.5:1 at the brightest frame region behind text).
- [ ] AC3 — Visible `:focus-visible` on every surface (blue ring on light, sky ring on dark).
- [ ] AC4 — `prefers-reduced-motion`: no transform animations, no video playback (poster only).
- [ ] AC5 — `prefers-reduced-transparency` and browsers without `backdrop-filter` get opaque surfaces.
- [ ] AC6 — Videos never download below 768px, with Save-Data, or with reduced motion; the hero LCP
      element is text or the optimized poster, not the video.
- [ ] AC7 — Content renders without JavaScript (videos degrade to posters).
- [ ] AC8 — Targets ≥ 44px; no horizontal scroll from 320px to 1440px.
- [ ] AC9 — Lighthouse mobile on `/`: Accessibility, Best Practices and SEO ≥ 95, Performance ≥ 90.
