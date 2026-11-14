import { getDictionary } from "@/i18n/dictionaries";
import { OG_SIZE, renderOgImage } from "@/lib/og-image";

export const alt = getDictionary("es").meta.ogAlt;
export const size = OG_SIZE;
export const contentType = "image/png";

/** Social image for the Spanish pages. */
export default function OpenGraphImage() {
  return renderOgImage("es");
}
