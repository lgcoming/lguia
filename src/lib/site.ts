/** Production origin. A generic TLD so the English site is not geo-targeted to one country. */
export const PRODUCTION_ORIGIN = "https://lguia.com";

export const siteConfig = {
  name: "lguia",
  /** Person behind the brand (legal notice, privacy policy, structured data). */
  owner: "Luis Gómez",
  // Email Routing forwards it to the owner's inbox; leads use LEADS_TO instead (SPEC-010).
  email: "hola@lguia.com",
  /** ISO 3166-1 code of the country lguia operates from (it works remotely, no public address). */
  country: "ES",
  /**
   * Date of the last meaningful content change, for the sitemap's <lastmod>. Bump it when copy,
   * prices or pages change: a date that moves on every build teaches crawlers to ignore it.
   */
  contentUpdated: "2026-11-14",
} as const;

/**
 * Canonical origin for metadata, sitemap and structured data. Pages are prerendered at build
 * time, so this is resolved while building: explicit env → any production build (the one
 * deployed to Cloudflare Workers) → local development.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  if (process.env.NODE_ENV === "production") return new URL(PRODUCTION_ORIGIN);
  return new URL("http://localhost:3000");
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
