import type { DiagnosisContent } from "@/features/diagnosis/content/types";

const WEB_REFERENCES =
  "Reúne lo que ya tengas: logotipo, textos, fotos y webs que te gusten como referencia.";

export const diagnosisContentEs: DiagnosisContent = {
  steps: {
    web: {
      title: "Tu presencia online",
      description: "Cómo te encuentran y te contactan hoy tus clientes.",
    },
    processes: {
      title: "Procesos y automatización",
      description: "Cuánto trabajo manual hay en el día a día de tu equipo.",
    },
    ai: {
      title: "Inteligencia artificial",
      description: "Qué papel tiene o podría tener la IA en tu negocio.",
    },
    visibility: {
      title: "Visibilidad en buscadores",
      description: "Cómo de fácil es encontrarte en Google y en asistentes de IA.",
    },
    company: {
      title: "Tu empresa",
      description: "Para ajustar la recomendación a tu tamaño y a tus objetivos.",
    },
  },
  questions: {
    websiteStatus: {
      label: "¿Cómo es hoy la web de tu negocio?",
      options: {
        none: "No tenemos web",
        outdated: "Tenemos web, pero está anticuada o casi no se actualiza",
        basic: "Funciona, aunque se ha quedado corta",
        modern: "Es moderna y la mantenemos al día",
      },
    },
    sellsOnline: {
      label: "¿Vendes tus productos o servicios por internet?",
      options: {
        yes: "Sí, ya vendemos online",
        planned: "Todavía no, pero queremos hacerlo",
        no: "No, no lo necesitamos",
      },
    },
    webLeads: {
      label: "¿Te llegan clientes potenciales a través de la web?",
      options: {
        regular: "Sí, con regularidad",
        occasional: "De vez en cuando",
        none: "Casi nunca o nunca",
      },
    },
    automationLevel: {
      label:
        "¿Usáis herramientas que automaticen tareas, como formularios conectados, emails automáticos o un CRM?",
      options: {
        none: "No, casi todo se hace a mano",
        basic: "Alguna herramienta suelta",
        advanced: "Sí, tenemos procesos conectados",
      },
    },
    repetitiveWorkload: {
      label:
        "¿Cuánto tiempo dedica tu equipo a tareas repetitivas, como copiar datos, responder lo mismo o preparar presupuestos?",
      options: {
        high: "Mucho: varias horas a la semana",
        medium: "Algo, aunque es llevadero",
        low: "Poco",
      },
    },
    aiAdoption: {
      label: "¿En qué punto estáis con la inteligencia artificial?",
      options: {
        none: "No es una prioridad ahora",
        interested: "Nos interesa, pero no sabemos por dónde empezar",
        exploring: "La usamos de forma puntual (ChatGPT, Copilot…)",
        using: "Ya está integrada en algunos procesos",
      },
    },
    chatbotInterest: {
      label:
        "¿Te interesaría un chatbot o asistente con IA que atienda consultas de clientes o del equipo?",
      options: {
        yes: "Sí, nos ahorraría mucho tiempo",
        maybe: "Quizá, quiero saber más",
        no: "No por ahora",
      },
    },
    seoStatus: {
      label: "¿Trabajáis el posicionamiento en buscadores (SEO)?",
      options: {
        none: "No, nunca",
        occasional: "Algo, pero sin una estrategia clara",
        active: "Sí, de forma continua",
      },
    },
    visibilityGoal: {
      label: "¿Quieres aparecer mejor en Google y en las respuestas de asistentes de IA?",
      options: {
        priority: "Sí, es una prioridad",
        interested: "Me interesa, pero no es urgente",
        "not-now": "No es importante ahora",
      },
    },
    companySize: {
      label: "¿Cuántas personas trabajan en tu empresa?",
      options: {
        solo: "Solo yo",
        micro: "De 2 a 9",
        small: "De 10 a 49",
        medium: "De 50 a 249",
        large: "250 o más",
      },
    },
    mainGoal: {
      label: "¿Qué quieres conseguir en los próximos meses?",
      options: {
        presence: "Una imagen digital profesional",
        leads: "Más contactos y clientes",
        sales: "Vender más por internet",
        efficiency: "Ahorrar tiempo automatizando tareas",
        ai: "Empezar a usar IA con sentido",
        growth: "Digitalizar el negocio a fondo para crecer",
      },
    },
  },
  requiredMessage: "Selecciona una opción para continuar.",
  engine: {
    areas: {
      web: "Presencia web",
      automation: "Automatización",
      ai: "Inteligencia artificial",
      visibility: "Visibilidad en buscadores",
    },
    levels: {
      initial: {
        label: "Inicial",
        summary:
          "Tu negocio tiene mucho margen de mejora digital. Con pocos cambios bien elegidos se nota la diferencia.",
      },
      developing: {
        label: "En desarrollo",
        summary:
          "Tienes una base digital, pero hay áreas concretas donde estás dejando pasar oportunidades.",
      },
      advanced: {
        label: "Avanzado",
        summary:
          "Tu negocio está bien digitalizado. El siguiente paso es optimizar y sacar más partido a lo que ya tienes.",
      },
    },
    ruleReasons: {
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
    },
    solidBaseReason: "Tu base digital es sólida: el mayor margen de mejora está en {area}.",
    areaPhrases: {
      web: "tu web",
      automation: "la automatización de procesos",
      ai: "la inteligencia artificial",
      seo: "la visibilidad en buscadores",
    },
    signalReasons: {
      noWebsite:
        "Todavía no tienes web, y es lo primero que consultan tus clientes antes de contactar.",
      outdatedWebsite: "Tu web actual está anticuada y no refleja cómo trabaja hoy tu negocio.",
      noWebLeads:
        "Tu web casi no genera contactos: falta orientarla a convertir visitas en clientes.",
      plansToSell: "Quieres empezar a vender online y necesitas una tienda preparada para ello.",
      highRepetitive:
        "Tu equipo dedica muchas horas a tareas repetitivas que se pueden automatizar.",
      noAutomation: "Casi todo se hace a mano: conectar tus herramientas reduce errores y tiempo.",
      wantsChatbot:
        "Te interesa un asistente que atienda consultas, un punto de partida claro para la IA.",
      aiInterested: "Quieres empezar con la IA y necesitas un primer caso de uso claro y medible.",
      aiExploring:
        "Ya usáis IA de forma puntual: el siguiente paso es integrarla en procesos concretos.",
      aiUsing:
        "Ya usáis IA en algunos procesos: el siguiente paso es aplicarla con orden a nuevas tareas.",
      noSeo: "No trabajas el SEO y quieres ganar visibilidad en buscadores y asistentes de IA.",
    },
    fallbackReasons: {
      web: "Una web bien mantenida y medida sigue generando resultados con el tiempo.",
      automation:
        "Revisar tus procesos con regularidad evita que vuelvan a aparecer tareas manuales.",
      ai: "Empezar por un caso acotado permite medir el valor de la IA antes de ampliarla.",
      seo: "Cuidar la base técnica y los contenidos mantiene tu visibilidad frente a la competencia.",
    },
    serviceReasons: {
      "web-corporativa":
        "Una web profesional que explique con claridad qué haces y cómo contactarte.",
      "rediseno-web": "Renovar tu web para que transmita confianza y funcione bien en el móvil.",
      "landing-pages":
        "Páginas enfocadas en tus servicios clave para convertir visitas en contactos.",
      ecommerce: "Una tienda online fácil de gestionar para empezar a vender por internet.",
      "optimizacion-rendimiento": "Una tienda más rápida reduce abandonos y mejora la conversión.",
      chatbots:
        "Un chatbot que responda las preguntas frecuentes de tus clientes a cualquier hora.",
      "asistentes-internos":
        "Un asistente interno para que tu equipo encuentre información al instante.",
      "reduccion-tareas": "Automatizar las tareas que hoy se repiten a mano cada semana.",
      "clasificacion-leads":
        "Clasificar y responder automáticamente los contactos que llegan por la web.",
      "integraciones-crm":
        "Conectar tus herramientas con un CRM para no perder ninguna oportunidad.",
      "seo-tecnico": "Resolver la base técnica para que los buscadores entiendan tu web.",
      geo: "Preparar tu contenido para aparecer en respuestas de asistentes de IA.",
    },
    flagshipReasons: {
      web: "Revisar la velocidad y la conversión de tu web para sacarle más partido.",
      automation: "Detectar las tareas que todavía se hacen a mano y automatizarlas.",
      ai: "Un chatbot que responda las preguntas frecuentes de tus clientes a cualquier hora.",
      seo: "Revisar la base técnica para que los buscadores entiendan mejor tu web.",
    },
    nextSteps: {
      first:
        "Déjanos tus datos y revisaremos el diagnóstico contigo en una llamada de 30 minutos, sin compromiso.",
      last: "Después te enviaremos una propuesta con alcance, plazos y presupuesto detallado.",
      preparation: {
        "starter-local": WEB_REFERENCES,
        "web-pro": WEB_REFERENCES,
        "ia-starter":
          "Anota las preguntas que más se repiten de tus clientes o de tu equipo: serán la base del asistente.",
        "automation-pack":
          "Haz una lista de las tres tareas repetitivas que más tiempo os quitan cada semana.",
        "growth-web-ia":
          "Decide qué resultado quieres medir primero: contactos, ventas u horas ahorradas.",
        "custom-enterprise":
          "Identifica a las personas clave y los sistemas implicados (ERP, CRM, herramientas internas).",
      },
    },
  },
  ui: {
    intro: {
      title: "Descubre qué mejorar primero en tu negocio",
      text: "Responde {count} preguntas sobre tu web, tus procesos, la inteligencia artificial y tu visibilidad en buscadores. Al terminar verás:",
      outcomes: [
        "Tu nivel de madurez digital, de 0 a 100, por áreas",
        "El plan que mejor encaja con tu negocio y por qué",
        "Los servicios y los próximos pasos que te recomendamos",
      ],
      facts: { steps: "5 pasos cortos", time: "Unos 3 minutos", signup: "Sin registro" },
      factLabels: { steps: "Pasos", time: "Duración", signup: "Registro" },
      privacy:
        "Tus respuestas solo se usan para calcular el resultado y no se guardan. Si quieres que te contactemos, te pediremos tus datos al final.",
      start: "Empezar diagnóstico",
    },
    progress: "Paso {current} de {total}",
    stepPrefix: "Paso {current} de {total}:",
    previous: "Anterior",
    next: "Siguiente",
    finish: "Ver mi diagnóstico",
    calculating: {
      title: "Analizando tus respuestas…",
      text: "Calculamos tu puntuación y el plan que mejor encaja con tu negocio.",
    },
    error: {
      title: "No hemos podido calcular tu diagnóstico",
      answersKept: "Tus respuestas siguen guardadas.",
      retry: "Reintentar",
      review: "Revisar respuestas",
      offline: "Parece que no hay conexión a internet.",
      invalid: "Alguna respuesta no es válida.",
      server: "Ha habido un problema en nuestro servidor.",
    },
    result: {
      title: "Tu diagnóstico digital",
      subtitle: "Basado en tus respuestas de hoy.",
      scoreHeading: "Tu puntuación: {score} de 100, nivel {level}",
      outOf: "de 100",
      maturity: "Nivel de madurez digital",
      planEyebrow: "Plan recomendado",
      vatExcluded: "sin IVA",
      why: "Por qué te lo recomendamos",
      planLink: "Ver qué incluye {plan}",
      services: "Servicios recomendados",
      moreAbout: "Más sobre {category}",
      nextSteps: "Próximos pasos",
      change: "Cambiar mis respuestas",
    },
    leadForm: {
      title: "¿Revisamos este diagnóstico contigo?",
      text: "Déjanos tus datos y te enviaremos una propuesta para el plan {plan}, sin compromiso.",
      messageLabel: "¿Algo más que debamos saber?",
      consent:
        "He leído la información sobre protección de datos y acepto que lguia use mis datos y mi diagnóstico para preparar una propuesta.",
      submit: "Quiero mi propuesta",
      successTitle: "Gracias, {name}. Hemos recibido tu diagnóstico.",
      successText:
        "Te escribiremos a {email} en un máximo de 2 días laborables para concertar una llamada de 30 minutos.",
    },
  },
};
