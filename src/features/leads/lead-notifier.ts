import type { Lead } from "@/features/leads/types";

/** Tells the team a lead arrived. Swap the transport (email today) without touching callers. */
export interface LeadNotifier {
  notify(lead: Lead): Promise<void>;
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
};

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
