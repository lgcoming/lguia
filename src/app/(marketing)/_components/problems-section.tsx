import { Section, SectionHeader } from "@/components/ui/layout-primitives";
import { TextLink } from "@/components/ui/text-link";
import { categoryHref } from "@/features/catalog/routes";
import type { ServiceCategoryId } from "@/types/catalog";

interface Problem {
  pain: string;
  solution: string;
  categoryId: ServiceCategoryId;
  link: string;
}

const problems: Problem[] = [
  {
    pain: "Mi web no me trae clientes",
    solution:
      "Replanteamos la web pensando en conversión: mensajes claros, llamadas a la acción visibles y formularios que funcionan.",
    categoryId: "desarrollo-web",
    link: "Ver desarrollo web",
  },
  {
    pain: "No aparezco cuando me buscan",
    solution:
      "Trabajamos el SEO técnico y local para que te encuentre quien busca lo que ofreces, también en asistentes de IA.",
    categoryId: "seo-geo",
    link: "Ver SEO + GEO",
  },
  {
    pain: "Respondo las mismas preguntas todo el día",
    solution:
      "Un asistente con IA atiende las consultas frecuentes y te deja las que necesitan tu criterio.",
    categoryId: "chatbots-ia",
    link: "Ver IA para empresas",
  },
  {
    pain: "Perdemos horas copiando datos",
    solution:
      "Conectamos formularios, email y CRM para que la información fluya sin pasar de mano en mano.",
    categoryId: "automatizaciones",
    link: "Ver automatizaciones",
  },
  {
    pain: "Los contactos se pierden o se responden tarde",
    solution:
      "Cada solicitud se clasifica y se asigna automáticamente, con un aviso a la persona responsable.",
    categoryId: "automatizaciones",
    link: "Ver automatizaciones",
  },
  {
    pain: "Quiero usar IA, pero no sé por dónde empezar",
    solution:
      "Identificamos un primer caso de uso con un retorno claro y lo ponemos en marcha en pocas semanas.",
    categoryId: "chatbots-ia",
    link: "Ver IA para empresas",
  },
];

/** Pain → solution pairs as fog tiles on white; the pain is quoted in the owner's own words. */
export function ProblemsSection() {
  return (
    <Section tone="white" labelledBy="problemas-titulo">
      <SectionHeader
        id="problemas-titulo"
        title="Problemas que sabemos resolver"
        intro="Si alguna de estas frases te suena, podemos ayudarte."
      />
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem) => (
          <li key={problem.pain} className="flex flex-col rounded-tile bg-fog-white p-7 md:p-8">
            <p className="text-subheading font-semibold">«{problem.pain}»</p>
            <p className="mt-3 text-footnote text-pewter">{problem.solution}</p>
            <div className="mt-auto pt-3">
              <TextLink href={categoryHref(problem.categoryId)}>{problem.link}</TextLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
