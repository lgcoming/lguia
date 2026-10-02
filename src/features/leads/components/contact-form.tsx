"use client";

import { CircleCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/ui/form";
import {
  DataProtectionNotice,
  FormAlert,
  HoneypotField,
  SubmitButton,
} from "@/features/leads/components/form-parts";
import { contactLeadSchema } from "@/features/leads/schema";
import { useLeadForm } from "@/features/leads/use-lead-form";
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

function validate(values: ContactFormValues) {
  const result = contactLeadSchema.safeParse({ ...values, source: "contact" });
  return result.success
    ? { success: true as const, payload: result.data }
    : { success: false as const, fieldErrors: issuesToFieldErrors(toApiIssues(result.error)) };
}

export function ContactForm({
  interestOptions,
}: {
  interestOptions: ReadonlyArray<{ value: string; label: string }>;
}) {
  const { values, errors, status, formError, fieldId, setValue, handleSubmit } = useLeadForm({
    initialValues,
    idPrefix: "contacto",
    fieldOrder,
    validate,
  });
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  if (status === "success") {
    return (
      <div className="rounded-card border border-pine-700 bg-pine-50 p-6 md:p-8">
        <CircleCheck aria-hidden="true" className="size-8 text-pine-700" />
        <h2 ref={successHeadingRef} tabIndex={-1} className="mt-4 text-h3 outline-none">
          Gracias, {values.name.trim().split(" ")[0]}. Hemos recibido tu mensaje.
        </h2>
        <p className="mt-3 text-ink-soft">
          Te responderemos a <strong className="text-ink">{values.email.trim()}</strong> en un
          máximo de 2 días laborables con una primera valoración.
        </p>
        <p className="mt-6">
          Mientras tanto, puedes{" "}
          <Link href="/diagnostico-digital" className="font-semibold text-pine-700 underline">
            hacer el diagnóstico digital
          </Link>{" "}
          para adelantar trabajo.
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form noValidate onSubmit={handleSubmit} className="relative space-y-6" aria-busy={submitting}>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id={fieldId("name")}
          name="name"
          label="Nombre"
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
          label="Email"
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
          label="Empresa"
          optional
          autoComplete="organization"
          value={values.company}
          onChange={(event) => setValue("company", event.target.value)}
          error={errors.company}
        />
        <TextField
          id={fieldId("phone")}
          name="phone"
          type="tel"
          label="Teléfono"
          optional
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
        label="¿En qué podemos ayudarte?"
        options={interestOptions}
        value={values.interest}
        onChange={(event) => setValue("interest", event.target.value)}
        error={errors.interest}
      />

      <TextAreaField
        id={fieldId("message")}
        name="message"
        label="Cuéntanos tu proyecto"
        hint="Qué necesitas, en qué plazo y cualquier detalle que nos ayude a entenderlo."
        required
        rows={6}
        value={values.message}
        onChange={(event) => setValue("message", event.target.value)}
        error={errors.message}
      />

      <HoneypotField
        id={fieldId("website")}
        value={values.website}
        onChange={(value) => setValue("website", value)}
      />

      <CheckboxField
        id={fieldId("consent")}
        name="consent"
        label="He leído la información sobre protección de datos y acepto que LGuIA use mis datos para responder a mi solicitud."
        checked={values.consent}
        onChange={(event) => setValue("consent", event.target.checked)}
        error={errors.consent}
      />

      <DataProtectionNotice />

      {formError ? <FormAlert>{formError}</FormAlert> : null}

      <SubmitButton submitting={submitting} label="Enviar mensaje" />
    </form>
  );
}
