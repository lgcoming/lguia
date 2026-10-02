import Link from "next/link";
import type { ReactNode } from "react";

import { Container } from "@/components/ui/layout-primitives";

export interface Breadcrumb {
  href: string;
  label: string;
}

function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-2 text-sm text-ink-soft">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface PageHeroProps {
  title: string;
  intro: string;
  breadcrumbs?: Breadcrumb[];
  children?: ReactNode;
}

export function PageHero({ title, intro, breadcrumbs, children }: PageHeroProps) {
  return (
    <div className="border-b border-line bg-mist">
      <Container className="py-14 md:py-20">
        {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
        {/* Long Spanish words ("automatizaciones") need a smaller size and hyphenation on 320px screens. */}
        <h1 className="max-w-3xl text-[1.875rem] leading-[1.1] max-[399px]:hyphens-auto min-[400px]:text-h1 md:text-[3rem] md:leading-[1.06]">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lead text-ink-soft">{intro}</p>
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </Container>
    </div>
  );
}
