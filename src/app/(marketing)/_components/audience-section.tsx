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

const sectors: { icon: LucideIcon; name: string; example: string }[] = [
  {
    icon: Store,
    name: "Comercios y tiendas locales",
    example: "Tienda online, ficha de Google y avisos automáticos de pedidos.",
  },
  {
    icon: Stethoscope,
    name: "Clínicas y centros de salud",
    example: "Citas online, recordatorios y respuestas a las dudas frecuentes.",
  },
  {
    icon: Scale,
    name: "Despachos y asesorías",
    example: "Captación de clientes y documentación ordenada sin perseguir a nadie.",
  },
  {
    icon: UtensilsCrossed,
    name: "Restaurantes y hostelería",
    example: "Reservas, carta siempre actualizada y presencia en buscadores.",
  },
  {
    icon: Factory,
    name: "Industria y empresas B2B",
    example: "Catálogo técnico, solicitudes de presupuesto y CRM conectado.",
  },
  {
    icon: GraduationCap,
    name: "Academias y centros de formación",
    example: "Inscripciones, asistente para dudas y comunicaciones automáticas.",
  },
];

export function AudienceSection() {
  return (
    <Section tone="white" labelledBy="para-quien-titulo">
      <SectionHeader
        id="para-quien-titulo"
        title="Para quién trabajamos"
        intro="Pymes y negocios locales de cualquier sector. Estos son algunos con los que encajamos especialmente bien."
      />
      <RevealList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map(({ icon: Icon, name, example }) => (
          <RevealItem key={name} className="flex gap-4 rounded-tile bg-fog-white p-6 md:p-7">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-pure-white text-obsidian">
              <Icon aria-hidden="true" className="size-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="mt-1 text-footnote text-pewter">{example}</p>
            </div>
          </RevealItem>
        ))}
      </RevealList>
      <p className="mx-auto mt-10 max-w-2xl text-center text-body text-pewter">
        Si tu empresa tiene clientes que te buscan en internet o tareas que se repiten cada semana,
        probablemente podemos ayudarte.
      </p>
    </Section>
  );
}
