export const siteConfig = {
  name: "lguia",
  // Placeholder until the real mailbox is confirmed (see MEMORY.md).
  email: "hola@lguia.es",
  /** ISO 3166-1 code of the country lguia operates from (it works remotely, no public address). */
  country: "ES",
  /**
   * Date of the last meaningful content change, for the sitemap's <lastmod>. Bump it when copy,
   * prices or pages change: a date that moves on every build teaches crawlers to ignore it.
   */
  contentUpdated: "2026-11-12",
} as const;

/**
 * Canonical origin for metadata, sitemap and structured data.
 * Order: explicit env → Vercel production domain → local development.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return new URL(`https://${vercelProduction}`);

  return new URL("http://localhost:3000");
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
