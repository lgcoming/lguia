import Link from "next/link";
import type { ReactNode } from "react";

import { MediaBand } from "@/components/media/media-band";
import { Container } from "@/components/ui/layout-primitives";
import { cn } from "@/lib/utils";

export interface Breadcrumb {
  href: string;
  label: string;
}

function Breadcrumbs({ items, onDark }: { items: Breadcrumb[]; onDark: boolean }) {
  return (
    <nav aria-label="Migas de pan" className="mb-6">
      <ol
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-2 text-footnote",
          onDark ? "text-ash-veil" : "text-pewter",
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span
                  aria-current="page"
                  className={cn("font-semibold", onDark ? "text-pure-white" : "text-obsidian")}
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-6 items-center underline-offset-4 hover:underline"
                  >
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
  /** A photograph turns the hero into a dark band that slides under the header glass. */
  media?: { image: string; position?: string };
  children?: ReactNode;
}

/** Centered page hero: headline → subhead → actions, on white or over a photograph. */
export function PageHero({ title, intro, breadcrumbs, media, children }: PageHeroProps) {
  const onDark = Boolean(media);
  const content = (
    <>
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} onDark={onDark} /> : null}
      {/* Long Spanish words ("automatizaciones") need a smaller size and hyphenation on 320px. */}
      <h1 className="text-[2.25rem] leading-[1.08] tracking-[-0.02em] max-[399px]:text-[1.875rem] max-[399px]:hyphens-auto sm:text-[3rem] md:text-display">
        {title}
      </h1>
      <p
        className={cn(
          "mx-auto mt-5 max-w-2xl text-body sm:text-subheading",
          onDark ? "text-ash-veil" : "text-pewter",
        )}
      >
        {intro}
      </p>
      {children ? (
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          {children}
        </div>
      ) : null}
    </>
  );

  if (media) {
    return (
      <MediaBand
        image={media.image}
        imagePosition={media.position}
        eager
        overlay="band"
        className="-mt-13"
      >
        <Container width="text" className="pt-32 pb-20 text-center md:pt-40 md:pb-28">
          {content}
        </Container>
      </MediaBand>
    );
  }

  return (
    <div className="bg-pure-white">
      <Container width="text" className="pt-14 pb-16 text-center md:pt-20 md:pb-24">
        {content}
      </Container>
    </div>
  );
}
