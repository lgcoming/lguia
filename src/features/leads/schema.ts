import { z } from "zod";

import { diagnosisAnswersSchema } from "@/features/diagnosis/model/validation";
import { SERVICE_CATEGORY_IDS } from "@/types/catalog";

/** Lead validation shared by forms and the API (SPEC-005). Messages are user-facing (es-ES). */

export const LEAD_INTERESTS = [...SERVICE_CATEGORY_IDS, "general"] as const;
export type LeadInterest = (typeof LEAD_INTERESTS)[number];

export const LEAD_MESSAGES = {
  name: "Escribe tu nombre (mínimo 2 caracteres).",
  nameTooLong: "El nombre es demasiado largo (máximo 80 caracteres).",
  email: "Introduce un email válido, por ejemplo nombre@empresa.com.",
  company: "El nombre de la empresa es demasiado largo (máximo 120 caracteres).",
  phone: "Introduce un teléfono válido (mínimo 9 dígitos).",
  interest: "Selecciona en qué podemos ayudarte.",
  message: "Cuéntanos un poco más (mínimo 10 caracteres).",
  messageTooLong: "El mensaje es demasiado largo (máximo 2000 caracteres).",
  consent: "Necesitamos tu consentimiento para poder responderte.",
} as const;

const PHONE_PATTERN = /^\+?[\d\s\-()]+$/;

function emptyToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

function countDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

export const emailSchema = z
  .string({ error: LEAD_MESSAGES.email })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: LEAD_MESSAGES.email }).max(254, LEAD_MESSAGES.email));

const contactFields = {
  name: z
    .string({ error: LEAD_MESSAGES.name })
    .trim()
    .min(2, LEAD_MESSAGES.name)
    .max(80, LEAD_MESSAGES.nameTooLong),
  email: emailSchema,
  company: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(120, LEAD_MESSAGES.company).optional(),
  ),
  phone: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .regex(PHONE_PATTERN, LEAD_MESSAGES.phone)
      .refine((value) => {
        const digits = countDigits(value);
        return digits >= 9 && digits <= 15;
      }, LEAD_MESSAGES.phone)
      .optional(),
  ),
  consent: z.literal(true, { error: LEAD_MESSAGES.consent }),
  // Honeypot: real users never see or fill it (SPEC-005).
  website: z.string().max(500).optional(),
};

export const contactLeadSchema = z.object({
  source: z.literal("contact"),
  ...contactFields,
  interest: z.enum(LEAD_INTERESTS, { error: LEAD_MESSAGES.interest }),
  message: z
    .string({ error: LEAD_MESSAGES.message })
    .trim()
    .min(10, LEAD_MESSAGES.message)
    .max(2000, LEAD_MESSAGES.messageTooLong),
});

export const diagnosisLeadSchema = z.object({
  source: z.literal("diagnosis"),
  ...contactFields,
  message: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(2000, LEAD_MESSAGES.messageTooLong).optional(),
  ),
  // Only the answers are accepted: the server recomputes the diagnosis itself.
  answers: diagnosisAnswersSchema,
});

export const leadInputSchema = z.discriminatedUnion(
  "source",
  [contactLeadSchema, diagnosisLeadSchema],
  { error: "Origen del contacto no válido." },
);

export type ContactLeadInput = z.output<typeof contactLeadSchema>;
export type DiagnosisLeadInput = z.output<typeof diagnosisLeadSchema>;
export type LeadInput = z.output<typeof leadInputSchema>;
