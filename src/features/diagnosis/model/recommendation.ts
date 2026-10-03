import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import type {
  DiagnosisAssessment,
  NeedCategory,
  PlanRecommendation,
  ServiceRecommendation,
} from "@/features/diagnosis/model/types";
import type { PlanId, ServiceCategoryId } from "@/types/catalog";

/* Recommendation rules from SPEC-004. Order of the tables below is significant. */

export const STRONG_NEED = 60;
const LOW_NEED = 40;
const MIN_SERVICE_NEED = 30;
const MAX_SERVICES = 4;
const MIN_SERVICES = 2;

/** Fixed tie-break order: web > automation > ai > seo. */
const CATEGORY_ORDER: NeedCategory[] = ["web", "automation", "ai", "seo"];

export const NEED_TO_SERVICE_CATEGORY: Record<NeedCategory, ServiceCategoryId> = {
  web: "desarrollo-web",
  automation: "automatizaciones",
  ai: "chatbots-ia",
  seo: "seo-geo",
};

const GOAL_CATEGORY: Partial<Record<DiagnosisAnswers["mainGoal"], NeedCategory>> = {
  presence: "web",
  leads: "web",
  sales: "web",
  efficiency: "automation",
  ai: "ai",
};

const PLAN_COVERAGE: Record<PlanId, NeedCategory[]> = {
  "starter-local": ["web", "seo"],
  "web-pro": ["web", "seo"],
  "ia-starter": ["ai"],
  "automation-pack": ["automation"],
  "growth-web-ia": ["web", "automation", "ai", "seo"],
  "custom-enterprise": ["web", "automation", "ai", "seo"],
};

const AREA_PHRASE: Record<NeedCategory, string> = {
  web: "tu web",
  automation: "la automatización de procesos",
  ai: "la inteligencia artificial",
  seo: "la visibilidad en buscadores",
};

const RULE_REASONS = {
  large:
    "Por el tamaño de tu empresa, lo más eficaz es un proyecto a medida que empiece analizando procesos y sistemas.",
  mediumComplex:
    "Tienes varias áreas con mucho potencial y un equipo grande: conviene planificarlas juntas en un proyecto a medida.",
  growth:
    "Hay varias áreas con mucho margen a la vez: un plan conjunto evita soluciones sueltas que no se hablan entre sí.",
  webStarter:
    "Para un negocio de tu tamaño, una web profesional con SEO local es la base con mejor retorno.",
  webPro:
    "Tu mayor oportunidad está en la web: necesitas una más completa, preparada para captar clientes.",
  seoStarter:
    "Para que te encuentren, primero necesitas una web profesional con el SEO local bien hecho.",
  seoPro:
    "Tu mayor oportunidad está en la visibilidad: Web Pro incluye SEO técnico y preparación para respuestas de IA.",
  automation:
    "Tu mayor oportunidad está en automatizar procesos: es donde más tiempo puedes recuperar.",
  ai: "Tu mayor oportunidad está en la inteligencia artificial, aplicada a tareas concretas de tu día a día.",
} as const;

/** Used only when no signal reason applies (typically very mature businesses). */
const FALLBACK_REASONS: Record<NeedCategory, string> = {
  web: "Una web bien mantenida y medida sigue generando resultados con el tiempo.",
  automation: "Revisar tus procesos con regularidad evita que vuelvan a aparecer tareas manuales.",
  ai: "Empezar por un caso acotado permite medir el valor de la IA antes de ampliarla.",
  seo: "Cuidar la base técnica y los contenidos mantiene tu visibilidad frente a la competencia.",
};

interface SignalRule {
  category: NeedCategory;
  applies: (answers: DiagnosisAnswers) => boolean;
  reason: string;
}

const SIGNAL_REASONS: SignalRule[] = [
  {
    category: "web",
    applies: (a) => a.websiteStatus === "none",
    reason: "Todavía no tienes web, y es lo primero que consultan tus clientes antes de contactar.",
  },
  {
    category: "web",
    applies: (a) => a.websiteStatus === "outdated",
    reason: "Tu web actual está anticuada y no refleja cómo trabaja hoy tu negocio.",
  },
  {
    category: "web",
    applies: (a) => a.websiteStatus !== "none" && a.webLeads === "none",
    reason: "Tu web casi no genera contactos: falta orientarla a convertir visitas en clientes.",
  },
  {
    category: "web",
    applies: (a) => a.sellsOnline === "planned",
    reason: "Quieres empezar a vender online y necesitas una tienda preparada para ello.",
  },
  {
    category: "automation",
    applies: (a) => a.repetitiveWorkload === "high",
    reason: "Tu equipo dedica muchas horas a tareas repetitivas que se pueden automatizar.",
  },
  {
    category: "automation",
    applies: (a) => a.automationLevel === "none",
    reason: "Casi todo se hace a mano: conectar tus herramientas reduce errores y tiempo.",
  },
  {
    category: "ai",
    applies: (a) => a.chatbotInterest === "yes",
    reason: "Te interesa un asistente que atienda consultas, un punto de partida claro para la IA.",
  },
  {
    category: "ai",
    applies: (a) => a.aiAdoption === "interested",
    reason: "Quieres empezar con la IA y necesitas un primer caso de uso claro y medible.",
  },
  {
    category: "ai",
    applies: (a) => a.aiAdoption === "exploring",
    reason: "Ya usáis IA de forma puntual: el siguiente paso es integrarla en procesos concretos.",
  },
  {
    category: "ai",
    applies: (a) => a.aiAdoption === "using",
    reason:
      "Ya usáis IA en algunos procesos: el siguiente paso es aplicarla con orden a nuevas tareas.",
  },
  {
    category: "seo",
    applies: (a) => a.seoStatus === "none" && a.visibilityGoal !== "not-now",
    reason: "No trabajas el SEO y quieres ganar visibilidad en buscadores y asistentes de IA.",
  },
];

/** Stable sort by need, highest first. Equal needs keep the original (spec) order. */
function byNeedDesc<T extends { category: NeedCategory }>(
  items: T[],
  needs: Record<NeedCategory, number>,
): T[] {
  return [...items].sort((a, b) => needs[b.category] - needs[a.category]);
}

export function getPrimaryCategory(
  answers: DiagnosisAnswers,
  needs: Record<NeedCategory, number>,
): NeedCategory {
  const goalCategory = GOAL_CATEGORY[answers.mainGoal];
  const tieRank = (category: NeedCategory) =>
    category === goalCategory ? -1 : CATEGORY_ORDER.indexOf(category);

  return [...CATEGORY_ORDER].sort((a, b) => needs[b] - needs[a] || tieRank(a) - tieRank(b))[0];
}

function isSmallBusiness(answers: DiagnosisAnswers): boolean {
  return answers.companySize === "solo" || answers.companySize === "micro";
}

function hasWeakWebsite(answers: DiagnosisAnswers): boolean {
  return answers.websiteStatus === "none" || answers.websiteStatus === "outdated";
}

function planForPrimaryCategory(
  primary: NeedCategory,
  answers: DiagnosisAnswers,
): { planId: PlanId; reason: string } {
  switch (primary) {
    case "web":
      return isSmallBusiness(answers) &&
        hasWeakWebsite(answers) &&
        answers.sellsOnline === "no" &&
        answers.mainGoal !== "sales"
        ? { planId: "starter-local", reason: RULE_REASONS.webStarter }
        : { planId: "web-pro", reason: RULE_REASONS.webPro };
    case "seo":
      return isSmallBusiness(answers) && hasWeakWebsite(answers)
        ? { planId: "starter-local", reason: RULE_REASONS.seoStarter }
        : { planId: "web-pro", reason: RULE_REASONS.seoPro };
    case "automation":
      return { planId: "automation-pack", reason: RULE_REASONS.automation };
    case "ai":
      return { planId: "ia-starter", reason: RULE_REASONS.ai };
  }
}

export function recommendPlan(
  answers: DiagnosisAnswers,
  assessment: DiagnosisAssessment,
): PlanRecommendation {
  const { needs } = assessment;
  const strongNeeds = CATEGORY_ORDER.filter((category) => needs[category] >= STRONG_NEED);

  let planId: PlanId;
  let ruleReason: string;

  if (answers.companySize === "large") {
    planId = "custom-enterprise";
    ruleReason = RULE_REASONS.large;
  } else if (answers.companySize === "medium" && strongNeeds.length >= 3) {
    planId = "custom-enterprise";
    ruleReason = RULE_REASONS.mediumComplex;
  } else if (
    strongNeeds.length >= 3 ||
    (answers.mainGoal === "growth" && strongNeeds.length >= 2)
  ) {
    planId = "growth-web-ia";
    ruleReason = RULE_REASONS.growth;
  } else {
    const primary = getPrimaryCategory(answers, needs);
    const plan = planForPrimaryCategory(primary, answers);
    planId = plan.planId;
    ruleReason =
      needs[primary] < LOW_NEED
        ? `Tu base digital es sólida: el mayor margen de mejora está en ${AREA_PHRASE[primary]}.`
        : plan.reason;
  }

  const coverage = PLAN_COVERAGE[planId];
  const signalReasons = byNeedDesc(
    SIGNAL_REASONS.filter((rule) => coverage.includes(rule.category) && rule.applies(answers)),
    needs,
  )
    .slice(0, 2)
    .map((rule) => rule.reason);

  const reasons = [ruleReason, ...signalReasons];
  if (reasons.length < 2) {
    reasons.push(FALLBACK_REASONS[getPrimaryCategory(answers, needs)]);
  }
  return { planId, reasons };
}

interface ServiceRule {
  serviceId: string;
  category: NeedCategory;
  applies: (answers: DiagnosisAnswers) => boolean;
  reason: string;
}

const SERVICE_RULES: ServiceRule[] = [
  {
    serviceId: "web-corporativa",
    category: "web",
    applies: (a) => a.websiteStatus === "none",
    reason: "Una web profesional que explique con claridad qué haces y cómo contactarte.",
  },
  {
    serviceId: "rediseno-web",
    category: "web",
    applies: (a) => a.websiteStatus === "outdated",
    reason: "Renovar tu web para que transmita confianza y funcione bien en el móvil.",
  },
  {
    serviceId: "landing-pages",
    category: "web",
    applies: (a) =>
      (a.websiteStatus === "basic" || a.websiteStatus === "modern") && a.webLeads !== "regular",
    reason: "Páginas enfocadas en tus servicios clave para convertir visitas en contactos.",
  },
  {
    serviceId: "ecommerce",
    category: "web",
    applies: (a) =>
      a.sellsOnline === "planned" || (a.mainGoal === "sales" && a.sellsOnline !== "yes"),
    reason: "Una tienda online fácil de gestionar para empezar a vender por internet.",
  },
  {
    serviceId: "optimizacion-rendimiento",
    category: "web",
    applies: (a) => a.sellsOnline === "yes" && a.websiteStatus !== "modern",
    reason: "Una tienda más rápida reduce abandonos y mejora la conversión.",
  },
  {
    serviceId: "chatbots",
    category: "ai",
    applies: (a) => a.chatbotInterest === "yes" || a.chatbotInterest === "maybe",
    reason: "Un chatbot que responda las preguntas frecuentes de tus clientes a cualquier hora.",
  },
  {
    serviceId: "asistentes-internos",
    category: "ai",
    applies: (a) => a.aiAdoption !== "none" && a.companySize !== "solo",
    reason: "Un asistente interno para que tu equipo encuentre información al instante.",
  },
  {
    serviceId: "reduccion-tareas",
    category: "automation",
    applies: (a) => a.repetitiveWorkload === "high" || a.repetitiveWorkload === "medium",
    reason: "Automatizar las tareas que hoy se repiten a mano cada semana.",
  },
  {
    serviceId: "clasificacion-leads",
    category: "automation",
    applies: (a) =>
      (a.webLeads === "regular" || a.webLeads === "occasional") && a.automationLevel !== "advanced",
    reason: "Clasificar y responder automáticamente los contactos que llegan por la web.",
  },
  {
    serviceId: "integraciones-crm",
    category: "automation",
    applies: (a) =>
      a.automationLevel === "none" &&
      (a.companySize === "small" || a.companySize === "medium" || a.companySize === "large"),
    reason: "Conectar tus herramientas con un CRM para no perder ninguna oportunidad.",
  },
  {
    serviceId: "seo-tecnico",
    category: "seo",
    applies: (a) => a.seoStatus !== "active" && a.visibilityGoal !== "not-now",
    reason: "Resolver la base técnica para que los buscadores entiendan tu web.",
  },
  {
    serviceId: "geo",
    category: "seo",
    applies: (a) => a.visibilityGoal === "priority" || a.visibilityGoal === "interested",
    reason: "Preparar tu contenido para aparecer en respuestas de asistentes de IA.",
  },
];

const FLAGSHIP_SERVICES: Record<NeedCategory, { serviceId: string; reason: string }> = {
  web: {
    serviceId: "optimizacion-rendimiento",
    reason: "Revisar la velocidad y la conversión de tu web para sacarle más partido.",
  },
  automation: {
    serviceId: "reduccion-tareas",
    reason: "Detectar las tareas que todavía se hacen a mano y automatizarlas.",
  },
  ai: {
    serviceId: "chatbots",
    reason: "Un chatbot que responda las preguntas frecuentes de tus clientes a cualquier hora.",
  },
  seo: {
    serviceId: "seo-tecnico",
    reason: "Revisar la base técnica para que los buscadores entiendan mejor tu web.",
  },
};

export function getRecommendedServices(
  answers: DiagnosisAnswers,
  assessment: DiagnosisAssessment,
): ServiceRecommendation[] {
  const { needs } = assessment;
  const candidates = SERVICE_RULES.filter(
    (rule) => rule.applies(answers) && needs[rule.category] >= MIN_SERVICE_NEED,
  );

  const selected = byNeedDesc(candidates, needs)
    .slice(0, MAX_SERVICES)
    .map((rule) => ({ serviceId: rule.serviceId, category: rule.category, reason: rule.reason }));

  // Very mature businesses may match few rules: fall back to the flagship of their top categories.
  for (const category of byNeedDesc(
    CATEGORY_ORDER.map((c) => ({ category: c })),
    needs,
  )) {
    if (selected.length >= MIN_SERVICES) break;
    const flagship = FLAGSHIP_SERVICES[category.category];
    if (!selected.some((service) => service.serviceId === flagship.serviceId)) {
      selected.push({ ...flagship, category: category.category });
    }
  }

  return selected.map(({ serviceId, category, reason }) => ({
    serviceId,
    categoryId: NEED_TO_SERVICE_CATEGORY[category],
    reason,
  }));
}

const FIRST_STEP =
  "Déjanos tus datos y revisaremos el diagnóstico contigo en una llamada de 30 minutos, sin compromiso.";
const LAST_STEP =
  "Después te enviaremos una propuesta con alcance, plazos y presupuesto detallado.";

const PREPARATION_STEP: Record<PlanId, string> = {
  "starter-local":
    "Reúne lo que ya tengas: logotipo, textos, fotos y webs que te gusten como referencia.",
  "web-pro":
    "Reúne lo que ya tengas: logotipo, textos, fotos y webs que te gusten como referencia.",
  "ia-starter":
    "Anota las preguntas que más se repiten de tus clientes o de tu equipo: serán la base del asistente.",
  "automation-pack":
    "Haz una lista de las tres tareas repetitivas que más tiempo os quitan cada semana.",
  "growth-web-ia":
    "Decide qué resultado quieres medir primero: contactos, ventas u horas ahorradas.",
  "custom-enterprise":
    "Identifica a las personas clave y los sistemas implicados (ERP, CRM, herramientas internas).",
};

export function buildNextSteps(planId: PlanId): string[] {
  return [FIRST_STEP, PREPARATION_STEP[planId], LAST_STEP];
}
