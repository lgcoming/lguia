import {
  Factory,
  GraduationCap,
  Scale,
  Stethoscope,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

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
    <Section labelledBy="para-quien-titulo">
      <SectionHeader
        id="para-quien-titulo"
        title="Para quién trabajamos"
        intro="Pymes y negocios locales de cualquier sector. Estos son algunos con los que encajamos especialmente bien."
      />
      <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map(({ icon: Icon, name, example }) => (
          <li key={name} className="flex gap-4 border-t border-line py-6">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-pine-50 text-pine-700">
              <Icon aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="font-semibold">{name}</p>
              <p className="mt-1 text-base text-ink-soft">{example}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-8 max-w-2xl text-ink-soft">
        Si tu empresa tiene clientes que te buscan en internet o tareas que se repiten cada semana,
        probablemente podemos ayudarte.
      </p>
    </Section>
  );
}
