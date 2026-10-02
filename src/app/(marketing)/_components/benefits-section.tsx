import {
  Gauge,
  KeyRound,
  ListChecks,
  MessagesSquare,
  ShieldCheck,
  Target,
  type LucideIcon,
} from "lucide-react";

import { Section, SectionHeader } from "@/components/ui/layout-primitives";

const benefits: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Target,
    title: "Primero el problema",
    text: "Entendemos qué necesita tu negocio antes de proponer ninguna herramienta.",
  },
  {
    icon: MessagesSquare,
    title: "Sin tecnicismos",
    text: "Te explicamos cada decisión con palabras claras y te formamos para que seas autónomo.",
  },
  {
    icon: ListChecks,
    title: "Resultados medibles",
    text: "Acordamos desde el inicio qué vamos a medir: contactos, ventas u horas ahorradas.",
  },
  {
    icon: KeyRound,
    title: "Todo a tu nombre",
    text: "Tu web, tus datos y tus cuentas son tuyos. Sin dependencias forzadas.",
  },
  {
    icon: ShieldCheck,
    title: "IA responsable",
    text: "Solo donde aporta valor, con supervisión humana y respetando el RGPD.",
  },
  {
    icon: Gauge,
    title: "Rápido y accesible",
    text: "Webs que cargan rápido y funcionan para todo el mundo, también para los buscadores.",
  },
];

export function BenefitsSection() {
  return (
    <Section labelledBy="por-que-titulo">
      <SectionHeader id="por-que-titulo" title="Por qué trabajar con LGuIA" />
      <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Icon aria-hidden="true" className="size-6 text-pine-700" />
            <h3 className="mt-4 text-h4">{title}</h3>
            <p className="mt-2 text-ink-soft">{text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
