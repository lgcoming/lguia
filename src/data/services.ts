import type { ServiceCategory } from "@/types/catalog";

export const serviceCategories: ServiceCategory[] = [
  {
    id: "desarrollo-web",
    name: "Desarrollo web",
    icon: "web",
    seoTitle: "Desarrollo web para empresas",
    headline: "Webs rápidas y claras que convierten visitas en clientes",
    summary:
      "Webs corporativas, landing pages y tiendas online rápidas, fáciles de usar y preparadas para captar clientes.",
    description:
      "Diseñamos y desarrollamos webs a medida pensadas para tus clientes: cargan rápido, se entienden a la primera y te ayudan a conseguir contactos o ventas. Sin plantillas recargadas y con tecnología actual que puedes mantener.",
    outcomes: [
      "Una imagen profesional que genera confianza desde la primera visita",
      "Más contactos y ventas gracias a páginas pensadas para convertir",
      "Una web rápida en el móvil, que es donde te buscan tus clientes",
      "Datos claros sobre qué funciona para decidir con criterio",
    ],
    services: [
      {
        id: "web-corporativa",
        name: "Webs corporativas",
        description: "Tu empresa explicada con claridad: servicios, equipo, casos y contacto.",
      },
      {
        id: "landing-pages",
        name: "Landing pages",
        description: "Páginas enfocadas en un servicio o campaña, diseñadas para captar contactos.",
      },
      {
        id: "ecommerce",
        name: "Tiendas online",
        description: "Catálogo, pagos y envíos en una tienda fácil de gestionar.",
      },
      {
        id: "rediseno-web",
        name: "Rediseño web",
        description: "Renovamos tu web sin perder lo que ya funciona ni tu posicionamiento.",
      },
      {
        id: "optimizacion-rendimiento",
        name: "Optimización de velocidad",
        description: "Mejoramos los tiempos de carga y las Core Web Vitals para no perder visitas.",
      },
      {
        id: "mantenimiento-web",
        name: "Mantenimiento",
        description: "Actualizaciones, copias de seguridad y pequeños cambios sin preocupaciones.",
      },
      {
        id: "analitica-web",
        name: "Analítica y medición",
        description:
          "Medimos visitas, contactos y ventas con herramientas respetuosas con la privacidad.",
      },
      {
        id: "preparacion-legal",
        name: "Preparación legal y cookies",
        description: "Estructura de textos legales y aviso de cookies para cubrir lo básico.",
      },
      {
        id: "soluciones-tecnicas",
        name: "Soluciones técnicas",
        description: "Reservas, áreas privadas, integraciones y otras funcionalidades a medida.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto tarda en estar lista una web?",
        answer:
          "Una web sencilla suele estar lista en 2 o 3 semanas y una corporativa completa en 4 a 6. Antes de empezar te damos un calendario con fechas concretas.",
      },
      {
        question: "¿Podré editar los contenidos yo mismo?",
        answer:
          "Sí. Según el proyecto, preparamos un sistema sencillo para que actualices textos, imágenes o productos sin depender de nosotros.",
      },
      {
        question: "¿Qué pasa con mi web actual y su posicionamiento?",
        answer:
          "En un rediseño mantenemos las URL importantes o configuramos redirecciones para conservar el posicionamiento que ya tienes.",
      },
      {
        question: "¿El dominio y el alojamiento están incluidos?",
        answer:
          "Te ayudamos a elegir y configurar el alojamiento adecuado. El dominio, el alojamiento y las cuentas quedan siempre a tu nombre.",
      },
    ],
    relatedPlanIds: ["starter-local", "web-pro", "growth-web-ia"],
  },
  {
    id: "automatizaciones",
    name: "Automatizaciones",
    icon: "automation",
    seoTitle: "Automatización de procesos para empresas",
    headline: "Automatizaciones que eliminan el trabajo repetitivo",
    summary:
      "Conectamos formularios, email y CRM para que los datos fluyan solos y tu equipo deje de copiar y pegar.",
    description:
      "Revisamos cómo trabaja tu equipo y automatizamos las tareas que se repiten cada día: responder solicitudes, pasar datos de una herramienta a otra o avisar a la persona adecuada. Menos errores, respuestas más rápidas y horas recuperadas cada semana.",
    outcomes: [
      "Horas recuperadas cada semana para tareas que aportan valor",
      "Respuestas más rápidas a clientes y oportunidades",
      "Menos errores al pasar datos de una herramienta a otra",
      "Procesos documentados que no dependen de una sola persona",
    ],
    services: [
      {
        id: "automatizacion-formularios",
        name: "Automatización de formularios",
        description:
          "Cada solicitud llega ordenada a donde tiene que llegar, sin intervención manual.",
      },
      {
        id: "email-automatico",
        name: "Email automático",
        description:
          "Confirmaciones, seguimientos y recordatorios que se envían solos en el momento justo.",
      },
      {
        id: "clasificacion-leads",
        name: "Clasificación de leads",
        description: "Los contactos se puntúan y reparten según su interés y su urgencia.",
      },
      {
        id: "integraciones-crm",
        name: "Integraciones con CRM",
        description:
          "Conectamos tu web, tu email y tus herramientas con el CRM que ya usas, o te ayudamos a elegir uno.",
      },
      {
        id: "flujos-internos",
        name: "Flujos de trabajo internos",
        description:
          "Aprobaciones, avisos y tareas entre departamentos sin perseguir a nadie por email.",
      },
      {
        id: "reduccion-tareas",
        name: "Reducción de tareas repetitivas",
        description: "Detectamos lo que se hace a mano una y otra vez y lo automatizamos.",
      },
    ],
    faqs: [
      {
        question: "¿Tengo que cambiar las herramientas que ya uso?",
        answer:
          "Normalmente no. Trabajamos con lo que ya tienes (email, hojas de cálculo, CRM) y solo proponemos cambios cuando aportan una mejora clara.",
      },
      {
        question: "¿Qué tareas se pueden automatizar?",
        answer:
          "Las que siguen siempre los mismos pasos: registrar solicitudes, enviar confirmaciones, actualizar datos, generar avisos o preparar informes.",
      },
      {
        question: "¿Qué pasa si una automatización falla?",
        answer:
          "Cada flujo incluye avisos de error y una alternativa manual. Lo documentamos para que tu equipo sepa qué hacer en cada caso.",
      },
    ],
    relatedPlanIds: ["automation-pack", "growth-web-ia", "custom-enterprise"],
  },
  {
    id: "chatbots-ia",
    name: "IA para empresas",
    icon: "ai",
    seoTitle: "Chatbots e inteligencia artificial para empresas",
    headline: "Inteligencia artificial aplicada a problemas concretos de tu negocio",
    summary:
      "Chatbots, asistentes internos y agentes de IA entrenados con la información de tu empresa y con supervisión humana.",
    description:
      "Usamos la IA donde aporta un valor medible: atender consultas frecuentes a cualquier hora, ayudar a tu equipo a encontrar información o preparar respuestas. Empezamos por un caso de uso acotado, medimos resultados y solo después ampliamos.",
    outcomes: [
      "Consultas frecuentes atendidas también fuera de horario",
      "Tu equipo encuentra la información interna en segundos",
      "Respuestas coherentes basadas en tus propios documentos",
      "Siempre con la opción de pasar la conversación a una persona",
    ],
    services: [
      {
        id: "chatbots",
        name: "Chatbots de atención",
        description:
          "Responden las preguntas frecuentes de tus clientes en la web con información verificada.",
      },
      {
        id: "agentes-ia",
        name: "Agentes de IA",
        description:
          "Asistentes que completan tareas sencillas, como registrar una solicitud o consultar el estado de un pedido.",
      },
      {
        id: "asistentes-internos",
        name: "Asistentes internos",
        description: "Un buscador inteligente sobre tus procedimientos, catálogos y documentación.",
      },
      {
        id: "respuestas-automaticas",
        name: "Respuestas automáticas",
        description:
          "Borradores de respuesta para email o formularios que tu equipo revisa antes de enviar.",
      },
      {
        id: "bases-conocimiento",
        name: "Bases de conocimiento",
        description:
          "Organizamos la información de tu empresa para que la IA responda con precisión.",
      },
      {
        id: "flujos-atencion",
        name: "Flujos de atención al cliente",
        description: "Definimos cuándo responde la IA y cuándo entra una persona del equipo.",
      },
    ],
    faqs: [
      {
        question: "¿La IA puede dar respuestas incorrectas?",
        answer:
          "Puede ocurrir. Por eso limitamos el asistente a tu información verificada, definimos qué temas no debe tratar y añadimos la derivación a una persona.",
      },
      {
        question: "¿Qué pasa con la privacidad de los datos?",
        answer:
          "Elegimos proveedores y configuraciones acordes con el RGPD, evitamos enviar datos personales innecesarios y documentamos qué información se utiliza.",
      },
      {
        question: "¿Necesito muchos datos para empezar?",
        answer:
          "No. Con tus preguntas frecuentes, tu web y algunos documentos clave suele bastar para un primer asistente útil.",
      },
    ],
    relatedPlanIds: ["ia-starter", "growth-web-ia", "custom-enterprise"],
  },
  {
    id: "seo-geo",
    name: "SEO + GEO",
    icon: "search",
    seoTitle: "SEO y GEO para empresas",
    headline: "SEO y GEO para que te encuentren en buscadores y asistentes de IA",
    summary:
      "SEO técnico, contenidos bien estructurados y datos estructurados para aparecer en Google y en respuestas generadas por IA.",
    description:
      "Cada vez más clientes buscan en Google y preguntan a asistentes como ChatGPT o Gemini. Trabajamos la base técnica, la estructura de tus contenidos y los datos estructurados para que tu negocio se entienda bien en ambos. Sin promesas de primeras posiciones: con trabajo medible y continuo.",
    outcomes: [
      "Una web que los buscadores rastrean e interpretan sin problemas",
      "Contenidos organizados en torno a lo que buscan tus clientes",
      "Información de tu negocio clara para los asistentes de IA",
      "Seguimiento mensual de visibilidad y contactos",
    ],
    services: [
      {
        id: "seo-tecnico",
        name: "SEO técnico",
        description: "Velocidad, indexación, arquitectura y errores técnicos resueltos.",
      },
      {
        id: "estructura-contenidos",
        name: "Estructura de contenidos",
        description: "Páginas organizadas según las búsquedas reales de tus clientes.",
      },
      {
        id: "estructura-semantica",
        name: "Estructura semántica",
        description: "HTML y encabezados que explican tu contenido a buscadores y lectores.",
      },
      {
        id: "datos-estructurados",
        name: "Datos estructurados",
        description:
          "Marcado schema.org para que los buscadores entiendan tu empresa y tus servicios.",
      },
      {
        id: "optimizacion-busqueda",
        name: "Optimización para buscadores",
        description: "Mejora continua de títulos, descripciones y enlaces internos.",
      },
      {
        id: "geo",
        name: "Optimización para respuestas de IA (GEO)",
        description:
          "Contenido claro y verificable que los asistentes de IA pueden entender y citar.",
      },
    ],
    faqs: [
      {
        question: "¿Qué es el GEO?",
        answer:
          "GEO (Generative Engine Optimization) consiste en preparar tu contenido para que los asistentes de IA lo entiendan y puedan citarlo: información clara, estructurada y verificable.",
      },
      {
        question: "¿Garantizáis la primera posición en Google?",
        answer:
          "No. Nadie puede garantizarlo de forma honesta, ni en Google ni en los asistentes de IA. Lo que sí garantizamos es un trabajo técnico correcto, medible y transparente.",
      },
      {
        question: "¿Cuándo se notan los resultados?",
        answer:
          "Las mejoras técnicas se notan en semanas. El crecimiento orgánico suele consolidarse entre 3 y 6 meses, según la competencia de tu sector.",
      },
    ],
    relatedPlanIds: ["starter-local", "web-pro", "growth-web-ia"],
  },
];
