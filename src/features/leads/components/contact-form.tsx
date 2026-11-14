"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";

import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/ui/form";
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
import { issuesToFieldErrors, toApiIssues } from "@/lib/validation";

interface ContactFormValues extends Record<string, unknown> {
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  message: string;
  consent: boolean;
  website: string;
}

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  interest: "general",
  message: "",
  consent: false,
  website: "",
};

const fieldOrder = ["name", "email", "company", "phone", "interest", "message", "consent"] as const;

interface ContactFormProps {
  locale: Locale;
  content: LeadFormContent;
  interestOptions: ReadonlyArray<{ value: string; label: string }>;
  /** Where the success message sends people next (the diagnosis page of this language). */
  diagnosisHref: string;
}

export function ContactForm({ locale, content, interestOptions, diagnosisHref }: ContactFormProps) {
  const schema = useMemo(
    () => createLeadSchemas(content.validation).contactLeadSchema,
    [content.validation],
  );
  const { values, errors, status, formError, fieldId, setValue, handleSubmit } = useLeadForm({
    initialValues,
    idPrefix: "contacto",
    fieldOrder,
    locale,
    errorMessages: content.errors,
    validate: (current: ContactFormValues) => {
      const result = schema.safeParse({ ...current, source: "contact" });
      return result.success
        ? { success: true as const, payload: result.data }
        : {
            success: false as const,
            fieldErrors: issuesToFieldErrors(toApiIssues(result.error)),
          };
    },
  });
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  if (status === "success") {
    const [textBefore, textAfter] = splitAt(content.success.text, "{email}");
    const [nextBefore, nextAfter] = splitAt(content.success.next, "{link}");
    return (
      <div className="rounded-tile bg-fog-white p-6 md:p-8">
        <CircleCheck aria-hidden="true" className="size-8 text-obsidian" strokeWidth={1.5} />
        <h2 ref={successHeadingRef} tabIndex={-1} className="mt-4 text-heading-sm outline-none">
          {format(content.success.title, { name: values.name.trim().split(" ")[0] })}
        </h2>
        <p className="mt-3 text-pewter">
          {textBefore}
          <strong className="text-obsidian">{values.email.trim()}</strong>
          {textAfter}
        </p>
        <p className="mt-6">
          {nextBefore}
          <Link href={diagnosisHref} className="text-sapphire underline underline-offset-4">
            {content.success.nextLink}
          </Link>
          {nextAfter}
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";
  const { fields } = content;

  return (
    <form noValidate onSubmit={handleSubmit} className="relative space-y-6" aria-busy={submitting}>
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

      <SelectField
        id={fieldId("interest")}
        name="interest"
        label={fields.interest}
        options={interestOptions}
        value={values.interest}
        onChange={(event) => setValue("interest", event.target.value)}
        error={errors.interest}
      />

      <TextAreaField
        id={fieldId("message")}
        name="message"
        label={fields.message}
        hint={fields.messageHint}
        required
        rows={6}
        value={values.message}
        onChange={(event) => setValue("message", event.target.value)}
        error={errors.message}
      />

      <HoneypotField
        id={fieldId("website")}
        label={content.honeypotLabel}
        value={values.website}
        onChange={(value) => setValue("website", value)}
      />

      <CheckboxField
        id={fieldId("consent")}
        name="consent"
        label={content.consent}
        checked={values.consent}
        onChange={(event) => setValue("consent", event.target.checked)}
        error={errors.consent}
      />

      <DataProtectionNotice
        content={content.dataProtection}
        privacyHref={pageHref(locale, "privacy")}
      />

      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <SubmitButton
        submitting={submitting}
        label={content.submit}
        submittingLabel={content.submitting}
      />
    </form>
  );
}
