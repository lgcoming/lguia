import {
  Factory,
  GraduationCap,
  Scale,
  Stethoscope,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { RevealItem, RevealList } from "@/components/motion/reveal";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** Icons follow the order of `home.audience.sectors` in the dictionaries. */
const sectorIcons: LucideIcon[] = [
  Store,
  Stethoscope,
  Scale,
  UtensilsCrossed,
  Factory,
  GraduationCap,
];

export function AudienceSection({ locale }: { locale: Locale }) {
  const { audience } = getDictionary(locale).home;
  return (
    <Section tone="white" labelledBy="para-quien-titulo">
      <SectionHeader id="para-quien-titulo" title={audience.title} intro={audience.intro} />
      <RevealList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {audience.sectors.map(({ name, example }, index) => {
          const Icon = sectorIcons[index];
          return (
            <RevealItem key={name} className="flex gap-4 rounded-tile bg-fog-white p-6 md:p-7">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-pure-white text-obsidian">
                <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-semibold">{name}</p>
                <p className="mt-1 text-footnote text-pewter">{example}</p>
              </div>
            </RevealItem>
          );
        })}
      </RevealList>
      <p className="mx-auto mt-10 max-w-2xl text-center text-body text-pewter">
        {audience.closing}
      </p>
    </Section>
  );
}
