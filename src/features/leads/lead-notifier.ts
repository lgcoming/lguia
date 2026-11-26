import type { Lead } from "@/features/leads/types";

/** Tells the team a lead arrived. Swap the transport (email today) without touching callers. */
export interface LeadNotifier {
  notify(lead: Lead, attachments?: LeadAttachment[]): Promise<void>;
}

/** A file sent with the notification, base64-encoded (the prototype logo). */
export interface LeadAttachment {
  filename: string;
  type: string;
  data: string;
}

/** Used where no transport is configured (local development, tests). */
export const noopLeadNotifier: LeadNotifier = {
  async notify() {},
};

export interface LeadEmail {
  subject: string;
  text: string;
}

const SOURCE_LABEL: Record<Lead["source"], string> = {
  contact: "Formulario de contacto",
  diagnosis: "Diagnóstico digital",
  prototype: "Prototipo web gratis",
};

const PROTOTYPE_LABELS = {
  projectType: { new: "Web nueva", redesign: "Rediseño de su web actual" },
  goal: {
    leads: "Conseguir contactos y presupuestos",
    sales: "Vender online",
    bookings: "Recibir reservas o citas",
    brand: "Dar a conocer la marca",
    portfolio: "Mostrar trabajos",
  },
  styles: {
    minimal: "Minimalista",
    corporate: "Corporativo",
    modern: "Moderno y tecnológico",
    warm: "Cercano",
    bold: "Atrevido y con color",
    premium: "Premium",
  },
  palette: {
    brand: "Colores de su logo o marca",
    custom: "Colores elegidos",
    suggest: "Que se los propongamos",
  },
  tone: { light: "Claro", dark: "Oscuro", any: "Sin preferencia" },
  sections: {
    home: "Inicio",
    services: "Servicios",
    about: "Sobre nosotros",
    portfolio: "Trabajos",
    blog: "Blog",
    shop: "Tienda",
    bookings: "Reservas",
    contact: "Contacto",
  },
} as const;

/*
 * Internal message for the lguia team, not visitor-facing copy: always in Spanish, whatever the
 * language of the form ("Idioma" says which language to reply in).
 */
export function formatLeadEmail(lead: Lead): LeadEmail {
  const lines: [string, string | undefined][] = [
    ["Origen", SOURCE_LABEL[lead.source]],
    ["Idioma", lead.locale === "en" ? "inglés (responder en inglés)" : "español"],
    ["Nombre", lead.name],
    ["Email", lead.email],
    ["Empresa", lead.company],
    ["Teléfono", lead.phone],
    ["Interés", lead.interest],
  ];
  if (lead.diagnosis) {
    const { score, level, recommendedPlanId, recommendedServiceIds } = lead.diagnosis;
    lines.push(
      ["Puntuación", `${score}/100 (${level})`],
      ["Plan recomendado", recommendedPlanId],
      ["Servicios recomendados", recommendedServiceIds.join(", ")],
    );
  }
  if (lead.prototype) {
    const brief = lead.prototype;
    lines.push(
      ["Proyecto", PROTOTYPE_LABELS.projectType[brief.projectType]],
      ["Web actual", brief.currentSite],
      ["Negocio", brief.business],
      ["Objetivo", PROTOTYPE_LABELS.goal[brief.goal]],
      ["Estilo", brief.styles.map((style) => PROTOTYPE_LABELS.styles[style]).join(", ")],
      ["Paleta", PROTOTYPE_LABELS.palette[brief.palette]],
      ["Colores", brief.colors.join(", ") || undefined],
      ["Tono", PROTOTYPE_LABELS.tone[brief.tone]],
      [
        "Secciones",
        brief.sections.map((section) => PROTOTYPE_LABELS.sections[section]).join(", ") || undefined,
      ],
      ["Webs de referencia", brief.references],
      ["Logo", brief.logoName ? `${brief.logoName} (adjunto)` : "no enviado"],
    );
  }
  lines.push(["Recibido", lead.createdAt], ["Id", lead.id]);

  const body = lines
    .filter((line): line is [string, string] => Boolean(line[1]))
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return {
    subject: `Nuevo lead: ${lead.name}${lead.company ? ` (${lead.company})` : ""} · ${SOURCE_LABEL[lead.source]}`,
    text: lead.message ? `${body}\n\nMensaje:\n${lead.message}\n` : `${body}\n`,
  };
}
