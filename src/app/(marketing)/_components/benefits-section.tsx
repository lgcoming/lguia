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
import { cn } from "@/lib/utils";

interface Benefit {
  icon: LucideIcon;
  title: string;
  text: string;
  /** Bento placement on a 2-column (md) / 4-column (lg) grid. Literal classes for Tailwind. */
  span: string;
}

/*
 * lg (4 columns): the lead tile is 2×2, then 2 + 1 + 1, then 2 + 2 — twelve cells, no gaps.
 * md (2 columns): lead and last tiles are full width, the rest pair up.
 */
const benefits: Benefit[] = [
  {
    icon: Target,
    title: "Primero el problema",
    text: "Entendemos qué necesita tu negocio antes de proponer ninguna herramienta. La tecnología llega después, y solo la que haga falta.",
    span: "md:col-span-2 lg:row-span-2",
  },
  {
    icon: MessagesSquare,
    title: "Sin tecnicismos",
    text: "Te explicamos cada decisión con palabras claras y te formamos para que seas autónomo.",
    span: "lg:col-span-2",
  },
  {
    icon: ListChecks,
    title: "Resultados medibles",
    text: "Acordamos desde el inicio qué vamos a medir: contactos, ventas u horas ahorradas.",
    span: "",
  },
  {
    icon: KeyRound,
    title: "Todo a tu nombre",
    text: "Tu web, tus datos y tus cuentas son tuyos. Sin dependencias forzadas.",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "IA responsable",
    text: "Solo donde aporta valor, con supervisión humana y respetando el RGPD.",
    span: "lg:col-span-2",
  },
  {
    icon: Gauge,
    title: "Rápido y accesible",
    text: "Webs que cargan rápido y funcionan para todo el mundo, también para los buscadores.",
    span: "md:col-span-2",
  },
];

export function BenefitsSection() {
  const [lead, ...rest] = benefits;
  const LeadIcon = lead.icon;

  return (
    <Section labelledBy="por-que-titulo">
      <SectionHeader id="por-que-titulo" title="Por qué trabajar con LGuIA" />
      <RevealList className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <RevealItem
          className={cn(
            "surface-dark relative isolate flex min-h-80 flex-col justify-end overflow-hidden rounded-tile bg-obsidian p-8 text-pure-white md:p-10",
            lead.span,
          )}
        >
          <BrandWatermark className="-top-16 -right-16 size-72 opacity-[0.08] md:size-80" />
          <LeadIcon aria-hidden="true" className="size-8 text-sky-signal" strokeWidth={1.5} />
          <h3 className="mt-5 text-heading-sm md:text-heading-lg">{lead.title}</h3>
          <p className="mt-3 max-w-md text-body text-ash-veil">{lead.text}</p>
        </RevealItem>
        {rest.map(({ icon: Icon, title, text, span }) => (
          <RevealItem
            key={title}
            className={cn("flex flex-col rounded-tile bg-pure-white p-7 md:p-8", span)}
          >
            <Icon aria-hidden="true" className="size-7 text-obsidian" strokeWidth={1.5} />
            <h3 className="mt-5 text-subheading font-semibold">{title}</h3>
            <p className="mt-2 text-footnote text-pewter">{text}</p>
          </RevealItem>
        ))}
      </RevealList>
    </Section>
  );
}
