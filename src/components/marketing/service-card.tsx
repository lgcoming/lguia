import { Check } from "lucide-react";
import Link from "next/link";

import { CategoryIcon } from "@/components/marketing/category-icon";
import { categoryHref } from "@/features/catalog/routes";
import type { ServiceCategory } from "@/types/catalog";

/** Whole card is clickable through a single stretched link (one tab stop, one accessible name). */
export function ServiceCard({ category }: { category: ServiceCategory }) {
  return (
    <article className="group relative flex h-full flex-col rounded-card border border-line bg-paper p-6 transition-colors duration-150 hover:border-pine-700 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-pine-700 md:p-8">
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-pine-50 text-pine-700">
        <CategoryIcon icon={category.icon} className="size-6" />
      </span>
      <h3 className="mt-6 text-h4">
        <Link
          href={categoryHref(category.id)}
          className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
        >
          {category.name}
        </Link>
      </h3>
      <p className="mt-3 text-ink-soft">{category.summary}</p>
      <ul className="mt-5 space-y-2 text-base">
        {category.services.slice(0, 3).map((service) => (
          <li key={service.id} className="flex gap-2">
            <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-pine-700" />
            {service.name}
          </li>
        ))}
      </ul>
      <span
        aria-hidden="true"
        className="mt-auto pt-6 font-semibold text-pine-700 underline-offset-4 group-hover:underline"
      >
        Ver qué incluye
      </span>
    </article>
  );
}
