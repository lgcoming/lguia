"use client";

import { useRef, useState, type FormEvent } from "react";

import { submitLeadRequest } from "@/features/leads/client";
import type { Locale } from "@/i18n/config";

type ValidationResult =
  { success: true; payload: unknown } | { success: false; fieldErrors: Record<string, string> };

interface UseLeadFormOptions<V> {
  initialValues: V;
  idPrefix: string;
  /** Visual order of fields, used to move focus to the first error. */
  fieldOrder: ReadonlyArray<keyof V & string>;
  validate: (values: V) => ValidationResult;
  /** Language of the form: sent to the API and stored with the lead. */
  locale: Locale;
  /** Network and server error messages in that language. */
  errorMessages: { network: string; server: string };
}

export type LeadFormStatus = "idle" | "submitting" | "success" | "error";

/**
 * Form state shared by the contact form and the diagnosis lead form:
 * validate on submit, re-validate on change after the first attempt,
 * focus the first invalid field and map server-side issues back to fields.
 */
export function useLeadForm<V extends Record<string, unknown>>({
  initialValues,
  idPrefix,
  fieldOrder,
  validate,
  locale,
  errorMessages,
}: UseLeadFormOptions<V>) {
  const [values, setValues] = useState<V>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<LeadFormStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const attempted = useRef(false);

  const fieldId = (name: keyof V & string) => `${idPrefix}-${name}`;

  function focusFirstError(fieldErrors: Record<string, string>) {
    const first = fieldOrder.find((name) => fieldErrors[name]);
    if (first) document.getElementById(fieldId(first))?.focus();
  }

  function setValue<K extends keyof V>(name: K, value: V[K]) {
    setFields({ [name]: value } as unknown as Partial<V>);
  }

  /** Several fields in one update, so one change cannot overwrite another. */
  function setFields(patch: Partial<V>) {
    const next = { ...values, ...patch };
    setValues(next);
    if (attempted.current) {
      const result = validate(next);
      setErrors(result.success ? {} : result.fieldErrors);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    attempted.current = true;

    const result = validate(values);
    if (!result.success) {
      setErrors(result.fieldErrors);
      focusFirstError(result.fieldErrors);
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("submitting");
    const outcome = await submitLeadRequest(result.payload, locale, errorMessages);

    if (outcome.ok) {
      setStatus("success");
    } else if ("fieldErrors" in outcome) {
      setErrors(outcome.fieldErrors);
      setStatus("idle");
      focusFirstError(outcome.fieldErrors);
    } else {
      setFormError(outcome.message);
      setStatus("error");
    }
  }

  return { values, errors, status, formError, fieldId, setValue, setFields, handleSubmit };
}
