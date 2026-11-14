import { HeartHandshake, Layers, ReceiptText, type LucideIcon } from "lucide-react";

import { RevealGroup, RevealText } from "@/components/motion/reveal";
import { Section } from "@/components/ui/layout-primitives";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

/** Icons follow the order of `home.about.facts` in the dictionaries. */
const factIcons: LucideIcon[] = [Layers, ReceiptText, HeartHandshake];

/** Editorial statement: a large centered headline, a definitional subhead and three facts. */
export function AboutSection({ locale }: { locale: Locale }) {
  const { about } = getDictionary(locale).home;
  return (
    <Section tone="white" labelledBy="que-es-titulo">
      <RevealGroup className="mx-auto max-w-text text-center">
        <RevealText>
          <h2
            id="que-es-titulo"
            className="text-[2rem] leading-[1.1] tracking-[-0.015em] md:text-[3rem] md:leading-[1.08] lg:text-display"
          >
            {about.title}
          </h2>
        </RevealText>
        <RevealText className="mx-auto mt-6 max-w-3xl space-y-4 text-body text-pewter md:text-subheading">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </RevealText>
      </RevealGroup>
      <dl className="mt-14 grid gap-4 sm:grid-cols-3 md:mt-20">
        {about.facts.map(({ title, text }, index) => {
          const Icon = factIcons[index];
          return (
            <div key={title} className="rounded-tile bg-fog-white p-7 text-center md:p-8">
              <Icon aria-hidden="true" className="mx-auto size-7 text-obsidian" strokeWidth={1.5} />
              <dt className="mt-4 text-subheading font-semibold">{title}</dt>
              <dd className="mt-2 text-footnote text-pewter">{text}</dd>
            </div>
          );
        })}
      </dl>
    </Section>
  );
}
