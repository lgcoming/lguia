/**
 * Lead data is private. Until authentication and persistent storage exist, internal views
 * are only available outside production, or on a demo deployment that opts in explicitly.
 */
export function isAdminEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV !== "production" || env.ENABLE_DEMO_ADMIN === "true";
}
