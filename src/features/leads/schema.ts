// zod/mini: same validation engine as "zod", but tree-shakable. The classic namespace import
// pulled every locale and the JSON Schema converter into the client bundle (~90 KB gzip).
import * as z from "zod/mini";

import { createDiagnosisAnswersSchema } from "@/features/diagnosis/model/validation";
import type { LeadValidationMessages } from "@/features/leads/content/types";
import {
  isWebsite,
  LOGO_MAX_BASE64_LENGTH,
  LOGO_TYPES,
  normalizeWebsite,
  PROTOTYPE_GOALS,
  PROTOTYPE_MAX_COLORS,
  PROTOTYPE_MAX_STYLES,
  PROTOTYPE_PALETTES,
  PROTOTYPE_PROJECT_TYPES,
  PROTOTYPE_SECTIONS,
  PROTOTYPE_STYLES,
  PROTOTYPE_TONES,
} from "@/features/leads/prototype-options";
import { SERVICE_CATEGORY_IDS } from "@/types/catalog";

/** Lead validation shared by forms and the API (SPEC-005). Messages are user-facing. */

export const LEAD_INTERESTS = [...SERVICE_CATEGORY_IDS, "general"] as const;
export type LeadInterest = (typeof LEAD_INTERESTS)[number];

const PHONE_PATTERN = /^\+?[\d\s\-()]+$/;
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

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

  const prototypeLeadSchema = z
    .object({
      source: z.literal("prototype"),
      ...contactFields,
      projectType: z.enum(PROTOTYPE_PROJECT_TYPES, { error: messages.projectType }),
      currentSite: z.pipe(
        optionalText(
          z.maxLength(300, messages.currentSite),
          z.refine((value: string) => isWebsite(value), messages.currentSite),
        ),
        z.transform((value) => (value === undefined ? undefined : normalizeWebsite(value))),
      ),
      business: z
        .string({ error: messages.business })
        .check(z.trim(), z.minLength(10, messages.business), z.maxLength(600, messages.business)),
      goal: z.enum(PROTOTYPE_GOALS, { error: messages.goal }),
      styles: z
        .array(z.enum(PROTOTYPE_STYLES, { error: messages.styles }), { error: messages.styles })
        .check(
          z.minLength(1, messages.styles),
          z.maxLength(PROTOTYPE_MAX_STYLES, messages.styles),
          z.refine((values) => new Set(values).size === values.length, messages.styles),
        ),
      palette: z.enum(PROTOTYPE_PALETTES, { error: messages.palette }),
      colors: z._default(
        z
          .array(z.string().check(z.regex(HEX_COLOR, messages.colors)), { error: messages.colors })
          .check(z.maxLength(PROTOTYPE_MAX_COLORS, messages.colors)),
        [],
      ),
      tone: z.enum(PROTOTYPE_TONES, { error: messages.tone }),
      sections: z._default(
        z
          .array(z.enum(PROTOTYPE_SECTIONS, { error: messages.source }))
          .check(z.maxLength(PROTOTYPE_SECTIONS.length, messages.source)),
        [],
      ),
      references: optionalText(z.maxLength(1000, messages.messageTooLong)),
      message: optionalText(z.maxLength(2000, messages.messageTooLong)),
      logo: z.optional(
        z.object({
          name: z
            .string({ error: messages.logo })
            .check(z.trim(), z.minLength(1, messages.logo), z.maxLength(120, messages.logo)),
          type: z.enum(LOGO_TYPES, { error: messages.logo }),
          data: z
            .string({ error: messages.logo })
            .check(
              z.minLength(4, messages.logo),
              z.maxLength(LOGO_MAX_BASE64_LENGTH, messages.logoSize),
              z.regex(BASE64, messages.logo),
            ),
        }),
      ),
    })
    .check(
      z.superRefine(
        (value, ctx) => {
          if (value.projectType === "redesign" && !value.currentSite) {
            ctx.issues.push({
              code: "custom",
              input: value.currentSite,
              path: ["currentSite"],
              message: messages.currentSite,
            });
          }
          if (
            value.palette === "custom" &&
            (!Array.isArray(value.colors) || value.colors.length === 0)
          ) {
            ctx.issues.push({
              code: "custom",
              input: value.colors,
              path: ["colors"],
              message: messages.colors,
            });
          }
          // Runs even when other fields are invalid, so every missing answer shows on the first try.
        },
        { when: (payload) => typeof payload.value === "object" && payload.value !== null },
      ),
    );

  const leadInputSchema = z.discriminatedUnion(
    "source",
    [contactLeadSchema, diagnosisLeadSchema, prototypeLeadSchema],
    { error: messages.source },
  );

  return {
    emailSchema,
    contactLeadSchema,
    diagnosisLeadSchema,
    prototypeLeadSchema,
    leadInputSchema,
  };
}

export type LeadSchemas = ReturnType<typeof createLeadSchemas>;

export type ContactLeadInput = z.output<LeadSchemas["contactLeadSchema"]>;
export type DiagnosisLeadInput = z.output<LeadSchemas["diagnosisLeadSchema"]>;
export type PrototypeLeadInput = z.output<LeadSchemas["prototypeLeadSchema"]>;
export type LeadInput = z.output<LeadSchemas["leadInputSchema"]>;
