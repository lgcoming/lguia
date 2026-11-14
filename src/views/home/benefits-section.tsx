import {
  Gauge,
  KeyRound,
  ListChecks,
  MessagesSquare,
  ShieldCheck,
  Target,
  type LucideIcon,
} from "lucide-react";

import { BrandWatermark } from "@/components/media/brand-watermark";
import { RevealItem, RevealList } from "@/components/motion/reveal";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

/*
 * Icon and bento placement for each item of `home.benefits.items`, in dictionary order.
 * lg (4 columns): the lead tile is 2×2, then 2 + 1 + 1, then 2 + 2 — twelve cells, no gaps.
 * md (2 columns): lead and last tiles are full width, the rest pair up. Literal classes.
 */
const layout: { icon: LucideIcon; span: string }[] = [
  { icon: Target, span: "md:col-span-2 lg:row-span-2" },
  { icon: MessagesSquare, span: "lg:col-span-2" },
  { icon: ListChecks, span: "" },
  { icon: KeyRound, span: "" },
  { icon: ShieldCheck, span: "lg:col-span-2" },
  { icon: Gauge, span: "md:col-span-2" },
];

export function BenefitsSection({ locale }: { locale: Locale }) {
  const { benefits } = getDictionary(locale).home;
  const [lead, ...rest] = benefits.items;
  const LeadIcon = layout[0].icon;

  return (
    <Section labelledBy="por-que-titulo">
      <SectionHeader id="por-que-titulo" title={benefits.title} />
      <RevealList className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RevealItem
          className={cn(
            "surface-dark relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-tile bg-obsidian p-8 text-pure-white md:p-10",
            layout[0].span,
          )}
        >
          <BrandWatermark className="-top-16 -right-16 size-72 opacity-[0.08] md:size-80" />
          <LeadIcon aria-hidden="true" className="size-8 text-sky-signal" strokeWidth={1.5} />
          <h3 className="mt-5 text-heading-sm md:text-heading-lg">{lead.title}</h3>
          <p className="mt-3 max-w-md text-body text-ash-veil">{lead.text}</p>
        </RevealItem>
        {rest.map(({ title, text }, index) => {
          const { icon: Icon, span } = layout[index + 1];
          return (
            <RevealItem
              key={title}
              className={cn("tile-hover flex flex-col rounded-tile bg-pure-white p-7 md:p-8", span)}
            >
              <Icon aria-hidden="true" className="size-7 text-obsidian" strokeWidth={1.5} />
              <h3 className="mt-5 text-subheading font-semibold">{title}</h3>
              <p className="mt-2 text-footnote text-pewter">{text}</p>
            </RevealItem>
          );
        })}
      </RevealList>
    </Section>
  );
}
