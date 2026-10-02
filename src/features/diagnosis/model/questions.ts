import {
  DIAGNOSIS_OPTIONS,
  type DiagnosisAnswers,
  type DiagnosisQuestionId,
} from "@/features/diagnosis/model/options";

export interface DiagnosisOption<V extends string = string> {
  value: V;
  label: string;
}

export interface DiagnosisQuestion<K extends DiagnosisQuestionId = DiagnosisQuestionId> {
  id: K;
  label: string;
  options: DiagnosisOption<DiagnosisAnswers[K]>[];
}

export type DiagnosisStepId = "web" | "processes" | "ai" | "visibility" | "company";

export interface DiagnosisStep {
  id: DiagnosisStepId;
  title: string;
  description: string;
  questions: DiagnosisQuestion[];
}

/** `labels` is a full Record, so adding an option value without a label fails to compile. */
function question<K extends DiagnosisQuestionId>(
  id: K,
  label: string,
  labels: Record<DiagnosisAnswers[K], string>,
): DiagnosisQuestion<K> {
  const values = DIAGNOSIS_OPTIONS[id] as readonly string[] as readonly DiagnosisAnswers[K][];
  return { id, label, options: values.map((value) => ({ value, label: labels[value] })) };
}

export const DIAGNOSIS_STEPS: DiagnosisStep[] = [
  {
    id: "web",
    title: "Tu presencia online",
    description: "Cómo te encuentran y te contactan hoy tus clientes.",
    questions: [
      question("websiteStatus", "¿Cómo es hoy la web de tu negocio?", {
        none: "No tenemos web",
        outdated: "Tenemos web, pero está anticuada o casi no se actualiza",
        basic: "Funciona, aunque se ha quedado corta",
        modern: "Es moderna y la mantenemos al día",
      }),
      question("sellsOnline", "¿Vendes tus productos o servicios por internet?", {
        yes: "Sí, ya vendemos online",
        planned: "Todavía no, pero queremos hacerlo",
        no: "No, no lo necesitamos",
      }),
      question("webLeads", "¿Te llegan clientes potenciales a través de la web?", {
        regular: "Sí, con regularidad",
        occasional: "De vez en cuando",
        none: "Casi nunca o nunca",
      }),
    ],
  },
  {
    id: "processes",
    title: "Procesos y automatización",
    description: "Cuánto trabajo manual hay en el día a día de tu equipo.",
    questions: [
      question(
        "automationLevel",
        "¿Usáis herramientas que automaticen tareas, como formularios conectados, emails automáticos o un CRM?",
        {
          none: "No, casi todo se hace a mano",
          basic: "Alguna herramienta suelta",
          advanced: "Sí, tenemos procesos conectados",
        },
      ),
      question(
        "repetitiveWorkload",
        "¿Cuánto tiempo dedica tu equipo a tareas repetitivas, como copiar datos, responder lo mismo o preparar presupuestos?",
        {
          high: "Mucho: varias horas a la semana",
          medium: "Algo, aunque es llevadero",
          low: "Poco",
        },
      ),
    ],
  },
  {
    id: "ai",
    title: "Inteligencia artificial",
    description: "Qué papel tiene o podría tener la IA en tu negocio.",
    questions: [
      question("aiAdoption", "¿En qué punto estáis con la inteligencia artificial?", {
        none: "No es una prioridad ahora",
        interested: "Nos interesa, pero no sabemos por dónde empezar",
        exploring: "La usamos de forma puntual (ChatGPT, Copilot…)",
        using: "Ya está integrada en algunos procesos",
      }),
      question(
        "chatbotInterest",
        "¿Te interesaría un chatbot o asistente con IA que atienda consultas de clientes o del equipo?",
        {
          yes: "Sí, nos ahorraría mucho tiempo",
          maybe: "Quizá, quiero saber más",
          no: "No por ahora",
        },
      ),
    ],
  },
  {
    id: "visibility",
    title: "Visibilidad en buscadores",
    description: "Cómo de fácil es encontrarte en Google y en asistentes de IA.",
    questions: [
      question("seoStatus", "¿Trabajáis el posicionamiento en buscadores (SEO)?", {
        none: "No, nunca",
        occasional: "Algo, pero sin una estrategia clara",
        active: "Sí, de forma continua",
      }),
      question(
        "visibilityGoal",
        "¿Quieres aparecer mejor en Google y en las respuestas de asistentes de IA?",
        {
          priority: "Sí, es una prioridad",
          interested: "Me interesa, pero no es urgente",
          "not-now": "No es importante ahora",
        },
      ),
    ],
  },
  {
    id: "company",
    title: "Tu empresa",
    description: "Para ajustar la recomendación a tu tamaño y a tus objetivos.",
    questions: [
      question("companySize", "¿Cuántas personas trabajan en tu empresa?", {
        solo: "Solo yo",
        micro: "De 2 a 9",
        small: "De 10 a 49",
        medium: "De 50 a 249",
        large: "250 o más",
      }),
      question("mainGoal", "¿Qué quieres conseguir en los próximos meses?", {
        presence: "Una imagen digital profesional",
        leads: "Más contactos y clientes",
        sales: "Vender más por internet",
        efficiency: "Ahorrar tiempo automatizando tareas",
        ai: "Empezar a usar IA con sentido",
        growth: "Digitalizar el negocio a fondo para crecer",
      }),
    ],
  },
];

export const DIAGNOSIS_QUESTION_COUNT = DIAGNOSIS_STEPS.reduce(
  (total, step) => total + step.questions.length,
  0,
);
