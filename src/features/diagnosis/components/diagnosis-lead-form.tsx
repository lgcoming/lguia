"use client";

import { CircleCheck } from "lucide-react";

import { CheckboxField, TextAreaField, TextField } from "@/components/ui/form";
import type { DiagnosisAnswers } from "@/features/diagnosis/model/options";
import {
  DataProtectionNotice,
  FormAlert,
  HoneypotField,
  SubmitButton,
} from "@/features/leads/components/form-parts";
import { diagnosisLeadSchema } from "@/features/leads/schema";
import { useLeadForm } from "@/features/leads/use-lead-form";
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

function LeadSuccess({ name, email }: { name: string; email: string }) {
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  return (
    <div className="rounded-card border border-pine-700 bg-pine-50 p-6 md:p-8">
      <CircleCheck aria-hidden="true" className="size-8 text-pine-700" />
      <h3 ref={headingRef} tabIndex={-1} className="mt-4 text-h4 outline-none">
        Gracias, {name}. Hemos recibido tu diagnóstico.
      </h3>
      <p className="mt-2 text-ink-soft">
        Te escribiremos a <strong className="text-ink">{email}</strong> en un máximo de 2 días
        laborables para concertar una llamada de 30 minutos.
      </p>
    </div>
  );
}

export function DiagnosisLeadForm({
  answers,
  planName,
}: {
  answers: DiagnosisAnswers;
  planName: string;
}) {
  const { values, errors, status, formError, fieldId, setValue, handleSubmit } = useLeadForm({
    initialValues,
    idPrefix: "diagnostico",
    fieldOrder,
    validate: (current: LeadFormValues) => {
      const result = diagnosisLeadSchema.safeParse({ ...current, source: "diagnosis", answers });
      return result.success
        ? { success: true as const, payload: result.data }
        : {
            success: false as const,
            fieldErrors: issuesToFieldErrors(toApiIssues(result.error)),
          };
    },
  });

  if (status === "success") {
    return <LeadSuccess name={values.name.trim().split(" ")[0]} email={values.email.trim()} />;
  }

  const submitting = status === "submitting";

  return (
    <section aria-labelledby="lead-titulo" className="rounded-card bg-mist p-6 md:p-8">
      <h3 id="lead-titulo" className="text-h4">
        ¿Revisamos este diagnóstico contigo?
      </h3>
      <p className="mt-2 text-ink-soft">
        Déjanos tus datos y te enviaremos una propuesta para el plan {planName}, sin compromiso.
      </p>

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

        <TextAreaField
          id={fieldId("message")}
          name="message"
          label="¿Algo más que debamos saber?"
          optional
          rows={4}
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
          label="He leído la información sobre protección de datos y acepto que LGuIA use mis datos y mi diagnóstico para preparar una propuesta."
          checked={values.consent}
          onChange={(event) => setValue("consent", event.target.checked)}
          error={errors.consent}
        />

        <DataProtectionNotice />

        {formError ? <FormAlert>{formError}</FormAlert> : null}

        <SubmitButton submitting={submitting} label="Quiero mi propuesta" />
      </form>
    </section>
  );
}
