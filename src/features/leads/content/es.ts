import type { LeadFormContent } from "@/features/leads/content/types";

export const leadContentEs: LeadFormContent = {
  validation: {
    name: "Escribe tu nombre (mínimo 2 caracteres).",
    nameTooLong: "El nombre es demasiado largo (máximo 80 caracteres).",
    email: "Introduce un email válido, por ejemplo nombre@empresa.com.",
    company: "El nombre de la empresa es demasiado largo (máximo 120 caracteres).",
    phone: "Introduce un teléfono válido (mínimo 9 dígitos).",
    interest: "Selecciona en qué podemos ayudarte.",
    message: "Cuéntanos un poco más (mínimo 10 caracteres).",
    messageTooLong: "El mensaje es demasiado largo (máximo 2000 caracteres).",
    consent: "Necesitamos tu consentimiento para poder responderte.",
    answers: "Selecciona una opción para continuar.",
    source: "Origen del contacto no válido.",
  },
  fields: {
    name: "Nombre",
    email: "Email",
    company: "Empresa",
    phone: "Teléfono",
    optional: "(opcional)",
    interest: "¿En qué podemos ayudarte?",
    message: "Cuéntanos tu proyecto",
    messageHint: "Qué necesitas, en qué plazo y cualquier detalle que nos ayude a entenderlo.",
  },
  interestGeneral: "Todavía no lo sé, quiero orientación",
  consent:
    "He leído la información sobre protección de datos y acepto que lguia use mis datos para responder a mi solicitud.",
  dataProtection: {
    title: "Protección de datos.",
    text: "Responsable: {owner} ({brand}). Finalidad: responder a tu solicitud y, si lo pides, enviarte una propuesta. No cedemos tus datos a terceros. Puedes ejercer tus derechos escribiendo a",
    more: "Más información en la",
    policy: "política de privacidad",
  },
  honeypotLabel: "No rellenes este campo",
  submit: "Enviar mensaje",
  submitting: "Enviando…",
  errors: {
    network:
      "No hemos podido conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.",
    server:
      "No hemos podido enviar tus datos por un problema de nuestro lado. Inténtalo de nuevo en unos minutos.",
  },
  success: {
    title: "Gracias, {name}. Hemos recibido tu mensaje.",
    text: "Te responderemos a {email} en un máximo de 2 días laborables con una primera valoración.",
    next: "Mientras tanto, puedes {link} para adelantar trabajo.",
    nextLink: "hacer el diagnóstico digital",
  },
};
