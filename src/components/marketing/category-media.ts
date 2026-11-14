import type { ServiceCategoryId } from "@/types/catalog";

/*
 * Presentation-only mapping from a service category to its photograph and bento slot
 * (SPEC-002 v2 asset map). Kept out of src/data so the catalog API stays content-only.
 * Class names are literal so Tailwind can see them.
 */
export interface CategoryMedia {
  image: string;
  /** Focal point of the photograph inside its tile. */
  position: string;
  /** Slot in the services bento: one wide tile, one tall tile, two regular tiles. */
  slot: "wide" | "tall" | "regular";
  /** Order inside the bento, so the wide and tall tiles interlock without gaps. */
  order: number;
}

export const categoryMedia: Record<ServiceCategoryId, CategoryMedia> = {
  "desarrollo-web": {
    image: "/media/images/web-development.jpg",
    position: "object-[35%_50%]",
    slot: "wide",
    order: 1,
  },
  "chatbots-ia": {
    image: "/media/images/business-ai.jpg",
    position: "object-[50%_40%]",
    slot: "tall",
    order: 2,
  },
  automatizaciones: {
    image: "/media/images/automation.avif",
    position: "object-[40%_50%]",
    slot: "regular",
    order: 3,
  },
  "seo-geo": {
    image: "/media/images/connections.jpg",
    position: "object-center",
    slot: "regular",
    order: 4,
  },
};
