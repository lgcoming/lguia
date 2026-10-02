import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is, without the "| LGuIA" template (home page). */
  absoluteTitle?: boolean;
}

/** The generated image at src/app/opengraph-image.tsx. */
const SHARED_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "LGuIA: webs, automatización e IA práctica para pymes",
};

/**
 * Consistent metadata for public pages (SPEC-007): title, description, self-referencing
 * canonical, Open Graph and Twitter card. A page-level `openGraph` object replaces the
 * parent one entirely (including the file-based image), so shared fields are repeated here.
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
      images: [SHARED_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARED_IMAGE.url] },
  };
}
