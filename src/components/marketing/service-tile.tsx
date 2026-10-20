import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { CategoryIcon } from "@/components/marketing/category-icon";
import { categoryMedia } from "@/components/marketing/category-media";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { categoryHref } from "@/features/catalog/routes";
import { cn } from "@/lib/utils";
import type { ServiceCategory } from "@/types/catalog";

interface ServiceTileProps {
  category: ServiceCategory;
  /** Sizes hint for the photograph, matching the tile's width in its grid. */
  sizes: string;
  className?: string;
}

/**
 * Photographic bento tile with a glass caption. The whole tile is clickable through one
 * stretched link (one tab stop, one accessible name).
 */
export function ServiceTile({ category, sizes, className }: ServiceTileProps) {
  const media = categoryMedia[category.id];

  return (
    <article
      className={cn(
        "group surface-dark relative isolate flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-tile bg-carbon text-pure-white",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-iris-blue",
        className,
      )}
    >
      <Image
        src={media.image}
        alt=""
        fill
        sizes={sizes}
        className={cn(
          "-z-10 object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]",
          media.position,
        )}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-carbon/85 via-carbon/35 to-carbon/5"
      />
      <div className="p-4 md:p-5">
        <div className="glass-panel rounded-[1.25rem] p-5 md:p-6">
          <CategoryIcon icon={category.icon} className="size-6 text-pure-white" />
          <h3 className="mt-3 text-heading-sm">
            <Link
              href={categoryHref(category.id)}
              className="after:absolute after:inset-0 after:rounded-tile focus-visible:outline-none"
            >
              {category.name}
            </Link>
          </h3>
          <p className="mt-2 text-footnote text-ash-veil">{category.summary}</p>
          <span
            aria-hidden="true"
            className="mt-4 inline-flex items-center gap-0.5 text-footnote text-sky-signal group-hover:underline"
          >
            Más información
            <ChevronRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

const slotClasses = {
  wide: "md:col-span-2 lg:col-span-2",
  tall: "md:col-span-1 lg:row-span-2",
  regular: "",
} as const;

const slotSizes = {
  wide: "(min-width: 1024px) 66vw, 100vw",
  tall: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  regular: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
} as const;

/** Services bento: one wide, one tall and two regular tiles that interlock on desktop. */
export function ServicesBento({ categories }: { categories: ServiceCategory[] }) {
  const ordered = [...categories].sort(
    (a, b) => categoryMedia[a.id].order - categoryMedia[b.id].order,
  );

  return (
    <RevealList className="grid gap-4 md:grid-cols-2 lg:auto-rows-[25rem] lg:grid-cols-3">
      {ordered.map((category) => {
        const slot = categoryMedia[category.id].slot;
        return (
          <RevealItem key={category.id} className={cn("flex", slotClasses[slot])}>
            <ServiceTile category={category} sizes={slotSizes[slot]} className="w-full" />
          </RevealItem>
        );
      })}
    </RevealList>
  );
}
