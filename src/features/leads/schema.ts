// zod/mini: same validation engine as "zod", but tree-shakable. The classic namespace import
// pulled every locale and the JSON Schema converter into the client bundle (~90 KB gzip).
import * as z from "zod/mini";

import { createDiagnosisAnswersSchema } from "@/features/diagnosis/model/validation";
import type { LeadValidationMessages } from "@/features/leads/content/types";
import { SERVICE_CATEGORY_IDS } from "@/types/catalog";

/** Lead validation shared by forms and the API (SPEC-005). Messages are user-facing. */

export const LEAD_INTERESTS = [...SERVICE_CATEGORY_IDS, "general"] as const;
export type LeadInterest = (typeof LEAD_INTERESTS)[number];

const PHONE_PATTERN = /^\+?[\d\s\-()]+$/;

function countDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

/**
 * Optional text: blank strings count as "not provided". Non-string values pass through
 * unchanged and are rejected by the string schema that follows.
 */
function optionalText(...checks: Parameters<ReturnType<typeof z.string>["check"]>) {
  return z.pipe(
    z.transform((value: unknown) =>
      typeof value === "string" && value.trim() === "" ? undefined : (value as string | undefined),
    ),
    z.optional(z.string().check(z.trim(), ...checks)),
  );
}

/**
 * Builds the lead schemas with messages in one language. Kept free of translated content so
 * the forms can build them in the browser from the copy they receive as props (SPEC-009).
 */
export function createLeadSchemas(messages: LeadValidationMessages) {
  const emailSchema = z.pipe(
    z.string({ error: messages.email }).check(z.trim(), z.toLowerCase()),
    z.email({ error: messages.email }).check(z.maxLength(254, messages.email)),
  );

  const contactFields = {
    name: z
      .string({ error: messages.name })
      .check(z.trim(), z.minLength(2, messages.name), z.maxLength(80, messages.nameTooLong)),
    email: emailSchema,
    company: optionalText(z.maxLength(120, messages.company)),
    phone: optionalText(
      z.regex(PHONE_PATTERN, messages.phone),
      z.refine((value: string) => {
        const digits = countDigits(value);
        return digits >= 9 && digits <= 15;
      }, messages.phone),
    ),
    consent: z.literal(true, { error: messages.consent }),
    // Honeypot: real users never see or fill it (SPEC-005).
    website: z.optional(z.string().check(z.maxLength(500))),
  };

  const contactLeadSchema = z.object({
    source: z.literal("contact"),
    ...contactFields,
    interest: z.enum(LEAD_INTERESTS, { error: messages.interest }),
    message: z
      .string({ error: messages.message })
      .check(
        z.trim(),
        z.minLength(10, messages.message),
        z.maxLength(2000, messages.messageTooLong),
      ),
  });

  const diagnosisLeadSchema = z.object({
    source: z.literal("diagnosis"),
    ...contactFields,
    message: optionalText(z.maxLength(2000, messages.messageTooLong)),
    // Only the answers are accepted: the server recomputes the diagnosis itself.
    answers: createDiagnosisAnswersSchema(messages.answers),
  });

  const leadInputSchema = z.discriminatedUnion("source", [contactLeadSchema, diagnosisLeadSchema], {
    error: messages.source,
  });

  return { emailSchema, contactLeadSchema, diagnosisLeadSchema, leadInputSchema };
}

export type LeadSchemas = ReturnType<typeof createLeadSchemas>;

export type ContactLeadInput = z.output<LeadSchemas["contactLeadSchema"]>;
export type DiagnosisLeadInput = z.output<LeadSchemas["diagnosisLeadSchema"]>;
export type LeadInput = z.output<LeadSchemas["leadInputSchema"]>;
