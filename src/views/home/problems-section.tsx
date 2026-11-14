import { RevealItem, RevealList } from "@/components/motion/reveal";
import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import { TextLink } from "@/components/ui/text-link";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { serviceHref } from "@/i18n/routes";

/** Pain → solution pairs as fog tiles on white; the pain is quoted in the owner's own words. */
export function ProblemsSection({ locale }: { locale: Locale }) {
  const { problems } = getDictionary(locale).home;
  return (
    <Section tone="white" labelledBy="problemas-titulo">
      <SectionHeader id="problemas-titulo" title={problems.title} intro={problems.intro} />
      <RevealList className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.items.map((problem) => (
          <RevealItem
            key={problem.pain}
            className="tile-hover flex flex-col rounded-tile bg-fog-white p-7 md:p-8"
          >
            <p className="text-subheading font-semibold">«{problem.pain}»</p>
            <p className="mt-3 text-footnote text-pewter">{problem.solution}</p>
            <div className="mt-auto pt-3">
              <TextLink href={serviceHref(locale, problem.service)}>{problem.link}</TextLink>
            </div>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
