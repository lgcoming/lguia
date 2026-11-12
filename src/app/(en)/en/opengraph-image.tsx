import { getDictionary } from "@/i18n/dictionaries";
import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = getDictionary("en").meta.ogAlt;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Social image for the English pages. */
export default function OpenGraphImage() {
  return renderOgImage("en");
}
