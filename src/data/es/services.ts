import type { ServiceCategory } from "@/types/catalog";

/*
 * Service catalog in Spanish (es). Copy is written around buying-intent searches (SPEC-009):
 * the head term opens the title and the H1, `answer` is a quotable definition with price and
 * timeline, and `problems` name the business pain before the solution. Prices mentioned here
 * must match src/data/es/plans.ts (a unit test checks it).
 */
export const serviceCategories: ServiceCategory[] = [
  {
    id: "desarrollo-web",
    name: "Desarrollo web a medida",
    icon: "web",
    seoTitle: "Desarrollo web a medida para empresas",
    seoDescription:
      "Desarrollo web a medida para empresas: webs corporativas, landing pages y tiendas online rápidas y pensadas para captar clientes. Presupuesto cerrado desde 690 €.",
    headline: "Desarrollo web a medida que convierte visitas en clientes",
    summary:
      "Webs corporativas, landing pages y tiendas online a medida: rápidas, claras y preparadas para captar clientes.",
    description:
      "Diseñamos y programamos tu web desde cero, sin plantillas recargadas: carga rápido, se entiende a la primera y lleva cada visita hacia el contacto o la compra. Con presupuesto cerrado y con el código, el dominio y las cuentas a tu nombre.",
    answer:
      "lguia desarrolla webs a medida para empresas: webs corporativas, landing pages y tiendas online programadas sin plantillas, optimizadas para velocidad (Core Web Vitals), SEO técnico y conversión. Un proyecto parte de 690 € para una web de hasta cinco secciones y de 1.900 € para una web corporativa completa, se entrega en 2 a 6 semanas y se cierra con un presupuesto fijo antes de empezar.",
    problems: [
      {
        pain: "Tu web recibe visitas, pero casi nadie contacta",
        solution:
          "Reordenamos mensajes, páginas y llamadas a la acción en torno a lo que busca tu cliente, y medimos cada formulario para saber qué funciona.",
      },
      {
        pain: "Tarda en cargar y pierdes clientes en el móvil",
        solution:
          "Código a medida, imágenes y fuentes optimizadas y sin scripts innecesarios, para aprobar las Core Web Vitals también en móvil.",
      },
      {
        pain: "Dependes de una plantilla o de un proveedor que te bloquea",
        solution:
          "Te entregamos el código, el dominio y las cuentas a tu nombre, con documentación para que cualquier equipo pueda continuar el trabajo.",
      },
    ],
    outcomes: [
      "Más contactos y ventas con páginas diseñadas para convertir",
      "Una web rápida en el móvil, que es donde te buscan tus clientes",
      "Una imagen profesional que genera confianza desde la primera visita",
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
        name: "Desarrollo de funcionalidades",
        description: "Reservas, áreas privadas, integraciones y otras funcionalidades a medida.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto cuesta una página web a medida?",
        answer:
          "Depende del alcance. Una web profesional de hasta cinco secciones parte de 690 € y una web corporativa a medida de hasta doce páginas, de 1.900 €, sin IVA. Tras el diagnóstico te enviamos un presupuesto cerrado con el alcance exacto.",
      },
      {
        question: "¿Cuánto tarda en estar lista una web?",
        answer:
          "Una web sencilla suele estar lista en 2 o 3 semanas y una corporativa completa en 4 a 6. Antes de empezar te damos un calendario con fechas concretas.",
      },
      {
        question: "¿Qué diferencia hay entre una web a medida y una plantilla?",
        answer:
          "Una plantilla adapta tu contenido a un diseño genérico y suele cargar código que no necesitas. Una web a medida se diseña y programa para tus clientes y tus objetivos: carga más rápido, se posiciona mejor y puede crecer con tu negocio.",
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
    name: "Automatización de procesos",
    icon: "automation",
    seoTitle: "Automatización de procesos con IA para empresas",
    seoDescription:
      "Automatización de procesos con IA para empresas: conectamos formularios, email y CRM para eliminar el trabajo manual y responder antes. Desde 950 €, en 2 a 4 semanas.",
    headline: "Automatización de procesos con IA que elimina el trabajo manual",
    summary:
      "Conectamos formularios, email y CRM y añadimos IA donde ahorra tiempo, para que los datos fluyan solos y tu equipo deje de copiar y pegar.",
    description:
      "Analizamos cómo trabaja tu equipo y automatizamos lo que se repite cada día: registrar solicitudes, pasar datos entre herramientas, clasificar contactos o avisar a la persona adecuada. Menos errores, respuestas más rápidas y horas recuperadas cada semana.",
    answer:
      "lguia automatiza procesos de negocio para empresas: conecta formularios, email, hojas de cálculo y CRM, y usa inteligencia artificial para clasificar y responder solicitudes. Un proyecto tipo incluye el análisis de los procesos y hasta tres automatizaciones documentadas, parte de 950 € y se pone en marcha en 2 a 4 semanas, con avisos de error y una alternativa manual en cada flujo.",
    problems: [
      {
        pain: "Tu equipo pierde horas copiando datos de una herramienta a otra",
        solution:
          "Conectamos tus herramientas para que cada dato se registre una sola vez y llegue solo a donde hace falta.",
      },
      {
        pain: "Las solicitudes se responden tarde o se pierden",
        solution:
          "Cada contacto se clasifica, se asigna y recibe una primera respuesta automática; la persona responsable recibe un aviso al momento.",
      },
      {
        pain: "Los procesos dependen de una sola persona",
        solution:
          "Documentamos cada flujo y formamos al equipo, con alertas de error y un plan manual si algo falla.",
      },
    ],
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
        name: "Clasificación de leads con IA",
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
        question: "¿Cuánto cuesta automatizar procesos en una empresa?",
        answer:
          "Un primer proyecto con el análisis de tus procesos y hasta tres automatizaciones parte de 950 €, sin IVA. El precio final depende del número de herramientas a conectar y lo cerramos antes de empezar.",
      },
      {
        question: "¿Qué procesos se pueden automatizar con IA?",
        answer:
          "Los que siguen siempre los mismos pasos: registrar solicitudes, enviar confirmaciones, actualizar datos, generar avisos o preparar informes. La IA añade lo que antes exigía leer y decidir: clasificar mensajes, extraer datos de documentos o redactar un borrador de respuesta.",
      },
      {
        question: "¿Tengo que cambiar las herramientas que ya uso?",
        answer:
          "Normalmente no. Trabajamos con lo que ya tienes (email, hojas de cálculo, CRM) y solo proponemos cambios cuando aportan una mejora clara.",
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
    name: "Agentes de IA y chatbots",
    icon: "ai",
    seoTitle: "Agentes de IA y chatbots para empresas",
    seoDescription:
      "Agentes de IA y chatbots para empresas, entrenados con tu información y con supervisión humana: atención al cliente, asistentes internos y tareas. Desde 1.200 €.",
    headline: "Agentes de IA y chatbots entrenados con los datos de tu empresa",
    summary:
      "Chatbots, asistentes internos y agentes de IA que responden con la información de tu empresa y pasan la conversación a una persona cuando hace falta.",
    description:
      "Aplicamos la IA donde aporta un valor medible: atender consultas frecuentes a cualquier hora, ayudar a tu equipo a encontrar información o completar tareas sencillas. Empezamos por un caso de uso acotado, medimos el resultado y solo después ampliamos.",
    answer:
      "lguia desarrolla agentes de IA y chatbots para empresas: asistentes de atención al cliente, buscadores internos sobre la documentación de la empresa y agentes que completan tareas como registrar una solicitud. Se entrenan con información verificada del negocio, respetan el RGPD y derivan la conversación a una persona cuando hace falta. Un primer proyecto parte de 1.200 € y se pone en marcha en 3 a 4 semanas.",
    problems: [
      {
        pain: "Respondes las mismas preguntas todos los días",
        solution:
          "Un asistente entrenado con tus preguntas frecuentes y tus documentos responde al momento y deja a tu equipo los casos que requieren criterio.",
      },
      {
        pain: "Tu equipo tarda en encontrar la información interna",
        solution:
          "Un buscador con IA sobre procedimientos, catálogos y documentación que responde citando la fuente.",
      },
      {
        pain: "Quieres usar IA, pero no sabes por dónde empezar ni qué riesgos tiene",
        solution:
          "Elegimos contigo un primer caso con retorno claro, limitamos la IA a información verificada y definimos cuándo interviene una persona.",
      },
    ],
    outcomes: [
      "Consultas frecuentes atendidas también fuera de horario",
      "Tu equipo encuentra la información interna en segundos",
      "Respuestas coherentes basadas en tus propios documentos",
      "Siempre con la opción de pasar la conversación a una persona",
    ],
    services: [
      {
        id: "chatbots",
        name: "Chatbots de atención al cliente",
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
        name: "Respuestas asistidas",
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
        question: "¿Qué es un agente de IA y en qué se diferencia de un chatbot?",
        answer:
          "Un chatbot responde preguntas. Un agente de IA, además, ejecuta acciones: consulta un sistema, registra una solicitud o actualiza un dato siguiendo reglas que definimos contigo. Los dos se entrenan con la información de tu empresa.",
      },
      {
        question: "¿Cuánto cuesta un agente de IA o un chatbot para mi empresa?",
        answer:
          "Un primer proyecto, con la identificación del caso de uso, un chatbot o asistente entrenado con tu información y un mes de ajustes, parte de 1.200 €, sin IVA. Los agentes conectados con varios sistemas se presupuestan a medida.",
      },
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
    seoTitle: "SEO y GEO: posicionamiento en Google y en IA",
    seoDescription:
      "SEO técnico y GEO para empresas: una web que Google rastrea sin errores y que ChatGPT, Perplexity y Gemini pueden entender y citar. Trabajo medible, sin promesas vacías.",
    headline: "SEO y GEO para que te encuentren en Google y en los asistentes de IA",
    summary:
      "SEO técnico, contenidos bien estructurados y datos estructurados para aparecer en Google y en las respuestas de ChatGPT, Perplexity o Gemini.",
    description:
      "Tus clientes buscan en Google y preguntan a asistentes como ChatGPT, Perplexity o Gemini. Trabajamos la base técnica, la estructura de tus contenidos y los datos estructurados para que tu empresa se entienda bien en ambos. Sin promesas de primeras posiciones: con trabajo medible y continuo.",
    answer:
      "lguia ofrece SEO y GEO (Generative Engine Optimization) para empresas: SEO técnico, arquitectura de contenidos, datos estructurados schema.org y contenido claro y verificable para que los buscadores y los asistentes de IA como ChatGPT, Perplexity y Gemini entiendan el negocio y puedan citarlo. Está incluido en los proyectos web a partir de 690 € y se trabaja de forma continua con seguimiento mensual. Nadie puede garantizar posiciones ni citas, y lguia no lo promete.",
    problems: [
      {
        pain: "No apareces cuando buscan lo que ofreces",
        solution:
          "Resolvemos la base técnica y organizamos tus páginas según las búsquedas reales de tus clientes.",
      },
      {
        pain: "Los asistentes de IA no mencionan tu empresa",
        solution:
          "Publicamos información clara, estructurada y verificable sobre quién eres, qué ofreces y a qué precio, que es lo que esos sistemas pueden entender y citar.",
      },
      {
        pain: "Inviertes en SEO y no sabes qué estás consiguiendo",
        solution:
          "Acordamos qué medir desde el principio y revisamos cada mes la visibilidad y los contactos que genera.",
      },
    ],
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
        name: "Arquitectura de contenidos",
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
        name: "Optimización on-page",
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
          "GEO (Generative Engine Optimization) consiste en preparar tu contenido para que los asistentes de IA lo entiendan y puedan citarlo: información clara, estructurada y verificable sobre tu empresa, tus servicios y tus precios.",
      },
      {
        question: "¿En qué se diferencian el SEO y el GEO?",
        answer:
          "El SEO busca que tus páginas aparezcan en los resultados de un buscador. El GEO busca que un asistente de IA entienda tu negocio y lo mencione al responder. Comparten la base: una web rápida, bien estructurada y con información fiable.",
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
