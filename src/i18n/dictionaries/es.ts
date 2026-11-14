import type { PlanId, ServiceCategoryId } from "@/types/catalog";

const service = (id: ServiceCategoryId) => id;
const plan = (id: PlanId) => id;

/*
 * Site copy in Spanish (es): the shape of this object is the `Dictionary` type that every other
 * language must satisfy. Titles and headings open with the terms buyers search for (SPEC-009);
 * prices quoted here must match src/data/es/plans.ts (a unit test checks it). The brand is
 * always written "lguia", lowercase.
 */
export const es = {
  meta: {
    homeTitle: "lguia: desarrollo web a medida, automatización e IA para empresas",
    description:
      "Agencia de desarrollo web a medida, automatización de procesos con IA y agentes de IA para empresas. Presupuesto cerrado y diagnóstico digital gratuito en 3 minutos.",
    ogAlt: "lguia: desarrollo web a medida, automatización e IA para empresas",
    ogHeadline: "Webs a medida, automatización e IA que resuelven problemas reales de tu empresa",
    ogTagline: "Agencia de desarrollo web, automatización e IA",
  },
  common: {
    skipLink: "Saltar al contenido",
    logoLabel: "lguia, ir al inicio",
    diagnosisCta: "Haz tu diagnóstico digital",
    diagnosisCtaShort: "Diagnóstico gratuito",
    proposalCta: "Pedir propuesta",
    servicesCta: "Ver servicios",
    learnMore: "Más información",
    breadcrumbs: "Migas de pan",
    home: "Inicio",
    pauseVideo: "Pausar vídeo de fondo",
    playVideo: "Reproducir vídeo de fondo",
  },
  nav: {
    primary: "Principal",
    mobile: "Principal móvil",
    menu: "Menú",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    services: "Servicios",
    pricing: "Planes",
    contact: "Contacto",
    /** Accessible name of the language switcher; `{language}` is the target language. */
    switchLanguage: "Cambiar idioma a {language}",
  },
  footer: {
    statement: "Desarrollo web a medida, automatización e inteligencia artificial para empresas.",
    services: "Servicios",
    company: "lguia",
    talk: "Hablemos",
    pricing: "Planes y precios",
    diagnosis: "Diagnóstico digital",
    contact: "Contacto",
    remote: "Trabajamos en remoto, en español y en inglés.",
    rights: "Todos los derechos reservados.",
    language: "Idioma",
  },
  stickyCta: {
    text: "Gratis y en 3 minutos",
    button: "Hacer el diagnóstico",
  },
  diagnosisCta: {
    title: "¿No sabes por dónde empezar?",
    text: "Responde 11 preguntas sobre tu negocio y descubre qué mejorar primero. Es gratis, se hace en unos 3 minutos y no necesitas registrarte para ver el resultado.",
    outcomesLabel: "Qué obtienes con el diagnóstico",
    outcomes: [
      { title: "Tu nivel de madurez digital", text: "Una puntuación de 0 a 100 por áreas." },
      { title: "El plan que mejor encaja", text: "Con los motivos, explicados sin tecnicismos." },
      { title: "Tus próximos pasos", text: "Qué hacer primero para notar resultados." },
    ],
    preview: {
      label: "Ejemplo de resultado del diagnóstico digital",
      title: "Diagnóstico digital",
      caption: "Ejemplo: clínica dental, 8 personas",
      recommended: "Plan recomendado",
      today: "Hoy",
      /** `{score}`. */
      points: "{score} puntos",
    },
  },
  contactCta: {
    title: "Cuéntanos tu proyecto y recibe una propuesta",
    text: "Escríbenos con lo que tienes en mente y te respondemos en un máximo de 2 días laborables con una primera valoración, sin compromiso.",
  },
  planCard: {
    from: "Desde",
    vatExcluded: "sin IVA",
    timeline: "Plazo orientativo",
    idealFor: "Ideal para",
  },
  home: {
    hero: {
      eyebrow: "Agencia de desarrollo web a medida, automatización e IA",
      title: "Webs a medida, automatización e IA que resuelven problemas reales de tu empresa",
      subtitle:
        "Diseñamos webs que captan clientes, automatizamos procesos con IA y desarrollamos agentes de IA para tu equipo. Con presupuesto cerrado, plazos claros y resultados que se pueden medir.",
      reassurances: [
        "Gratis y sin compromiso",
        "11 preguntas, unos 3 minutos",
        "Resultado al momento",
      ],
      outroTitle: "Tu web, tus procesos y la IA, por fin conectados.",
      outroText: "Diseñamos cada pieza para que trabaje con las demás, sin herramientas sueltas.",
    },
    about: {
      title: "Una agencia de desarrollo web e IA que empieza por tu negocio, no por la tecnología",
      paragraphs: [
        "lguia es una agencia digital que desarrolla webs a medida, automatiza procesos y aplica inteligencia artificial en empresas. Trabajamos en remoto desde España, en español y en inglés, con presupuesto cerrado y con el código, los datos y las cuentas siempre a nombre del cliente.",
        "Las tres áreas las lleva el mismo equipo para que todo encaje: tu web capta contactos, las automatizaciones los ordenan y la IA te ayuda a responder antes.",
      ],
      facts: [
        {
          title: "Un solo equipo",
          text: "Web, automatización e IA coordinadas desde el primer día.",
        },
        {
          title: "Presupuesto cerrado",
          text: "Sabes qué incluye y cuánto cuesta antes de empezar.",
        },
        { title: "Acompañamiento real", text: "Seguimos a tu lado después del lanzamiento." },
      ],
    },
    services: {
      title: "Servicios de desarrollo web, automatización e IA",
      intro:
        "Cuatro áreas que se complementan. Puedes empezar por una y sumar las demás cuando tenga sentido.",
      link: "Ver todos los servicios",
    },
    problems: {
      title: "Problemas de negocio que resolvemos",
      intro: "Si alguna de estas frases te suena, podemos ayudarte.",
      items: [
        {
          pain: "Mi web no me trae clientes",
          solution:
            "Replanteamos la web pensando en conversión: mensajes claros, llamadas a la acción visibles y formularios que funcionan.",
          service: service("desarrollo-web"),
          link: "Ver desarrollo web a medida",
        },
        {
          pain: "No aparezco cuando me buscan",
          solution:
            "Trabajamos el SEO técnico y los contenidos para que te encuentre quien busca lo que ofreces, también en asistentes de IA.",
          service: service("seo-geo"),
          link: "Ver SEO + GEO",
        },
        {
          pain: "Respondo las mismas preguntas todo el día",
          solution:
            "Un agente de IA atiende las consultas frecuentes y te deja las que necesitan tu criterio.",
          service: service("chatbots-ia"),
          link: "Ver agentes de IA y chatbots",
        },
        {
          pain: "Perdemos horas copiando datos",
          solution:
            "Conectamos formularios, email y CRM para que la información fluya sin pasar de mano en mano.",
          service: service("automatizaciones"),
          link: "Ver automatización de procesos",
        },
        {
          pain: "Los contactos se pierden o se responden tarde",
          solution:
            "Cada solicitud se clasifica y se asigna automáticamente, con un aviso a la persona responsable.",
          service: service("automatizaciones"),
          link: "Ver automatización de procesos",
        },
        {
          pain: "Quiero usar IA, pero no sé por dónde empezar",
          solution:
            "Identificamos un primer caso de uso con un retorno claro y lo ponemos en marcha en pocas semanas.",
          service: service("chatbots-ia"),
          link: "Ver agentes de IA y chatbots",
        },
      ],
    },
    plans: {
      title: "Planes y precios para empezar con buen pie",
      intro:
        "Precios orientativos para que sepas desde el principio de qué hablamos. El presupuesto final se cierra tras el diagnóstico.",
      link: "Ver todos los planes",
    },
    audience: {
      title: "Para qué empresas trabajamos",
      intro:
        "Empresas y negocios de cualquier sector. Estos son algunos con los que encajamos especialmente bien.",
      sectors: [
        {
          name: "Comercios y tiendas",
          example: "Tienda online, ficha de Google y avisos automáticos de pedidos.",
        },
        {
          name: "Clínicas y centros de salud",
          example: "Citas online, recordatorios y respuestas a las dudas frecuentes.",
        },
        {
          name: "Despachos y asesorías",
          example: "Captación de clientes y documentación ordenada sin perseguir a nadie.",
        },
        {
          name: "Restaurantes y hostelería",
          example: "Reservas, carta siempre actualizada y presencia en buscadores.",
        },
        {
          name: "Industria y empresas B2B",
          example: "Catálogo técnico, solicitudes de presupuesto y CRM conectado.",
        },
        {
          name: "Academias y centros de formación",
          example: "Inscripciones, asistente para dudas y comunicaciones automáticas.",
        },
      ],
      closing:
        "Si tu empresa tiene clientes que te buscan en internet o tareas que se repiten cada semana, probablemente podemos ayudarte.",
    },
    process: {
      title: "Cómo trabajamos",
      intro:
        "Un proceso claro y por fases, para que sepas en todo momento en qué punto está tu proyecto.",
    },
    benefits: {
      title: "Por qué trabajar con lguia",
      items: [
        {
          title: "Primero el problema",
          text: "Entendemos qué necesita tu negocio antes de proponer ninguna herramienta. La tecnología llega después, y solo la que haga falta.",
        },
        {
          title: "Sin tecnicismos",
          text: "Te explicamos cada decisión con palabras claras y te formamos para que seas autónomo.",
        },
        {
          title: "Resultados medibles",
          text: "Acordamos desde el inicio qué vamos a medir: contactos, ventas u horas ahorradas.",
        },
        {
          title: "Todo a tu nombre",
          text: "Tu web, tus datos y tus cuentas son tuyos. Sin dependencias forzadas.",
        },
        {
          title: "IA responsable",
          text: "Solo donde aporta valor, con supervisión humana y respetando el RGPD.",
        },
        {
          title: "Rápido y accesible",
          text: "Webs que cargan rápido y funcionan para todo el mundo, también para los buscadores.",
        },
      ],
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        {
          question: "¿Qué hace lguia?",
          answer:
            "lguia es una agencia digital que desarrolla webs a medida, automatiza procesos de negocio con IA, crea agentes de IA y chatbots y trabaja el SEO y el GEO de empresas. El mismo equipo lleva las cuatro áreas para que funcionen juntas.",
        },
        {
          question: "¿Cuánto cuesta un proyecto con lguia?",
          answer:
            "Publicamos precios orientativos de partida, sin IVA: una web profesional desde 590 €, un pack de automatizaciones desde 890 €, un primer agente de IA o chatbot desde 750 €, una web corporativa a medida desde 1.950 € y un proyecto conjunto de web, SEO, IA y automatización desde 3.250 €. El presupuesto final es cerrado y se acuerda antes de empezar.",
        },
        {
          question: "¿Cuánto tarda un proyecto?",
          answer:
            "Entre 2 y 10 semanas según el alcance: de 2 a 4 semanas para una web sencilla o un pack de automatizaciones, de 4 a 6 para una web corporativa y de 8 a 10 para un proyecto conjunto.",
        },
        {
          question: "¿Trabajáis con empresas de fuera de España?",
          answer:
            "Sí. Trabajamos en remoto, en español y en inglés, con empresas de cualquier país.",
        },
        {
          question: "¿Qué es el diagnóstico digital gratuito?",
          answer:
            "Un cuestionario de 11 preguntas que se completa en unos 3 minutos y devuelve al momento una puntuación de madurez digital de 0 a 100, el plan que mejor encaja con tu empresa y los próximos pasos. No requiere registro.",
        },
      ],
    },
  },
  servicesPage: {
    metaTitle: "Servicios de desarrollo web, automatización e IA",
    metaDescription:
      "Desarrollo web a medida, automatización de procesos con IA, agentes de IA y SEO + GEO para empresas. Cuatro servicios que funcionan juntos, con presupuesto cerrado.",
    title: "Servicios de desarrollo web a medida, automatización e IA para empresas",
    intro:
      "Una web que capta clientes, automatizaciones que ahorran tiempo, agentes de IA aplicados con criterio y visibilidad en buscadores. Puedes empezar por un servicio y sumar los demás cuando tenga sentido.",
    areasTitle: "Cuatro servicios, un mismo equipo",
    areasIntro:
      "Elige un servicio para ver en detalle qué incluye, cómo trabajamos y cuánto cuesta.",
    /** `{name}`. */
    more: "Más sobre {name}",
  },
  servicePage: {
    services: "Servicios",
    answerTitle: "En pocas palabras",
    facts: {
      from: "Desde",
      timeline: "Plazo",
      quote: "Presupuesto",
      quoteValue: "Cerrado antes de empezar",
      customQuote: "A medida",
    },
    problemsTitle: "Problemas que resuelve",
    includesTitle: "Qué incluye",
    outcomesTitle: "Qué consigue tu empresa",
    processTitle: "Cómo lo hacemos",
    processIntro:
      "El mismo proceso por fases en todos nuestros proyectos, para que siempre sepas qué viene después.",
    plansTitle: "Planes y precios",
    plansIntro: "Precios orientativos sin IVA. El presupuesto final se cierra tras el diagnóstico.",
    faqTitle: "Preguntas frecuentes",
    othersTitle: "Otros servicios",
    midCta: {
      title: "¿Hablamos de tu caso?",
      text: "Cuéntanos qué necesitas y te enviamos una propuesta con alcance, plazos y presupuesto cerrado.",
    },
  },
  pricingPage: {
    metaTitle: "Planes y precios de desarrollo web, automatización e IA",
    metaDescription:
      "Precios de desarrollo web a medida, automatización e IA para empresas: planes desde 590 €, con plazos orientativos y presupuesto cerrado tras un diagnóstico gratuito.",
    title: "Planes y precios para cada etapa de tu empresa",
    intro:
      "Elige un punto de partida. Todos los proyectos empiezan con un diagnóstico y terminan con un presupuesto cerrado, sin sorpresas.",
    heroCta: "Descubre qué plan te encaja",
    allPlans: "Todos los planes",
    note: "Precios orientativos sin IVA. El presupuesto final depende del alcance de cada proyecto y se cierra contigo tras el diagnóstico, antes de empezar.",
    guideTitle: "¿Qué plan encaja contigo?",
    guideIntro:
      "Una guía rápida. Si sigues con dudas, el diagnóstico digital te recomienda un plan con sus motivos en unos 3 minutos.",
    guide: [
      {
        situation:
          "Eres autónomo o tienes un negocio local y todavía no tienes web, o la tuya se ha quedado anticuada.",
        plan: plan("starter-local"),
      },
      {
        situation:
          "Tu empresa necesita una web corporativa completa que capte clientes y posicione.",
        plan: plan("web-pro"),
      },
      {
        situation:
          "Recibes muchas consultas repetidas y quieres probar la IA con un caso concreto.",
        plan: plan("ia-starter"),
      },
      {
        situation: "Tu equipo pierde horas copiando datos y respondiendo siempre lo mismo.",
        plan: plan("automation-pack"),
      },
      {
        situation: "Quieres trabajar web, SEO, IA y automatización a la vez para crecer.",
        plan: plan("growth-web-ia"),
      },
      {
        situation: "Tienes varios departamentos, sistemas propios o necesidades complejas.",
        plan: plan("custom-enterprise"),
      },
    ],
    faqTitle: "Preguntas frecuentes sobre los planes",
  },
  diagnosisPage: {
    metaTitle: "Diagnóstico digital gratuito",
    metaDescription:
      "Diagnóstico digital gratuito para empresas: responde 11 preguntas y descubre en 3 minutos tu nivel de madurez digital, el plan que mejor encaja y los próximos pasos.",
    title: "Diagnóstico digital gratuito",
    intro:
      "En unos 3 minutos sabrás en qué punto está tu negocio, qué plan te encaja mejor y por dónde empezar. Sin registro y sin compromiso.",
    /** `{link}` is replaced by a link to the contact page with `noscriptLink` as its text. */
    noscript:
      "El diagnóstico necesita JavaScript para funcionar. Si lo prefieres, cuéntanos tu caso desde la {link}.",
    noscriptLink: "página de contacto",
    coversTitle: "Qué evalúa el diagnóstico",
    coversIntro:
      "Once preguntas en cinco bloques. Al terminar verás una puntuación de 0 a 100 por áreas, el plan recomendado con sus motivos y los próximos pasos.",
  },
  contactPage: {
    metaTitle: "Contacto: pide una propuesta",
    metaDescription:
      "Cuéntanos tu proyecto de desarrollo web, automatización o inteligencia artificial y recibe una primera valoración en un máximo de 2 días laborables, sin compromiso.",
    title: "Hablemos de tu proyecto",
    intro:
      "Cuéntanos qué necesitas y te responderemos con una primera valoración, sin compromiso. Cuanto más concreto seas, más útil será nuestra respuesta.",
    formTitle: "Escríbenos",
    nextTitle: "Qué pasa después",
    nextSteps: [
      { title: "Leemos tu mensaje", text: "Te respondemos en un máximo de 2 días laborables." },
      {
        title: "Hablamos 30 minutos",
        text: "Una llamada para entender tu negocio y lo que necesitas.",
      },
      {
        title: "Te enviamos una propuesta",
        text: "Con alcance, plazos y presupuesto cerrado. Sin compromiso.",
      },
    ],
    emailTitle: "¿Prefieres el email?",
    unsureTitle: "¿No sabes qué necesitas?",
    unsureText: "El diagnóstico digital te da una recomendación en unos 3 minutos.",
    unsureLink: "Haz el diagnóstico",
  },
  notFound: {
    metaTitle: "Página no encontrada",
    eyebrow: "Error 404",
    title: "No encontramos esta página",
    text: "Puede que la dirección haya cambiado o que el enlace no sea correcto. Estas páginas te pueden ayudar:",
    home: "Ir al inicio",
    services: "Ver servicios",
    diagnosis: "Hacer el diagnóstico",
  },
  legal: {
    footerLabel: "Información legal",
    updatedLabel: "Última actualización",
    updated: "14 de noviembre de 2026",
    pages: {
      legal: {
        navLabel: "Aviso legal",
        metaTitle: "Aviso legal",
        metaDescription:
          "Datos del titular de lguia.com y condiciones de uso del sitio web, conforme a la LSSI-CE.",
        title: "Aviso legal",
        intro:
          "En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), estos son los datos del titular de este sitio web y las condiciones para usarlo.",
        sections: [
          {
            heading: "Titular del sitio web",
            paragraphs: [
              "Titular: {owner}, profesional que presta sus servicios con el nombre comercial {brand}.",
              "Sitio web: lguia.com. Correo electrónico de contacto: {email}.",
              "Actividad: desarrollo web a medida, automatización de procesos e implantación de inteligencia artificial para empresas.",
            ],
          },
          {
            heading: "Condiciones de uso",
            paragraphs: [
              "El acceso a este sitio web es gratuito y no requiere registro. Al usarlo aceptas estas condiciones.",
              "Te comprometes a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o que perjudiquen a terceros o al funcionamiento del sitio.",
            ],
          },
          {
            heading: "Información y precios",
            paragraphs: [
              "Los precios publicados son orientativos, no incluyen IVA y no constituyen una oferta vinculante. Cada proyecto se presupuesta por escrito antes de empezar.",
              "El diagnóstico digital es una orientación automática basada en tus respuestas; no sustituye un análisis profesional de tu caso.",
            ],
          },
          {
            heading: "Propiedad intelectual e industrial",
            paragraphs: [
              "Los textos, el diseño, el código, los logotipos y la marca {brand} pertenecen a su titular. No se permite reproducirlos, distribuirlos ni transformarlos sin autorización expresa.",
              "Las fotografías y los vídeos de terceros se usan conforme a sus licencias.",
            ],
          },
          {
            heading: "Responsabilidad",
            paragraphs: [
              "El titular procura que la información sea correcta y esté actualizada, pero no garantiza la ausencia de errores ni que el sitio esté disponible sin interrupciones.",
              "Los enlaces a sitios de terceros se ofrecen solo como referencia; el titular no responde de su contenido.",
            ],
          },
          {
            heading: "Legislación aplicable",
            paragraphs: [
              "Estas condiciones se rigen por la legislación española. Cualquier controversia se resolverá ante los juzgados y tribunales que correspondan según la normativa vigente, incluida la de protección de las personas consumidoras cuando sea aplicable.",
            ],
          },
        ],
      },
      privacy: {
        navLabel: "Privacidad",
        metaTitle: "Política de privacidad",
        metaDescription:
          "Qué datos personales trata lguia cuando usas sus formularios, para qué, durante cuánto tiempo y cómo ejercer tus derechos.",
        title: "Política de privacidad",
        intro:
          "Esta política explica qué datos personales tratamos cuando usas los formularios de lguia.com, para qué y qué derechos tienes, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).",
        sections: [
          {
            heading: "Responsable del tratamiento",
            paragraphs: [
              "{owner}, que presta sus servicios con el nombre comercial {brand}.",
              "Contacto para cualquier cuestión sobre tus datos: {email}.",
            ],
          },
          {
            heading: "Qué datos tratamos",
            paragraphs: [
              "Los que nos das en los formularios de contacto y de diagnóstico: nombre, correo electrónico y, si los indicas, empresa, teléfono, servicio de interés y mensaje.",
              "En el diagnóstico, además, tus respuestas sobre la situación digital de tu negocio y el resultado calculado.",
              "No pedimos datos especialmente protegidos. El sitio está dirigido a empresas y profesionales, no a menores de 14 años.",
            ],
          },
          {
            heading: "Para qué los usamos",
            paragraphs: [
              "Para responder a tu solicitud y, si lo pides, preparar y enviarte una propuesta o un presupuesto.",
              "No los usamos para enviarte publicidad ni tomamos decisiones automatizadas sobre ti: el resultado del diagnóstico es solo orientativo.",
            ],
          },
          {
            heading: "Base legal",
            paragraphs: [
              "Tu consentimiento, que das al enviar el formulario (artículo 6.1.a del RGPD), y la aplicación de medidas precontractuales a petición tuya (artículo 6.1.b del RGPD). Puedes retirar el consentimiento cuando quieras, sin que afecte a lo tratado antes.",
            ],
          },
          {
            heading: "Cuánto tiempo los conservamos",
            paragraphs: [
              "Mientras gestionamos tu solicitud y, si no llegamos a trabajar juntos, un máximo de 12 meses desde el último contacto. Si contratas un servicio, durante la relación y los plazos que exija la ley, por ejemplo los fiscales.",
            ],
          },
          {
            heading: "Quién más accede a tus datos",
            paragraphs: [
              "No cedemos tus datos a terceros salvo obligación legal.",
              "Nos ayudan proveedores que tratan los datos por nuestra cuenta: Cloudflare, Inc. aloja la web y nos entrega los formularios por correo electrónico, y nuestro proveedor de correo los recibe. Pueden tratar datos fuera del Espacio Económico Europeo con las garantías previstas en el RGPD, como el Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo.",
            ],
          },
          {
            heading: "Tus derechos",
            paragraphs: [
              "Puedes pedir el acceso, la rectificación, la supresión, la oposición, la limitación del tratamiento y la portabilidad de tus datos escribiendo a {email}. Te responderemos en el plazo máximo de un mes.",
              "Si crees que no hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).",
            ],
          },
        ],
      },
      cookies: {
        navLabel: "Cookies",
        metaTitle: "Política de cookies",
        metaDescription:
          "lguia.com no usa cookies de análisis, publicidad ni seguimiento. Qué cookies técnicas puede usar su proveedor de alojamiento.",
        title: "Política de cookies",
        intro: "Esta política explica el uso de cookies y tecnologías similares en lguia.com.",
        sections: [
          {
            heading: "Qué cookies usamos",
            paragraphs: [
              "lguia.com no usa cookies propias de análisis, publicidad ni seguimiento, ni guarda información en tu navegador para identificarte. Por eso no te mostramos un aviso de cookies.",
            ],
          },
          {
            heading: "Cookies técnicas del proveedor",
            paragraphs: [
              "Cloudflare, que aloja y protege la web, puede usar cookies técnicas estrictamente necesarias para detectar tráfico malicioso y mantener el servicio seguro. Están exentas de consentimiento (artículo 22.2 de la LSSI-CE) y no se usan para seguirte.",
            ],
          },
          {
            heading: "Contenido de terceros",
            paragraphs: [
              "La web no incrusta vídeos, mapas, redes sociales ni otros servicios de terceros que instalen cookies. Las fuentes tipográficas y los vídeos se sirven desde nuestro propio dominio.",
            ],
          },
          {
            heading: "Cambios en esta política",
            paragraphs: [
              "Si en el futuro usamos cookies que necesiten tu consentimiento, actualizaremos esta página y te lo pediremos antes de instalarlas. Puedes borrar o bloquear las cookies desde la configuración de tu navegador.",
            ],
          },
        ],
      },
    },
  },
};

export type Dictionary = typeof es;
