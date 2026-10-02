import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is, without the "| LGuIA" template (home page). */
  absoluteTitle?: boolean;
}

/**
 * Consistent metadata for public pages (SPEC-007): title, description, self-referencing
 * canonical, Open Graph and Twitter card. `openGraph` replaces the parent object, so the
 * shared fields are repeated here.
 */
export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: path,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
