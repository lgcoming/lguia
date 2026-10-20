# SPEC-002 — Design system (v2, Apple-inspired)

- Status: Implemented
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
3. **One chromatic action.** `iris-blue` is reserved for the filled primary button and for the
   selected state of option tiles (Apple's configurator pattern). Links and outlined buttons use
   `sapphire` (light) or `sky-signal` (dark). Everything else is monochrome;
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

| Token             | Hex       | Use                                                    | Contrast (AA)                      |
| ----------------- | --------- | ------------------------------------------------------ | ---------------------------------- |
| `fog-white`       | `#f5f5f7` | Canvas, alternate sections, footer                     |                                    |
| `pure-white`      | `#ffffff` | Tiles, nav (light), text on dark                       |                                    |
| `obsidian`        | `#1d1d1f` | Headlines and body text                                | 15.5:1 fog · 16.8:1 white          |
| `carbon`          | `#000000` | Dark bands                                             |                                    |
| `night` (added)   | `#161617` | Opaque fallback for dark glass                         | 18:1 with white                    |
| `pewter`          | `#707070` | Secondary text on light                                | 4.55:1 fog · 4.95:1 white          |
| `slate`           | `#505050` | Tertiary text where more contrast is needed            | 7.4:1 fog                          |
| `graphite`        | `#474747` | Nav text at rest (light)                               | ≥ 8:1                              |
| `silver`          | `#858585` | Form control borders; secondary text on dark           | 3.7:1 white (UI) · 5.6:1 black     |
| `pale-mist`       | `#d6d6d6` | Decorative hairlines only (never as the only boundary) | 1.45:1                             |
| `ash-veil`        | `#e2e2e5` | Secondary filled surfaces, pressed states              |                                    |
| `iris-blue`       | `#0071e3` | Filled primary button (white text), selected options   | 4.7:1 with white                   |
| `iris-blue-hover` | `#0077ed` | Primary button hover (Apple's value)                   | 4.5:1 with white                   |
| `sapphire`        | `#0066cc` | Links and outlined buttons on light                    | 5.1:1 fog · 5.6:1 white            |
| `sky-signal`      | `#2997ff` | Links and outlined buttons on dark                     | 7.0:1 black                        |
| `cornflower`      | `#509be7` | Link hover accent (decorative)                         |                                    |
| `ice-wash`        | `#aad0f6` | One soft blue band; text on it is `obsidian` only      | obsidian 10.5:1 · sapphire 3.5:1 ✗ |
| `danger` (added)  | `#e30000` | Form errors (Apple's error red)                        | 4.9:1 white                        |

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
  | `subheading` | 21 / 1.38          | 0.004em  | Subheads under headlines  |
  | `heading-sm` | 28 / 1.14          | 0.002em  | Tile titles               |
  | `heading-lg` | 40 / 1.1           | -0.012em | Section headlines         |
  | `display`    | 56 / 1.07          | -0.02em  | Page heroes               |
  | `display-xl` | 72 / 1.05          | -0.025em | Home hero (desktop only)  |

  Display tracking is tighter than Refero's SF Pro values because Inter sets wider at large sizes;
  the result matches the slightly negative tracking of Apple's headlines.

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

| Surface     | Recipe                                                                    |
| ----------- | ------------------------------------------------------------------------- |
| Canvas      | `fog-white`                                                               |
| Tile        | `pure-white`, radius 28px, no border, no shadow                           |
| Dark band   | `carbon` + photography/video + gradient overlay (`carbon` 60–80%)         |
| Glass panel | `rgb(255 255 255 / 8%)` + `border white/14` + `saturate(160%) blur(24px)` |
| Glass light | `rgb(255 255 255 / 72%)` + `saturate(180%) blur(20px)`                    |
| Glass dark  | `rgb(22 22 23 / 72%)` + `saturate(180%) blur(20px)` + `border white/10`   |

Fallbacks: without `backdrop-filter` support, and with `prefers-reduced-transparency: reduce`,
glass becomes the opaque surface (`pure-white` / `#161617`).

## Components

| Component                                                  | Location                                     | Notes                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `buttonStyles` / `Button` / `ButtonLink`                   | `components/ui/button.tsx`                   | Pills. `primary` (iris + 12% white top highlight), `secondary` (sapphire outline), `on-dark` (sky outline), `light`, `glass`, `plain`; `sm` 36px (header only), `md` 44px, `lg` 48px.                                                                                                                      |
| `TextLink`                                                 | `components/ui/text-link.tsx`                | Blue text + chevron icon (never a typed `→`); `tone` light/dark, `size` body/footnote; 44px target.                                                                                                                                                                                                        |
| `Section`, `SectionHeader`, `Container`                    | `components/ui/layout-primitives.tsx`        | `tone`: `canvas` / `white` / `ice` / `dark`; header centered; `width`: `text` (980px) / `grid` (1200px).                                                                                                                                                                                                   |
| Tiles                                                      | `rounded-tile` + surface utilities           | 28px radius, no border, no shadow; white on fog, fog on white. Plain classes, no wrapper component.                                                                                                                                                                                                        |
| `.glass-light` / `.glass-dark` / `.glass-panel`            | `app/globals.css` (components layer)         | Frosted surfaces (nav and menu sheet; panels over imagery) with opaque fallbacks.                                                                                                                                                                                                                          |
| `StepNumber`                                               | `components/ui/step-number.tsx`              | Numbered marker for real sequences (process, next steps). Replaces v1 `RouteStop`.                                                                                                                                                                                                                         |
| `Badge`                                                    | `components/ui/badge.tsx`                    | Pill tags: `neutral`, `info`, `strong`, `glass`, `inverse`.                                                                                                                                                                                                                                                |
| `BackgroundVideo`                                          | `components/media/background-video.tsx`      | Client. Poster first; video only ≥768px, without reduced motion or Save-Data; plays while visible; pause button (WCAG 2.2.2); optional parallax.                                                                                                                                                           |
| `ScrollVideoHero` / `useVideoScrub`                        | `components/media/`                          | Pinned, scroll-scrubbed home hero (see Motion); regular hero on small screens, reduced motion and without JavaScript.                                                                                                                                                                                      |
| `ParallaxLayer`                                            | `components/motion/parallax-layer.tsx`       | Background that drifts ±8% slower than the page; used by mid-page `MediaBand`s and the diagnosis tile.                                                                                                                                                                                                     |
| `RevealList` / `RevealItem` / `RevealGroup` / `RevealText` | `components/motion/reveal.tsx`               | Card cascade (blur to sharp) and text entrances; `SectionHeader` reveals headline then subhead.                                                                                                                                                                                                            |
| `MediaBand`                                                | `components/media/media-band.tsx`            | Full-bleed dark band with image or video + overlay (`hero`, `band`, `soft`); sets `data-nav-theme="dark"`.                                                                                                                                                                                                 |
| `BrandWatermark`                                           | `components/media/brand-watermark.tsx`       | Compass mark as a faint decorative watermark on dark tiles and the 404.                                                                                                                                                                                                                                    |
| `ServiceTile` / `ServicesBento`                            | `components/marketing/service-tile.tsx`      | Photographic tile + glass caption, one stretched link; bento of one wide, one tall and two regular tiles (`category-media.ts`).                                                                                                                                                                            |
| `DiagnosisPreview`                                         | `components/marketing/diagnosis-preview.tsx` | A real engine result on dark glass (the diagnosis "product shot").                                                                                                                                                                                                                                         |
| `SiteHeader` / `HeaderShell` / `MainNav`                   | `components/layout/`                         | Glass bar, `--header-height` 56px (64px from `lg`), 32px logo, 15px links, 44px CTA, hairline drawn with `::after`; dark glass while a `[data-nav-theme="dark"]` band is under it (IntersectionObserver, CSS `:has()` before hydration); below `lg` a full-screen glass sheet built on a modal `<dialog>`. |
| `Logo`                                                     | `components/layout/logo.tsx`                 | Transparent PNGs; `adaptive` renders both and lets the header theme pick (no JS wait).                                                                                                                                                                                                                     |
| Form controls                                              | `components/ui/form.tsx`                     | 12px radius, `silver` border, blue focus ring, `danger` errors; option tiles select with a 2px iris outline.                                                                                                                                                                                               |

## Brand assets (`/public`)

| Asset                                       | Source                           | Used in                                                                  |
| ------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| `brand/lguia-logo-{dark,light}.png`         | `lguia_logo.jfif`                | Header (adaptive), mobile menu, footer, admin header, OG image           |
| `brand/lguia-logo-tagline-{dark,light}.png` | `logo-tagline.jpg`               | Reserved for print/social; not used on the site yet                      |
| `brand/lguia-mark.png`                      | `lguia_icono.jfif`               | App icons, contact CTA emblem, watermark (diagnosis tile, benefits, 404) |
| `media/video/hero-connections.mp4` + poster | `assets/media-source/` (encoded) | Home hero, scroll-scrubbed                                               |
| `media/video/process-neural.mp4` + poster   | `assets/media-source/` (encoded) | Home "Cómo trabajamos" band (`overlay="soft"`, lazy, parallax)           |
| `media/images/web-development.jpg`          | `desarrollo_con_ia.jpg`          | Desarrollo web tile, overview block and category hero                    |
| `media/images/automation.avif`              | `desarrollo_automatizacion.avif` | Automatizaciones tile, overview block and category hero                  |
| `media/images/business-ai.jpg`              | `señor_traje_tablet_ia.jfif`     | IA para empresas tile, overview block and category hero                  |
| `media/images/connections.jpg`              | `fondo_conexiones.jpg`           | SEO + GEO tile, overview block and category hero                         |
| `media/images/circuit.jpg`                  | `fondo_chip.jpg`                 | Diagnosis CTA tile                                                       |
| `media/images/neural-circuit.jpg`           | `fondo_tecnologico.jpg`          | Contact CTA band, plans hero                                             |

Originals are kept in `assets/brand-source/` (not served); `scripts/prepare-brand-assets.mjs`
regenerates the derivatives.

## Motion

All motion uses **Motion** (`motion/react`, already a dependency): no GSAP, no Lenis, no
scroll hijacking. Native scrolling is kept; scroll-linked values come from `useScroll`, smoothed
with `useSpring` where inertia matters. Everything below is off with `prefers-reduced-motion` and
below 768px, except the hover/press feedback.

| Where                         | What                                                                                    | Timing                            |
| ----------------------------- | --------------------------------------------------------------------------------------- | --------------------------------- |
| Buttons, links, tiles         | colour/opacity; tile media `scale(1.03)` on hover; press `scale(0.98)`                  | 200–300ms ease-out                |
| Cards and bento tiles         | opacity + 24px rise + `blur(8px)` → sharp, once, staggered 90ms (`RevealList`/`Item`)   | 700ms                             |
| Headlines and subheads        | opacity + 18px rise, no blur (legible at every instant), headline then subhead          | 600ms                             |
| Home hero (`ScrollVideoHero`) | stage pinned with CSS `sticky` over a 300svh track; scroll scrubs the video (see below) | spring: stiffness 170, damping 30 |
| Mid-page media                | parallax: background travels ±8% of its height while the content scrolls normally       | linked to scroll                  |
| Nav theme change              | background/colour cross-fade                                                            | 250ms                             |
| Wizard / result               | unchanged from SPEC-004                                                                 |                                   |
| Looping videos                | muted loop, paused off-screen, pause control                                            |                                   |

### Scroll-scrubbed hero

- **Pinning is decided in CSS** (`md:motion-safe:h-[300svh]` on the track, `sticky top-0 h-svh`
  on the stage), so server and client markup agree and there is no layout shift. Without
  JavaScript a `<noscript>` style collapses the track.
- **Choreography** on the smoothed progress: the opening stack holds until 22%, lifts 56px and
  fades out by 38%; the overlay thins to 55% between 30% and 45% so the footage takes over, closes
  again by 74%; the closing line rises in between 72% and 86%. Overlay is never thinned while text
  is visible.
- **Scrubbing**: the whole file is fetched once into a blob after `load` (no range requests while
  seeking); `currentTime` follows the spring-smoothed progress, coalesced to one seek per frame and
  never queued while the decoder is busy (`useVideoScrub`). Save-Data keeps the poster.
- **Keyboard**: focusing a control in the faded opening stack restores it (`:focus-within`
  overrides the inline styles) and hides the closing line.

### Media pipeline

`node scripts/encode-videos.mjs` re-encodes `assets/media-source/*.mp4` in Chrome (WebCodecs via
Playwright, no ffmpeg needed) into `public/media/video/`:

| File                   | Codec                   | Keyframes       | Audio | Layout     | Size (from 5.3 / 5.1 MB) |
| ---------------------- | ----------------------- | --------------- | ----- | ---------- | ------------------------ |
| `hero-connections.mp4` | H.264 High, 720p, 24fps | every 4 frames  | none  | fast start | 2.7 MB                   |
| `process-neural.mp4`   | H.264 High, 720p, 24fps | every 48 frames | none  | fast start | 1.4 MB                   |

H.264 is the only format shipped: it is hardware-decoded everywhere, which matters most for
scrubbing (every seek is a decode). The short keyframe interval keeps a seek to ≤ 3 decoded frames
(measured: 6 ms average, 9 ms p95, versus 11 / 20 ms with the original 30-frame interval).
WebM (VP9) or AV1 sources would save ~30–50% on the looping band; see `MEMORY.md` for the ffmpeg
commands if a pipeline with ffmpeg is added. Posters are the first frame of each encoded file.

## Acceptance criteria

- [x] AC1 — Only the tokens above exist in `globals.css`; no hex values in components (the OG image
      reads `lib/brand.ts`).
- [x] AC2 — Every text/background pair meets WCAG AA, including text over video and photography.
      Measured on 8 frames of each video and on every photo hero (95th-percentile background
      luminance behind each text block): hero ≥ 5.7:1, process band ≥ 6.6:1, photo heroes ≥ 6.8:1,
      text on real glass ≥ 5.8:1.
- [x] AC3 — Visible `:focus-visible` on every surface (blue ring on light, sky ring on dark).
- [x] AC4 — `prefers-reduced-motion`: no transform animations, no video playback (poster only).
- [x] AC5 — `prefers-reduced-transparency` and browsers without `backdrop-filter` get opaque surfaces.
- [x] AC6 — Videos never download below 768px, with Save-Data, or with reduced motion; the hero LCP
      element is the `<h1>`, not the video.
- [x] AC7 — Content renders without JavaScript (videos degrade to posters; the header starts dark on
      pages that open with a dark band).
- [x] AC8 — Targets ≥ 24px (WCAG 2.2 AA 2.5.8) and 44px for primary controls; no horizontal scroll
      from 320px to 1440px.
- [x] AC9 — Lighthouse mobile: Accessibility, Best Practices and SEO 100 on every page; Performance
      92–96. Desktop home with the pinned scrub: 100 in all four (see `MEMORY.md`).
- [x] AC10 — The scrubbed hero stays pinned for the whole track, follows scroll in both
      directions with inertia, and degrades to a regular hero (no track) on small screens, with
      reduced motion and without JavaScript; the closing line keeps ≥ 6.7:1 over its frames.
- [x] AC11 — Entrance and parallax effects animate only `transform`, `opacity` and (once, on
      entrance) `filter`; no resting `filter` is left on cards.
