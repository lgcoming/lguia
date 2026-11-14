import { renderOgImage } from "@/lib/og-image";

export const dynamic = "force-static";

/**
 * Social image for the English pages, at a fixed URL. The `opengraph-image` file convention
 * gets a hashed path inside a route group, which metadata cannot reference reliably.
 */
export function GET() {
  return renderOgImage("en");
}
