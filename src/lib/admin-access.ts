/**
 * Lead data is private. Until authentication and persistent storage exist, internal views
 * are only available outside production, or on a demo deployment that opts in explicitly.
 * Never on Cloudflare Workers: the production site runs there and OpenNext embeds local .env
 * files in the Worker, so a local demo flag must not open it (SPEC-010).
 */
export function isAdminEnabled(
  env: NodeJS.ProcessEnv = process.env,
  userAgent: string | undefined = globalThis.navigator?.userAgent,
): boolean {
  if (userAgent === "Cloudflare-Workers") return false;
  return env.NODE_ENV !== "production" || env.ENABLE_DEMO_ADMIN === "true";
}
