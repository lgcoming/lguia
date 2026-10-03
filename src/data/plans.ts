import type { Faq, Plan } from "@/types/catalog";

/** Prices are indicative placeholders pending business validation (see MEMORY.md). */
export const plans: Plan[] = [
  {
    id: "starter-local",
    name: "Starter Local",
    tagline: "Para pequeños negocios que necesitan una presencia digital profesional.",
    idealFor: "Autónomos, comercios y negocios locales",
    pricing: { kind: "from", amount: 690, currency: "EUR" },
    timeline: "2–3 semanas",
    features: [
      "Web profesional de hasta 5 secciones",
      "Diseño adaptado al móvil y optimizado para cargar rápido",
      "SEO local: perfil de empresa en Google y datos de contacto estructurados",
      "Formulario de contacto y enlace directo a WhatsApp",
      "Analítica básica respetuosa con la privacidad",
      "Preparación de textos legales y aviso de cookies",
    ],
    categories: ["desarrollo-web", "seo-geo"],
    featured: true,
  },
  {
    id: "web-pro",
    name: "Web Pro",
    tagline: "Para empresas que necesitan una web corporativa más avanzada.",
    idealFor: "Pymes y empresas de servicios",
    pricing: { kind: "from", amount: 1900, currency: "EUR" },
    timeline: "4–6 semanas",
    features: [
      "Diseño a medida de hasta 12 páginas",
      "Estructura de contenidos y SEO técnico desde el inicio",
      "Datos estructurados y preparación para respuestas de IA (GEO)",
      "Formularios conectados con tu email o tu CRM",
      "Analítica con objetivos de conversión",
      "3 meses de mantenimiento incluidos",
    ],
    categories: ["desarrollo-web", "seo-geo", "automatizaciones"],
    featured: true,
  },
  {
    id: "ia-starter",
    name: "IA Starter",
    tagline:
      "Para empresas que quieren poner en marcha un proyecto de IA concreto, como un chatbot o un asistente interno.",
    idealFor: "Empresas que reciben muchas consultas repetidas",
    pricing: { kind: "from", amount: 1200, currency: "EUR" },
    timeline: "3–4 semanas",
    features: [
      "Sesión para identificar el caso de uso con más retorno",
      "Chatbot o asistente entrenado con la información de tu negocio",
      "Base de conocimiento con tus preguntas frecuentes y documentos",
      "Derivación a una persona cuando hace falta",
      "Revisión de resultados y ajustes durante el primer mes",
      "Formación para tu equipo",
    ],
    categories: ["chatbots-ia"],
    featured: false,
  },
  {
    id: "automation-pack",
    name: "Automation Pack",
    tagline: "Para empresas con procesos repetitivos que quieren recuperar horas.",
    idealFor: "Equipos que pierden horas en tareas manuales",
    pricing: { kind: "from", amount: 950, currency: "EUR" },
    timeline: "2–4 semanas",
    features: [
      "Análisis de tus procesos actuales",
      "Hasta 3 automatizaciones: formularios, emails y avisos internos",
      "Clasificación automática de contactos y oportunidades",
      "Integración con tus herramientas: CRM, hojas de cálculo, email",
      "Documentación y formación del equipo",
    ],
    categories: ["automatizaciones"],
    featured: false,
  },
  {
    id: "growth-web-ia",
    name: "Growth Web + IA",
    tagline: "Para empresas que quieren web, SEO/GEO, IA y automatización trabajando juntas.",
    idealFor: "Empresas que quieren crecer en digital",
    pricing: { kind: "from", amount: 3900, currency: "EUR" },
    timeline: "8–10 semanas",
    features: [
      "Todo lo incluido en Web Pro",
      "Estrategia SEO + GEO con contenidos durante 3 meses",
      "Asistente con IA integrado en tu web",
      "2 automatizaciones conectadas a tu CRM",
      "Revisión mensual de resultados y mejoras",
    ],
    categories: ["desarrollo-web", "seo-geo", "chatbots-ia", "automatizaciones"],
    featured: true,
    highlight: "Más completo",
  },
  {
    id: "custom-enterprise",
    name: "Custom Enterprise",
    tagline: "Para proyectos complejos que necesitan una solución a medida.",
    idealFor: "Medianas y grandes empresas",
    pricing: { kind: "custom", label: "A medida" },
    timeline: "Según alcance",
    features: [
      "Fase de descubrimiento con tu equipo",
      "Arquitectura e integraciones con tus sistemas (ERP, CRM, API)",
      "Agentes de IA y automatizaciones avanzadas",
      "Equipo dedicado y planificación por fases",
      "Soporte con acuerdos de nivel de servicio",
    ],
    categories: ["desarrollo-web", "seo-geo", "chatbots-ia", "automatizaciones"],
    featured: false,
  },
];

export const planFaqs: Faq[] = [
  {
    question: "¿Los precios son definitivos?",
    answer:
      "Son precios orientativos de partida, sin IVA. Tras el diagnóstico y una llamada te enviamos un presupuesto cerrado con el alcance exacto.",
  },
  {
    question: "¿Cómo se paga un proyecto?",
    answer:
      "Normalmente en dos o tres hitos: al empezar, a mitad del proyecto y en la entrega. Lo dejamos claro en la propuesta.",
  },
  {
    question: "¿Hay permanencia?",
    answer:
      "No. Los proyectos tienen un alcance cerrado. El mantenimiento y la mejora continua son opcionales y se pueden cancelar cuando quieras.",
  },
  {
    question: "¿Puedo empezar con un plan y ampliarlo después?",
    answer:
      "Sí. Muchos clientes empiezan con la web o una primera automatización y suman IA o SEO cuando ven resultados.",
  },
];
