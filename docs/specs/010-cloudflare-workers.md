# SPEC-010 — Hosting on Cloudflare Workers and lead notifications

- Status: Implemented, live on lguia.com since 2026-11-14
- Sprint: Launch (2026-11)
- Related: [005](./005-leads.md), [006](./006-api.md), [008](./008-quality.md),
  [009](./009-international-seo.md)

## Context

The domain `lguia.com` and its mailbox (`hola@lguia.com`, Email Routing to the owner's inbox) live
in Cloudflare. Hosting the site there too keeps one provider and stays within the Workers free plan;
Vercel's free plan excludes commercial use.

## Decisions

- **Adapter: OpenNext** (`@opennextjs/cloudflare`), which runs the real `next build` output, so the
  Next.js test suite and behaviour stay valid. Cloudflare's alternative, vinext, reimplements
  Next.js on Vite and was not chosen. OpenNext requires Next.js ≥ 16.4.5.
- **Caching**: every page is prerendered and nothing revalidates, so `open-next.config.ts` uses the
  read-only static-assets incremental cache (no R2, KV or Durable Objects).
- **Images**: `next/image` is optimised by the Cloudflare Images binding (`IMAGES`).
- **Domain**: `wrangler.jsonc` declares `lguia.com` and `www.lguia.com` as Custom Domains;
  `next.config.ts` redirects `www` to the apex (308). `workers.dev` and preview URLs are off.
- **Canonical origin**: production builds use `https://lguia.com` (`getSiteUrl`), overridable with
  `NEXT_PUBLIC_SITE_URL`.
- **Files at runtime**: a Worker has no file system. Code that reads `public/` at request time
  (social images) falls back to the `ASSETS` binding.

## Lead notifications

- `submitLead` calls a `LeadNotifier` after storing the lead; honeypot submissions are not
  notified. A notifier failure fails the request (500), so the visitor is told to use email
  instead of losing the lead.
- On Workers the notifier sends an email with the `send_email` binding `LEADS_EMAIL` from
  `web@lguia.com` to the `LEADS_TO` secret, with `Reply-To` set to the lead. Sending to a
  destination address verified in Email Routing is free on every plan.
- The in-memory repository does not persist on Workers: email is the record of each lead until a
  database (D1) is specified.
- Outside Workers (next dev, tests) there is no binding and the notifier is a no-op.

## Operations

- `npm run preview`: build and run the Worker locally (`.dev.vars` provides `LEADS_TO`; emails are
  logged, not sent).
- First deploy: `npx wrangler login`, `npx wrangler secret put LEADS_TO`, `npm run deploy`.
- Since 2026-11-14 **Workers Builds** deploys every push to `main` (GitHub app limited to
  `lgcoming/lguia`; build `npx opennextjs-cloudflare build`, deploy
  `npx opennextjs-cloudflare deploy`; preview builds off). `npm run deploy` stays as a manual fallback.

## Acceptance criteria

- [x] AC1 — The Worker build serves every page, 404, API route, sitemap, robots, llms.txt, social
      image and optimised image locally in workerd.
- [x] AC2 — A contact lead produces one email with every field, in Spanish, replying to the lead
      (unit tests + local binding log); honeypot leads send nothing.
- [x] AC3 — Canonical and hreflang URLs use `https://lguia.com` in the Worker build.
- [x] AC4 — The compressed Worker stays under the 3 MiB free-plan limit (2.2 MiB).
- [x] AC5 — Deployed on `lguia.com` with HTTPS (Always Use HTTPS on), the `www` redirect and a
      live lead email verified.
