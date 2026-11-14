"use client";

import { CircleCheck } from "lucide-react";
import { useMemo } from "react";

import { CheckboxField, TextAreaField, TextField } from "@/components/ui/form";
import type { DiagnosisUiStrings } from "@/features/diagnosis/content/types";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import {
  DataProtectionNotice,
  FormAlert,
  HoneypotField,
  SubmitButton,
} from "@/features/leads/components/form-parts";
import type { LeadFormContent } from "@/features/leads/content/types";
import { createLeadSchemas } from "@/features/leads/schema";
import { useLeadForm } from "@/features/leads/use-lead-form";
import { format, splitAt, type Locale } from "@/i18n/config";
import { pageHref } from "@/i18n/routes";
import { useFocusOnMount } from "@/lib/use-focus-on-mount";
import { issuesToFieldErrors, toApiIssues } from "@/lib/validation";

interface LeadFormValues extends Record<string, unknown> {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  consent: boolean;
  website: string;
}

const initialValues: LeadFormValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
  consent: false,
  website: "",
};

const fieldOrder = ["name", "email", "company", "phone", "message", "consent"] as const;

type LeadFormStrings = DiagnosisUiStrings["leadForm"];

function LeadSuccess({
  name,
  email,
  strings,
}: {
  name: string;
  email: string;
  strings: LeadFormStrings;
}) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const [before, after] = splitAt(strings.successText, "{email}");
  return (
    <div className="rounded-tile bg-fog-white p-6 md:p-8">
      <CircleCheck aria-hidden="true" className="size-8 text-obsidian" strokeWidth={1.5} />
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-subheading font-semibold outline-none"
      >
        {format(strings.successTitle, { name })}
      </h3>
      <p className="mt-2 text-pewter">
        {before}
        <strong className="text-obsidian">{email}</strong>
        {after}
      </p>
    </div>
  );
}

interface DiagnosisLeadFormProps {
  locale: Locale;
  answers: DiagnosisAnswers;
  planName: string;
  strings: LeadFormStrings;
  /** Shared form copy (field labels, validation, notices). */
  leadContent: LeadFormContent;
}

export function DiagnosisLeadForm({
  locale,
  answers,
  planName,
  strings,
  leadContent,
}: DiagnosisLeadFormProps) {
  const schema = useMemo(
    () => createLeadSchemas(leadContent.validation).diagnosisLeadSchema,
    [leadContent.validation],
  );
  const { values, errors, status, formError, fieldId, setValue, handleSubmit } = useLeadForm({
    initialValues,
    idPrefix: "diagnostico",
    fieldOrder,
    locale,
    errorMessages: leadContent.errors,
    validate: (current: LeadFormValues) => {
      const result = schema.safeParse({ ...current, source: "diagnosis", answers });
      return result.success
        ? { success: true as const, payload: result.data }
        : {
            success: false as const,
            fieldErrors: issuesToFieldErrors(toApiIssues(result.error)),
          };
    },
  });

  if (status === "success") {
    return (
      <LeadSuccess
        name={values.name.trim().split(" ")[0]}
        email={values.email.trim()}
        strings={strings}
      />
    );
  }

  const submitting = status === "submitting";
  const { fields } = leadContent;

  return (
    <section aria-labelledby="lead-titulo" className="rounded-tile bg-fog-white p-6 md:p-8">
      <h3 id="lead-titulo" className="text-heading-sm">
        {strings.title}
      </h3>
      <p className="mt-2 text-pewter">{format(strings.text, { plan: planName })}</p>

      <form
        noValidate
        onSubmit={handleSubmit}
        aria-busy={submitting}
        className="relative mt-6 space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            id={fieldId("name")}
            name="name"
            label={fields.name}
            autoComplete="name"
            required
            value={values.name}
            onChange={(event) => setValue("name", event.target.value)}
            error={errors.name}
          />
          <TextField
            id={fieldId("email")}
            name="email"
            type="email"
            label={fields.email}
            autoComplete="email"
            inputMode="email"
            required
            value={values.email}
            onChange={(event) => setValue("email", event.target.value)}
            error={errors.email}
          />
          <TextField
            id={fieldId("company")}
            name="company"
            label={fields.company}
            optional={fields.optional}
            autoComplete="organization"
            value={values.company}
            onChange={(event) => setValue("company", event.target.value)}
            error={errors.company}
          />
          <TextField
            id={fieldId("phone")}
            name="phone"
            type="tel"
            label={fields.phone}
            optional={fields.optional}
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => setValue("phone", event.target.value)}
            error={errors.phone}
          />
        </div>

        <TextAreaField
          id={fieldId("message")}
          name="message"
          label={strings.messageLabel}
          optional={fields.optional}
          rows={4}
          value={values.message}
          onChange={(event) => setValue("message", event.target.value)}
          error={errors.message}
        />

        <HoneypotField
          id={fieldId("website")}
          label={leadContent.honeypotLabel}
          value={values.website}
          onChange={(value) => setValue("website", value)}
        />

        <CheckboxField
          id={fieldId("consent")}
          name="consent"
          label={strings.consent}
          checked={values.consent}
          onChange={(event) => setValue("consent", event.target.checked)}
          error={errors.consent}
        />

        <DataProtectionNotice
          content={leadContent.dataProtection}
          privacyHref={pageHref(locale, "privacy")}
        />

        {formError ? <FormAlert>{formError}</FormAlert> : null}

        <SubmitButton
          submitting={submitting}
          label={strings.submit}
          submittingLabel={leadContent.submitting}
        />
      </form>
    </section>
  );
}
