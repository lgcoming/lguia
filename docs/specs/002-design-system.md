# SPEC-002 — Design system

- Status: Approved
- Sprint: 0
- Related: [003](./003-marketing-site.md)

## Context

LGuIA sells practical technology to owners and managers of small and medium businesses — a
bakery chain, a dental clinic, a law firm, an industrial supplier. They are not technical buyers.
The site must feel like a serious, calm, competent agency: premium but restrained, never
"futuristic AI".

## Design concept: _la guía_

The brand name contains _guía_ (guide). The visual language borrows from **wayfinding**: clear
signage, a route with stops, a marker that tells you where you are. That concept gives the site
one memorable device — the **route line** (a thin line with stops and an amber marker) — used
only where it carries meaning:

- the hero preview of a diagnosis (your route from "today" to "recommended plan"),
- the work process (a real sequence of steps),
- the diagnosis wizard progress (where you are in the questionnaire).

Everything else stays quiet: white and mist surfaces, hairline borders, generous whitespace.

### Avoided defaults (and why)

- No purple/blue "AI" gradients, glow effects or glassmorphism — they signal hype, not trust.
- No all-caps eyebrow labels above every heading, no `→` glued to link text, no `A · B · C` meta
  strings, no single highlighted word inside headlines.
- No identical card grid for every section: each section uses the structure its content needs
  (list, table-like rows, route, cards only for parallel offers such as plans or services).
- No warm-cream + serif + terracotta palette and no near-black + acid accent.

## Tokens

Defined once in `src/app/globals.css` (`@theme`) and consumed as Tailwind utilities.

### Colour

| Token           | Hex                   | Use                                                  | Contrast                |
| --------------- | --------------------- | ---------------------------------------------------- | ----------------------- |
| `ink`           | `#16242C`             | Body text, dark sections                             | 15.9:1 on white         |
| `ink-soft`      | `#4A5A62`             | Secondary text                                       | 7.2:1 white, 6.5:1 mist |
| `paper`         | `#FFFFFF`             | Default surface                                      |                         |
| `mist`          | `#F2F5F4`             | Alternate section surface, subtle fills              |                         |
| `line`          | `#DCE3E0`             | Decorative borders and dividers (non-essential)      |                         |
| `control`       | `#788A8E`             | Borders that identify form controls                  | 3.6:1 white (≥3:1)      |
| `pine-700`      | `#0F5C52`             | Primary brand colour: buttons, links, focus on light | 7.9:1 white             |
| `pine-800`      | `#0B4A42`             | Primary hover/active                                 | 10.1:1 white            |
| `pine-50`/`100` | `#EAF4F1` / `#D3E8E2` | Tints for selected states and badges                 | pine-700 7.0:1 on 50    |
| `signal`        | `#F2B53A`             | Route marker, accent on dark surfaces, focus on dark | 8.7:1 on ink            |
| `signal-700`    | `#8F5B0A`             | Amber text on light surfaces (rare)                  | 5.7:1 white             |
| `danger`        | `#B42318`             | Errors                                               | 6.6:1 white             |
| `on-dark-soft`  | `#B9C7C4`             | Secondary text on `ink`                              | 9.1:1 on ink            |

Amber is never used as text on white and never as a large background on light sections.

### Typography

- One family: **Schibsted Grotesk** (variable, 400–900, latin + latin-ext), self-hosted via
  `next/font`. It is sturdy and editorial — trustworthy without looking corporate — and one
  family keeps font transfer small.
- Type scale (rem): 0.875 · 1 · 1.0625 (body) · 1.25 · 1.5 · 2 · 2.5 · 3.25 (display, desktop).
- Headings: weight 700, letter-spacing −0.02em, `text-wrap: balance`. Body: 1.0625rem / 1.65,
  `text-wrap: pretty`, max line length ≈ 68ch.
- Sentence case everywhere. Numbers that matter (score, prices) use tabular figures.

### Layout and spacing

- Container: max 72rem (1152px) content width, 16px gutters on mobile, 24px tablet, 32px desktop.
- Section spacing: 64px mobile, 96px desktop (`py-16 md:py-24`). Section header to content: 40–48px.
- Content is left-aligned. Centered text only for short closing CTAs.
- 12-column mental grid; most sections use 1 or 2 columns, card grids 2–3 columns.

### Shape and elevation

Radius encodes hierarchy instead of one radius everywhere:

| Element                | Radius                  |
| ---------------------- | ----------------------- |
| Buttons, badges, chips | full (pill)             |
| Inputs, option tiles   | 12px (`rounded-xl`)     |
| Cards and panels       | 20px (`rounded-[20px]`) |
| Large feature surfaces | 28px                    |

Elevation is mostly borders (`line`). One shadow token, `shadow-lift`, is used for floating
surfaces (hero preview, selected plan, mobile menu) — never under every card.

## Components

| Component                                | Location                           | Notes                                                                                   |
| ---------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------- |
| `Container`                              | `components/ui/container.tsx`      | Width + gutters.                                                                        |
| `Section`                                | `components/ui/section.tsx`        | `tone`: `paper` / `mist` / `ink`; spacing; `aria-labelledby`.                           |
| `SectionHeader`                          | `components/ui/section-header.tsx` | h2 + optional intro; no eyebrow by default.                                             |
| `buttonStyles` / `ButtonLink` / `Button` | `components/ui/button.tsx`         | Variants `primary`, `secondary`, `on-dark`, `ghost`; sizes `md`, `lg`; min target 44px. |
| `Badge`                                  | `components/ui/badge.tsx`          | `neutral`, `brand`, `signal`.                                                           |
| Form controls                            | `components/ui/form.tsx`           | `Field` (label, hint, error wiring), `TextInput`, `TextArea`, `Select`, `Checkbox`.     |
| `Logo`                                   | `components/layout/logo.tsx`       | Route mark + wordmark, SVG, no image request.                                           |
| `RouteLine`                              | `components/ui/route-line.tsx`     | The brand device: stops + marker.                                                       |

### States

- Focus: 2px outline, 3px offset, `pine-700` on light surfaces and `signal` on `ink` surfaces
  (`:focus-visible` only). Never removed.
- Hover: colour/border shift only; no scale jumps on cards.
- Disabled: 50% opacity + `cursor-not-allowed`; never the only signal of state.
- Errors: red text + icon + message linked with `aria-describedby`; never colour alone.
- Selected option tiles: pine border + pine-50 fill + check icon.

## Motion

Library: `motion` (`motion/react`) with `LazyMotion` + `domAnimation` to keep the bundle small;
CSS transitions for hover/focus.

| Where                        | What                                             | Duration |
| ---------------------------- | ------------------------------------------------ | -------- |
| Section entrance (key grids) | opacity 0→1, y 16→0, once, staggered 60ms        | 450ms    |
| Wizard step change           | direction-aware x ±24px + fade                   | 250ms    |
| Wizard progress              | bar `scaleX`, route marker moves to stop         | 300ms    |
| Diagnosis result             | score counts up, ring draws, bars fill staggered | 900ms    |
| Hero preview                 | single orchestrated reveal of the route          | 1.2s     |

Rules: only `transform` and `opacity`; no scroll listeners (use `whileInView` / IntersectionObserver);
`MotionConfig reducedMotion="user"` globally plus a CSS `prefers-reduced-motion` reset; content
must be visible without JavaScript (`noscript` override for reveal styles); the LCP heading is
never animated.

## Acceptance criteria

- [ ] AC1 — All tokens above exist in `globals.css` and no component hard-codes hex values.
- [ ] AC2 — Text/background pairs used in the UI meet WCAG AA (4.5:1 text, 3:1 UI boundaries).
- [ ] AC3 — Every interactive element has a visible `:focus-visible` style on every surface tone.
- [ ] AC4 — With `prefers-reduced-motion: reduce`, no transform animations run.
- [ ] AC5 — Pages render complete content with JavaScript disabled (except interactive wizard).
- [ ] AC6 — Interactive targets are at least 44×44px (24×24 minimum for inline controls).
