# MEMORY — durable project knowledge

Decisions, conventions and constraints that are not obvious from the code. Newest entries at the
top of each section. Keep entries short; link to specs for detail.

## Product facts and placeholders

- Site language: Spanish (es-ES). Market: Spain. Code and docs: English.
- **Prices in `src/data/plans.ts` are indicative placeholders** (Starter Local 690 €, Web Pro
  1900 €, IA Starter 1200 €, Automation Pack 950 €, Growth Web + IA 3900 €, Custom Enterprise "a
  medida"; VAT excluded). Validate with the business before launch.
- **Domain is `lguia.com`** (owner's, at Cloudflare; decided 2026-11-14). Production builds use it
  as canonical origin. `hola@lguia.com` forwards to the owner's inbox with Email Routing.
- **Legal pages (SPEC-011)**: owner "Luis Gómez" trading as lguia. The owner does not publish his
  NIF or home address (2026-11-14); LSSI-CE art. 10 requires them, so this is a known gap until
  there is a business address or a company. No cookie banner while no cookies are set.
- **Hosting is Cloudflare Workers via OpenNext** (owner decision 2026-11-14, SPEC-010): same
  provider as domain and mail, free plan; Vercel Hobby excludes commercial use. Leads are emailed
  through the `send_email` binding to the `LEADS_TO` secret (the personal inbox is never committed).
- Response-time promise in forms ("2 días laborables") is a placeholder commitment to confirm.
- No testimonials, logos or stats until real ones exist (credibility over decoration).
- Legal pages (aviso legal, privacidad, cookies) are pending; forms carry an inline basic
  data-protection notice. No cookies or analytics are used yet, so no cookie banner is needed.

## Architecture decisions

- **`zod/mini` for all schemas** (2026-10-02): `import { z } from "zod"` bundled every locale and
  the JSON Schema converter into the client (~90 KB gzip on /contacto and /diagnostico-digital).
  `zod/mini` is the same engine with a tree-shakable functional API. `z.preprocess` becomes
  `z.pipe(z.transform(...), schema)` (see `optionalText()` in `features/leads/schema.ts`).
  Never import from `"zod"` in code that can reach the client.
- **Motion loading** (2026-10-02): `LazyMotion` loads `domAnimation` through a dynamic import
  (`components/motion/motion-features.ts`) and components use `import * as m from "motion/react-m"`.
  Importing `m` from the `motion/react` barrel kept ~30 KB more in the initial bundle.
- **Page metadata must list the OG image explicitly**: a page-level `openGraph` object replaces the
  parent one, including the file-based `opengraph-image`. `createPageMetadata()` adds it.
- **The OG image uses the renderer's built-in sans (Geist)** plus the light logo and the hero
  poster read from `public/` (2026-10-20). Satori cannot read the variable WOFF2 that `next/font`
  serves, and no static Inter file is vendored; the old Schibsted WOFF files were removed.
- **The diagnosis preview is a real engine result** for an example business (`EXAMPLE_ANSWERS` in
  the home page), computed at build time, so the marketing visual never drifts from the product.
  Since the redesign it lives in the diagnosis CTA tile, not in the hero.
- **Calculating screen moves focus to its heading** instead of using a `role="status"` region: the
  submit button unmounts, so focus must land somewhere meaningful (SPEC-004 updated).
- **Deterministic diagnosis engine** (SPEC-004): pure functions in `src/features/diagnosis/model`.
  The wizard calls `POST /api/diagnosis` (single source of truth on the server); lead submission
  recomputes the diagnosis server-side from the answers instead of trusting client results.
- **Repositories**: `CatalogRepository` (static data) and `LeadRepository` (in-memory on
  `globalThis`). Swapping to a DB = new implementation + change the `get*Repository()` factory.
- **In-memory leads are not durable on serverless** (per-instance memory, reset on cold start).
  Fine for the demo; a persistent repository is required before collecting real leads.
- **Admin gate**: `isAdminEnabled()` = not production, or `ENABLE_DEMO_ADMIN=true`. No auth yet,
  so never enable the flag on a deployment that receives real leads.
- **Cache Components disabled**: static-first site; the only dynamic page (`/admin/leads`) uses
  `connection()`.
- **Diagnosis questions merged**: "has website" + "is it updated" → one `websiteStatus` question to
  avoid conditional steps.
- **Question definitions live with the model** (`features/diagnosis/model/questions.ts`) because
  option values and scoring are coupled; labels are typed `Record<Value, string>` so every option
  must have a label.
- **Honeypot instead of CAPTCHA** for spam on lead forms: zero third-party JS, no user friction.

## Internationalisation and SEO (SPEC-009)

- **Bilingual ES + EN with one root layout per language** (2026-11-12): Spanish at `/`, English
  under `/en`, translated segments and slugs, physical route folders that call shared views in
  `src/views/`. Chosen over `app/[lang]` + rewrites: fully static, correct `<html lang>` without a
  proxy, no duplicate internal URLs. Cost: thin route files per language and a client-painted 404.
- **x-default points at English**; hreflang uses language-only codes (`es`, `en`) so Spanish also
  serves Latin America.
- **Keyword targets** (qualitative, from SERP checks; no keyword tool, volumes not measured):
  desarrollo web a medida / custom web development; automatización de procesos (con IA) / AI
  automation; agentes de IA y chatbots para empresas / AI agents and chatbots for business; SEO y
  GEO / SEO and GEO services; diagnóstico digital gratuito / free digital maturity assessment.
- **Copy rules for both languages**: head term first in title and H1, an answer-first `answer`
  per service with price and timeline, no superlatives, no invented figures, no ranking or
  citation promises. Prices quoted in copy are unit-tested against the plans.
- **`opengraph-image` inside a route group gets a hashed URL**, so the English social image is a
  fixed route handler (`/og-en.png`).
- **Do not name an app folder `_document`** (kept as `_shared`).
- **AI crawlers are all allowed** in robots.txt, training ones included; move GPTBot, ClaudeBot,
  Google-Extended and Applebot-Extended to a Disallow rule to opt out of training only.
- **English copy is not reviewed by a native speaker yet** (owner decision).
- **Dark glass is AMOLED black** (`carbon` at 85%, opaque `carbon` fallback); the old `night`
  (#161617) token was removed at the owner's request (2026-11-14).
- **Next.js 16.4.6** (from 16.3.8): required by `@opennextjs/cloudflare` (>= 16.4.5).

## Design decisions (SPEC-002)

- **Brand name is always `lguia`, lowercase** (2026-10-20, owner's rule): titles, metadata,
  footer, sentence starts and JSON-LD included. Never capitalise it or apply `text-transform`.
- **The scrubbed hero no longer depends on `prefers-reduced-motion`** (2026-10-20): the owner's
  machine has Windows animation effects off, so the hero never scrubbed for them. Scrubbing only
  moves when the user scrolls (no autoplay), so it stays on from 768px; reduced motion keeps the
  fades but drops the media zoom and text travel. Parallax and entrances still honour it.
- **"Diagnóstico" removed from the main nav**: the "Diagnóstico gratuito" button is the single
  entry point in the header (the footer keeps its link).

- **Scroll choreography with Motion, not GSAP/Lenis** (2026-10-20): Motion is already a runtime
  dependency and covers `useScroll` + `useSpring` + `useTransform`; adding GSAP would break the
  dependency policy for no capability gain. Lenis-style smooth scrolling was rejected: it hijacks
  native scrolling (keyboard, screen readers, find-in-page, battery). Inertia lives only in the
  scrubbed value (a spring), never in the page scroll.
- **Scrubbed hero = video + dense keyframes + blob**, not an image sequence: one 2.7 MB file,
  hardware-decoded, low memory (a 224-frame image sequence decodes to ~800 MB of bitmaps). The
  file is fetched whole after `load` so seeks never wait on range requests. Seeks are coalesced to
  one per frame and skipped while `video.seeking`.
- **Pinned layout is CSS-only** (`md:motion-safe:` height + `sticky`): JavaScript only binds
  styles once `useMediaQuery` confirms the same query, so hydration never changes layout. Mobile,
  reduced motion and no-JS get the static hero; no empty 300svh track to scroll through.
- **Hero copy is restored on keyboard focus** with `:focus-within` + `!important` (beats Motion's
  inline styles), otherwise Shift+Tab from the next section could focus an invisible button.
- **Entrance blur is dropped at rest** (`transitionEnd: { filter: "none" }`): a resting
  `blur(0px)` still creates a backdrop root and stacking context around the glass captions.
- **Header 56px / 64px from `lg`** (was 52px; +23% on desktop, matching the 20–25% asked for). A
  single `--header-height` variable drives the bar, the heroes that slide under it (`-mt-`),
  anchor offsets and `scroll-padding-top`. The hairline is an `::after` so it does not add a pixel
  to the height (it first made the bar 65px and left a 1px seam above the hero).

- **Redesign v2, Apple-inspired** (2026-10-20, branch `feature/apple-redesign`): Refero "Apple
  (España)" tokens, Inter with optical sizes as the SF Pro substitute, light canvas + dark media
  bands, glass chrome, bento grids. v1 ("la guía", pine/amber, Schibsted, route line) is in git
  history.
- **This development machine reports `prefers-reduced-motion` and `prefers-reduced-transparency`**
  (Windows animation and transparency effects are off), so the in-app browser and Playwright show
  posters instead of videos and opaque glass. That is the intended accessible fallback. To see
  the full effect, measure or screenshot with CDP `Emulation.setEmulatedMedia` set to
  `no-preference` (as the verification scripts do) or turn those Windows settings on.
- **Overlays were tuned against real video frames**, not the posters: with the first overlays
  the hero eyebrow and reassurances dropped to 3.2–3.8:1 on bright frames. The hero overlay is
  now ~65% black in the text area and the process band 60–80%. Text over footage is white or
  `ash-veil`; `silver` fails on the bright wave.
- **The pre-hydration dark header rule ignores JSON-LD scripts**
  (`:nth-child(1 of :not(script))`): pages such as `/planes` start `<main>` with a `<script>`,
  so `:first-child` never matched. The `:has()` rules are separate from the `[data-theme]` rules
  so a browser without `:has()` only loses the pre-hydration state.
- **`iris-blue` also marks selected option tiles** in the wizard: it is Apple's configurator
  pattern, and a monochrome selection was weaker than the error state next to it.
- **Inter keeps its `opsz` axis** (72 KB latin WOFF2): it gives the display cut for headlines.
  Lighthouse mobile LCP rose from ~2.7 s to 3.0–3.3 s (simulated) with Performance 93–96; drop
  the axis first if performance needs to recover.
- **Diagnosis CTA is a tile, contact CTA a full-bleed band**: two full-bleed dark image bands back
  to back (home sections 9 and 10) felt heavy; the tile keeps the "product shot" contained.
- **Desktop navigation starts at `lg` (1024px)**: logo + 4 links + CTA overflowed at 768px.
- **Headings scale down and hyphenate below 400px** (`max-[399px]:hyphens-auto`): long Spanish
  words such as "automatizaciones" otherwise force horizontal scroll at 320px. Hyphenation is
  scoped to narrow screens so desktop headings never break words.
- **`cn()` does not merge conflicting utilities**: never override a component's display, size or
  colour through `className` (this caused a header overflow and invisible route stops). Use props,
  variants or a wrapper.
- Reveal animations hidden only when JS runs: `noscript` style override keeps content visible
  without JavaScript.

## Dependencies (justification)

| Package                                                         | Why                                                                                                              |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `motion`                                                        | Wizard/result/progress transitions and in-view reveals with reduced-motion support; `LazyMotion` keeps it small. |
| `lucide-react`                                                  | Consistent, tree-shakeable SVG icons.                                                                            |
| `zod` (used via `zod/mini`)                                     | One schema for client + server validation and inferred types; the mini entry keeps the client bundle small.      |
| `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/*` | Unit, integration and component tests.                                                                           |
| `@playwright/test`                                              | The single critical E2E flow.                                                                                    |
| `prettier`, `prettier-plugin-tailwindcss`                       | Consistent formatting and class order.                                                                           |
| `@types/node@24`                                                | Matches Node 24 LTS runtime; required by Vitest 5 peer range.                                                    |
| `@opennextjs/cloudflare`, `wrangler` (dev)                      | Build and deploy the Next.js output as a Cloudflare Worker (SPEC-010); no runtime dependency added.              |

## Media pipeline

- Originals: `assets/media-source/*.mp4` (not served). Served files are generated by
  `node scripts/encode-videos.mjs`: Chrome's WebCodecs encodes H.264 High at 720p/24fps with a
  forced keyframe interval (4 frames for the scrubbed hero, 48 for the looping band), no audio,
  and the script muxes a fast-start MP4 (`moov` first). Original files were H.264 with a 30-frame
  keyframe interval, an unused AAC track, `moov` at the end and ~4.4 Mbps.
- Measured scrub cost in Chrome (120 back-and-forth seeks): original 11 ms average / 20 ms p95 /
  56 ms max; encoded 6 / 9 / 17 ms.
- Equivalent ffmpeg commands, if ffmpeg becomes available:
  - Scrubbed hero: `ffmpeg -i in.mp4 -an -c:v libx264 -preset slow -crf 23 -g 4 -keyint_min 4
-sc_threshold 0 -r 24 -pix_fmt yuv420p -movflags +faststart out.mp4`
  - Looping band: same with `-crf 26 -g 48 -keyint_min 48`.
  - Optional smaller sources for the looping band, listed before the MP4 in `<source>` order:
    VP9 `-c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -g 48 -an out.webm`; AV1
    `-c:v libsvtav1 -crf 38 -g 48 -an out.av1.mp4`. Keep H.264 for the scrubbed hero (hardware
    decode on every device; software AV1/VP9 seeking costs more CPU).

## Tooling notes

- **Work from the folder's real casing: `E:\Nueva carpeta\PROYECTOS\Agencia lguia\lguia`.** The
  folder was renamed from `Agencia LGuia`; Windows still opens the old casing, but the bundler then
  loads two copies of React and `next build` fails ("Expected workStore to be initialized",
  "Cannot read properties of null (reading 'useContext')"), Playwright reports "did not expect
  test() to be called here" and jest-dom stops extending `expect`. This was first blamed on Node
  24.22 (2026-11-12); Node 24.22 works from the right path. `tests/setup-dom.ts` registers the
  matchers explicitly anyway. `dev`, `build`, `start`, `test:e2e`, `preview` and `deploy` run
  through `scripts/in-real-path.mjs`, which switches to the real casing first.
- Playwright: if the bundled browser is missing, run with `PLAYWRIGHT_CHANNEL=chrome`.

- Windows dev environment: repo uses `core.autocrlf=false` + `.gitattributes` (`eol=lf`).
- **Regenerate `package-lock.json` with the npm version CI uses** (11.19.0 on Node 24.21 at the
  time of writing): `npx npm@11.19.0 install --package-lock-only`. A lockfile written by npm 11.6
  on Windows lacked top-level `@emnapi/*` entries (optional WebAssembly fallbacks) that newer npm
  requires, so `npm ci` failed on the first GitHub Actions run. Running `npm install` with an
  older npm afterwards silently removes those entries again (it happened once), which is why
  `package.json` declares `engines.npm >= 11.19.0`: older npm now warns (`EBADENGINE`). Upgrade
  with `npm install -g npm@11.19.0` or newer.
- `npm run typecheck` runs `next typegen` first so `PageProps`/`RouteContext` globals exist.
- Vitest projects: `node` (unit + integration) and `dom` (components, jsdom + jest-dom matchers).
- Vite 8 resolves the `@/*` alias natively via `resolve.tsconfigPaths` (no extra plugin).
- GitHub CLI (`gh`) is not installed locally: issues/project board are described in
  `docs/backlog.md` and can be created once the remote exists.
- GitHub CLI 2.102 installed with winget at `C:\Program Files\GitHub CLI\gh.exe` (GitHub Desktop
  is also installed but cannot create repositories or issues from the terminal).
- Playwright's browser CDN was unreachable from the development machine; local E2E runs use the
  installed Chrome with `PLAYWRIGHT_CHANNEL=chrome`. CI installs the bundled Chromium.
- On Windows, stopping `npm run start` can leave the child `next start` process alive and holding
  the port: a later server fails to bind and checks silently hit the old build. Verify the port
  is free (`netstat -ano | findstr :3100`) before re-testing a production build.
- Scripted multi-line edits must assert that the target text exists: two silent no-op replacements
  (after Prettier reformatting) briefly left the OG image without its font.

## Verification log

### 2026-11-14 — Cloudflare Workers

- Lint and types clean; 132 unit/integration/component tests; 10 E2E on desktop and mobile.
- Worker build (2.2 MiB gzip) run locally in workerd: all pages, 404s, APIs, sitemap, robots,
  llms.txt, social images and `next/image` answer correctly; canonical/hreflang on lguia.com; a
  contact lead triggers one `send_email` call.
- Deployed to lguia.com: every route, 404s, www and http redirects, closed admin view and a live
  lead email checked. The first live lead failed because the `LEADS_TO` secret was mistyped.

### 2026-11-12 — Bilingual site and international SEO

- Lint and types clean; 126 unit/integration/component tests; 10 E2E (Spanish flow, English site,
  language switcher, English assessment, 404 per language) on desktop and mobile, Node 24.12.
- Production build: 32 static pages. Checked with curl: `<html lang>`, canonical, hreflang (es, en,
  x-default), `og:locale` and alternates, sitemap with `xhtml:link`, robots.txt, `/llms.txt`,
  `/og-en.png`, 404 status for unknown URLs in both trees, JSON 404 for unknown API paths, English
  API responses with `?locale=en`.
- Not re-measured after this change: Lighthouse and contrast over media (layout of media bands is
  unchanged).

### 2026-10-20 — Scroll choreography, media pipeline and navbar

- `npm run check`: lint clean, types clean, 101 tests (new: scroll-to-video mapping). E2E passing
  on desktop and mobile.
- Pinned hero (Playwright, 1440×900, motion and transparency emulated on): stage top stays at 0 for
  the whole 2700px track; video time 0 → 9.27 s proportional to scroll; copy fades between 22% and
  38%; closing line between 72% and 86% with ≥ 6.7:1 contrast over its frames; continuous scroll
  updated the frame on 141 of 234 animation frames.
- Fallbacks: reduced motion, 375px and no-JS render a 100svh hero without track, video or outro.
- Keyboard: focusing "Ver servicios" at 70% of the track restores the copy (opacity 0 → 1) and
  hides the outro.
- Parallax: process band background moved 3.8px → 28.7px over 300px of scroll. Cards end with
  `filter: none`.
- Header: 64px desktop, 56px mobile (measured).
- Lighthouse 13: mobile `/` 92 / 100 / 100 / 100 (LCP `<h1>` 3.3 s simulated); desktop `/` with
  the scrub active 100 / 100 / 100 / 100 (LCP 0.7 s, TBT 0 ms, 3.0 MB total with the video fetched
  after `load`).

### 2026-10-20 — Apple redesign (production build, local)

- `npm run check`: lint clean, types clean, 98 tests passing (11 files). E2E diagnosis → lead flow
  passing on desktop and mobile (Chrome).
- Full-page screenshots of every route at 1440px and 375px: no horizontal overflow, one `h1`.
- Contrast over media measured on 8 frames per video and on every photo hero (see SPEC-002 AC2).
- JavaScript disabled: header starts dark on pages that open with a dark band; no hidden reveals.
- Keyboard: focus ring visible on the dark hero (sky ring); the mobile menu `<dialog>` closes on
  Escape and returns focus to the toggle.
- Lighthouse 13 mobile: Performance 93–96, Accessibility/Best practices/SEO 100 on `/`,
  `/servicios`, `/servicios/chatbots-ia`, `/planes`, `/contacto`, `/diagnostico-digital`; CLS 0,
  TBT 30 ms, LCP element `<h1>` (3.0–3.3 s simulated on media pages).

### 2026-10-02 — Release candidate (production build, local)

- `npm run check`: lint clean, types clean, **97 tests** passing (11 files).
- `npm run test:e2e`: critical diagnosis → lead flow passing on desktop and mobile (Chrome).
- `npm run format:check`: clean.
- **Lighthouse 13 (mobile, simulated throttling)**:

  | Page                   | Perf | A11y | Best practices | SEO | Agentic browsing | LCP   | TBT   | CLS |
  | ---------------------- | ---- | ---- | -------------- | --- | ---------------- | ----- | ----- | --- |
  | `/`                    | 97   | 100  | 100            | 100 | 100              | 2.7 s | 30 ms | 0   |
  | `/servicios`           | 98   | 100  | 100            | 100 | 100              | 2.4 s | 60 ms | 0   |
  | `/planes`              | 97   | 100  | 100            | 100 | 100              | 2.7 s | 30 ms | 0   |
  | `/contacto`            | 97   | 100  | 100            | 100 | 100              | 2.5 s | 60 ms | 0   |
  | `/diagnostico-digital` | 96   | 100  | 100            | 100 | 100              | 2.8 s | 30 ms | 0   |

  LCP element is the page `<h1>` on every page. With DevTools throttling the home LCP is 2.0 s;
  the simulated estimate attributes early-started JS to the LCP path. Field data (CrUX/RUM) is
  pending until the site has real traffic.

- **Initial JS (gzip, modern browsers, excluding `noModule` polyfills)**: marketing pages 150–155 KB
  (≈117 KB is React + Next.js runtime), `/contacto` 172 KB, `/diagnostico-digital` 200 KB.
- **Structure**: every route has exactly one `h1`, header/nav/main/footer landmarks, no skipped
  heading levels, no duplicate ids, no images without `alt`.
- **Responsive**: no horizontal overflow at 320, 375, 768 and ~1400px on any route.
- **Keyboard**: mobile menu (Escape returns focus to the toggle), contact form (focus first error),
  wizard (Tab between groups, Space to select, Enter to continue; focus moves to each step heading
  and to the result) verified in the browser and covered by component tests.
- **SEO**: unique titles/descriptions, self-referencing canonicals, `og:image` on every page,
  valid sitemap and robots, JSON-LD types as specified. Rich Results Test pending deployment.
- **Pending manual checks**: screen-reader pass (NVDA/VoiceOver) of the wizard (issue #19),
  Rich Results Test on the deployed URL (issue #15). Reflow at 320 CSS px (equivalent to 400% zoom
  of a 1280px window) is verified by the responsive checks.

### 2026-10-03 — GitHub

- Private repository `lgcoming/lguia` with `main` (default), `develop`, all feature/fix branches and
  tags `v0.1.0`–`v0.1.2`.
- First CI runs failed on `npm ci` (lockfile, see Tooling notes); after the fix, run 37087884073 on
  `main` and 37087884126 on `develop` passed both jobs (quality; production build + E2E).
- 24 issues (#1–#17 from `docs/backlog.md`, #18–#24 follow-ups), sprint milestones 0–3 (0–2
  closed) and project board "lguia" (users/lgcoming/projects/2) in board layout grouped by Status.

### 2026-10-03 — Closing checks

- Clean clone of the release branch: `npm ci` + `npm run check` + `npm run format:check` pass.
- Production build: unknown service slug → 404 (`noindex`); `/admin/leads` and `GET /api/leads`
  → 404 without `ENABLE_DEMO_ADMIN`.
- Automated keyboard pass (Playwright, real Tab key) on all 10 routes at 1366px and 375px: 13–36
  tab stops per page, every stop shows a visible focus indicator and is scrolled into view, no
  focus traps.
- JavaScript disabled: all reveal-wrapped content visible (`noscript` override works).
- `prefers-reduced-motion: reduce`: CSS animations neutralised, Motion transforms skipped, the
  diagnosis score renders at its final value immediately.
- ARIA snapshot (Chrome accessibility tree via Playwright) of the wizard: questions are named
  groups, radios carry their label text, errors sit inside their group, the visual progress is
  hidden, the result exposes named regions and "57 de 100" style scores. Not a substitute for a
  real NVDA/VoiceOver pass, which stays pending.
- Reviewing the reasons per business surfaced two copy/logic issues, now fixed: the AI rule reason
  duplicated the "interested" signal, and businesses already using AI got a "start from scratch"
  fallback (new `aiAdoption = using` signal; IA Starter tagline describes the project it includes).
