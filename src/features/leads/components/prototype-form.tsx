"use client";

import { CircleCheck, Paperclip, Plus, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { CheckboxField, FieldError, TextAreaField, TextField } from "@/components/ui/form";
import {
  DataProtectionNotice,
  FormAlert,
  HoneypotField,
  SubmitButton,
} from "@/features/leads/components/form-parts";
import type { LeadFormContent, PrototypeFormContent } from "@/features/leads/content/types";
import {
  LOGO_MAX_BYTES,
  LOGO_TYPES,
  PROTOTYPE_GOALS,
  PROTOTYPE_MAX_COLORS,
  PROTOTYPE_MAX_STYLES,
  PROTOTYPE_PALETTES,
  PROTOTYPE_PROJECT_TYPES,
  PROTOTYPE_SECTIONS,
  PROTOTYPE_STYLES,
  PROTOTYPE_TONES,
  type LogoType,
} from "@/features/leads/prototype-options";
import { createLeadSchemas } from "@/features/leads/schema";
import { useLeadForm } from "@/features/leads/use-lead-form";
import { format, splitAt, type Locale } from "@/i18n/config";
import { pageHref } from "@/i18n/routes";
import { cn } from "@/lib/utils";
import { issuesToFieldErrors, toApiIssues } from "@/lib/validation";

interface Logo {
  name: string;
  type: LogoType;
  data: string;
}

interface PrototypeFormValues extends Record<string, unknown> {
  name: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  currentSite: string;
  business: string;
  goal: string;
  styles: string[];
  palette: string;
  colors: string[];
  tone: string;
  sections: string[];
  references: string;
  message: string;
  logo: Logo | null;
  consent: boolean;
  website: string;
}

const initialValues: PrototypeFormValues = {
  name: "",
  email: "",
  company: "",
  phone: "",
  projectType: "new",
  currentSite: "",
  business: "",
  goal: "",
  styles: [],
  palette: "",
  colors: [],
  tone: "any",
  sections: ["home", "contact"],
  references: "",
  message: "",
  logo: null,
  consent: false,
  website: "",
};

const fieldOrder = [
  "name",
  "email",
  "company",
  "phone",
  "projectType",
  "currentSite",
  "business",
  "goal",
  "styles",
  "palette",
  "colors",
  "tone",
  "logo",
  "sections",
  "references",
  "message",
  "consent",
] as const;

/** Starting colour when someone chooses their own palette: the brand's sapphire. */
const FIRST_COLOR = "#0066cc";

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

const groupClasses = "space-y-6 rounded-tile bg-fog-white p-5 sm:p-7";
const legendClasses = "mb-4 text-subheading font-semibold";

/** Option tiles: the native input stays in the tab order; the tile shows its state. */
function ChoiceGroup({
  id,
  name,
  legend,
  hint,
  error,
  type,
  options,
  selected,
  onToggle,
  columns = "sm:grid-cols-2",
}: {
  id: string;
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  type: "radio" | "checkbox";
  options: ReadonlyArray<{ value: string; label: string; hint?: string }>;
  selected: ReadonlyArray<string>;
  onToggle: (value: string) => void;
  columns?: string;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <fieldset aria-describedby={describedBy || undefined}>
      <legend className="mb-2 text-footnote font-semibold">{legend}</legend>
      {hint ? (
        <p id={`${id}-hint`} className="-mt-1 mb-3 text-footnote text-pewter">
          {hint}
        </p>
      ) : null}
      <div className={cn("grid gap-2", columns)}>
        {options.map((option, index) => {
          const checked = selected.includes(option.value);
          return (
            <label
              key={option.value}
              className={cn(
                "flex min-h-12 cursor-pointer items-start gap-3 rounded-control border bg-pure-white px-4 py-3 transition-colors duration-200",
                "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-iris-blue",
                checked
                  ? "border-iris-blue bg-ice-wash/30"
                  : "border-pale-mist hover:border-silver",
              )}
            >
              <input
                id={index === 0 ? id : `${id}-${option.value}`}
                type={type}
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onToggle(option.value)}
                aria-invalid={error ? true : undefined}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-iris-blue"
              />
              <span>
                <span className="block text-footnote font-semibold text-obsidian">
                  {option.label}
                </span>
                {option.hint ? (
                  <span className="block text-caption text-pewter">{option.hint}</span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </fieldset>
  );
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className={groupClasses}>
      <legend className={cn(legendClasses, "float-left w-full")}>{legend}</legend>
      <div className="clear-both space-y-6">{children}</div>
    </fieldset>
  );
}

interface PrototypeFormProps {
  locale: Locale;
  /** Shared lead form copy: contact labels, consent, errors. */
  content: LeadFormContent;
  /** Prototype-specific copy (SPEC-012). */
  prototype: PrototypeFormContent;
}

export function PrototypeForm({ locale, content, prototype }: PrototypeFormProps) {
  const schema = useMemo(
    () => createLeadSchemas(content.validation).prototypeLeadSchema,
    [content.validation],
  );
  const { values, errors, status, formError, fieldId, setValue, setFields, handleSubmit } =
    useLeadForm({
      initialValues,
      idPrefix: "prototipo",
      fieldOrder,
      locale,
      errorMessages: content.errors,
      validate: (current: PrototypeFormValues) => {
        const result = schema.safeParse({
          ...current,
          source: "prototype",
          colors: current.palette === "custom" ? current.colors : [],
          logo: current.logo ?? undefined,
        });
        return result.success
          ? { success: true as const, payload: result.data }
          : {
              success: false as const,
              fieldErrors: issuesToFieldErrors(toApiIssues(result.error)),
            };
      },
    });
  const [logoError, setLogoError] = useState<string>();
  const logoInput = useRef<HTMLInputElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  if (status === "success") {
    const [textBefore, textAfter] = splitAt(prototype.success.text, "{email}");
    return (
      <div className="rounded-tile bg-fog-white p-6 md:p-8">
        <CircleCheck aria-hidden="true" className="size-8 text-obsidian" strokeWidth={1.5} />
        <h2 ref={successHeadingRef} tabIndex={-1} className="mt-4 text-heading-sm outline-none">
          {format(prototype.success.title, { name: values.name.trim().split(" ")[0] })}
        </h2>
        <p className="mt-3 text-pewter">
          {textBefore}
          <strong className="text-obsidian">{values.email.trim()}</strong>
          {textAfter}
        </p>
      </div>
    );
  }

  const { fields: f, options: o } = prototype;
  const submitting = status === "submitting";

  function toggle(name: "styles" | "sections", value: string, max: number) {
    const current = values[name];
    if (current.includes(value)) {
      setValue(
        name,
        current.filter((item) => item !== value),
      );
    } else if (current.length < max) {
      setValue(name, [...current, value]);
    }
  }

  function choosePalette(palette: string) {
    const startColors = palette === "custom" && values.colors.length === 0;
    setFields(startColors ? { palette, colors: [FIRST_COLOR] } : { palette });
  }

  async function chooseLogo(file: File | undefined) {
    setLogoError(undefined);
    if (!file) return;
    if (!LOGO_TYPES.includes(file.type as LogoType)) {
      setLogoError(content.validation.logo);
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      setLogoError(content.validation.logoSize);
      return;
    }
    const data = await readAsBase64(file);
    setValue("logo", { name: file.name.slice(0, 120), type: file.type as LogoType, data });
  }

  function removeLogo() {
    setValue("logo", null);
    setLogoError(undefined);
    if (logoInput.current) logoInput.current.value = "";
    logoInput.current?.focus();
  }

  const logoMessage = logoError ?? errors.logo;

  return (
    <form noValidate onSubmit={handleSubmit} className="relative space-y-4" aria-busy={submitting}>
      <Group legend={prototype.groups.contact}>
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            id={fieldId("name")}
            name="name"
            label={content.fields.name}
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
            label={content.fields.email}
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
            label={content.fields.company}
            optional={content.fields.optional}
            autoComplete="organization"
            value={values.company}
            onChange={(event) => setValue("company", event.target.value)}
            error={errors.company}
          />
          <TextField
            id={fieldId("phone")}
            name="phone"
            type="tel"
            label={content.fields.phone}
            optional={content.fields.optional}
            autoComplete="tel"
            inputMode="tel"
            value={values.phone}
            onChange={(event) => setValue("phone", event.target.value)}
            error={errors.phone}
          />
        </div>
      </Group>

      <Group legend={prototype.groups.project}>
        <ChoiceGroup
          id={fieldId("projectType")}
          name="projectType"
          legend={f.projectType}
          type="radio"
          options={PROTOTYPE_PROJECT_TYPES.map((value) => ({
            value,
            label: o.projectType[value],
          }))}
          selected={[values.projectType]}
          onToggle={(value) => setValue("projectType", value)}
          error={errors.projectType}
        />
        {values.projectType === "redesign" ? (
          <TextField
            id={fieldId("currentSite")}
            name="currentSite"
            type="url"
            inputMode="url"
            autoComplete="url"
            label={f.currentSite}
            hint={f.currentSiteHint}
            required
            value={values.currentSite}
            onChange={(event) => setValue("currentSite", event.target.value)}
            error={errors.currentSite}
          />
        ) : null}
        <TextAreaField
          id={fieldId("business")}
          name="business"
          label={f.business}
          hint={f.businessHint}
          required
          rows={4}
          value={values.business}
          onChange={(event) => setValue("business", event.target.value)}
          error={errors.business}
        />
        <ChoiceGroup
          id={fieldId("goal")}
          name="goal"
          legend={f.goal}
          type="radio"
          options={PROTOTYPE_GOALS.map((value) => ({ value, label: o.goal[value] }))}
          selected={[values.goal]}
          onToggle={(value) => setValue("goal", value)}
          error={errors.goal}
        />
      </Group>

      <Group legend={prototype.groups.style}>
        <ChoiceGroup
          id={fieldId("styles")}
          name="styles"
          legend={f.styles}
          hint={f.stylesHint}
          type="checkbox"
          columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          options={PROTOTYPE_STYLES.map((value) => ({ value, ...o.styles[value] }))}
          selected={values.styles}
          onToggle={(value) => toggle("styles", value, PROTOTYPE_MAX_STYLES)}
          error={errors.styles}
        />
        <ChoiceGroup
          id={fieldId("palette")}
          name="palette"
          legend={f.palette}
          type="radio"
          columns="sm:grid-cols-3"
          options={PROTOTYPE_PALETTES.map((value) => ({ value, label: o.palette[value] }))}
          selected={[values.palette]}
          onToggle={choosePalette}
          error={errors.palette}
        />
        {values.palette === "custom" ? (
          <fieldset aria-describedby={`${fieldId("colors")}-hint`}>
            <legend className="mb-2 text-footnote font-semibold">{f.colors}</legend>
            <p id={`${fieldId("colors")}-hint`} className="-mt-1 mb-3 text-footnote text-pewter">
              {f.colorsHint}
            </p>
            <ul className="flex flex-wrap gap-3">
              {values.colors.map((color, index) => {
                const label = format(f.color, { n: index + 1 });
                const inputId = index === 0 ? fieldId("colors") : `${fieldId("colors")}-${index}`;
                return (
                  <li
                    key={index}
                    className="flex items-center gap-2 rounded-control border border-pale-mist bg-pure-white py-1.5 pr-1.5 pl-2"
                  >
                    <label htmlFor={inputId} className="sr-only">
                      {label}
                    </label>
                    <input
                      id={inputId}
                      type="color"
                      value={color}
                      onChange={(event) =>
                        setValue(
                          "colors",
                          values.colors.map((item, at) =>
                            at === index ? event.target.value : item,
                          ),
                        )
                      }
                      className="size-9 cursor-pointer rounded-md border-0 bg-transparent p-0"
                    />
                    <span className="font-mono text-footnote text-graphite uppercase">{color}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setValue(
                          "colors",
                          values.colors.filter((_, at) => at !== index),
                        )
                      }
                      className="inline-flex size-8 items-center justify-center rounded-full text-pewter hover:bg-ash-veil hover:text-obsidian"
                    >
                      <X aria-hidden="true" className="size-4" />
                      <span className="sr-only">{format(f.removeColor, { n: index + 1 })}</span>
                    </button>
                  </li>
                );
              })}
              {values.colors.length < PROTOTYPE_MAX_COLORS ? (
                <li>
                  <button
                    type="button"
                    onClick={() => setValue("colors", [...values.colors, FIRST_COLOR])}
                    className="inline-flex min-h-12 items-center gap-2 rounded-control border border-dashed border-silver px-4 text-footnote font-semibold text-sapphire hover:border-sapphire"
                  >
                    <Plus aria-hidden="true" className="size-4" />
                    {f.addColor}
                  </button>
                </li>
              ) : null}
            </ul>
            <FieldError id={`${fieldId("colors")}-error`}>{errors.colors}</FieldError>
          </fieldset>
        ) : null}
        <ChoiceGroup
          id={fieldId("tone")}
          name="tone"
          legend={f.tone}
          type="radio"
          columns="grid-cols-3"
          options={PROTOTYPE_TONES.map((value) => ({ value, label: o.tone[value] }))}
          selected={[values.tone]}
          onToggle={(value) => setValue("tone", value)}
          error={errors.tone}
        />

        <div>
          <p className="mb-2 text-footnote font-semibold">
            {f.logo} <span className="font-normal text-pewter">{content.fields.optional}</span>
          </p>
          <p id={`${fieldId("logo")}-hint`} className="mb-3 text-footnote text-pewter">
            {f.logoHint}
          </p>
          {values.logo ? (
            <div className="flex flex-wrap items-center gap-3 rounded-control border border-pale-mist bg-pure-white px-4 py-3">
              <Paperclip aria-hidden="true" className="size-4 text-pewter" />
              <p role="status" className="min-w-0 flex-1 truncate text-footnote">
                {format(f.logoSelected, { name: values.logo.name })}
              </p>
              <button
                type="button"
                onClick={removeLogo}
                className="inline-flex min-h-10 items-center rounded-full px-3 text-footnote font-semibold text-sapphire hover:bg-ash-veil"
              >
                {f.logoRemove}
              </button>
            </div>
          ) : (
            <>
              <label htmlFor={fieldId("logo")} className="sr-only">
                {f.logo}
              </label>
              <input
                ref={logoInput}
                id={fieldId("logo")}
                name="logo"
                type="file"
                accept={LOGO_TYPES.join(",")}
                aria-invalid={logoMessage ? true : undefined}
                aria-describedby={cn(
                  `${fieldId("logo")}-hint`,
                  logoMessage && `${fieldId("logo")}-error`,
                )}
                onChange={(event) => void chooseLogo(event.target.files?.[0])}
                className="block w-full cursor-pointer rounded-control border border-dashed border-silver bg-pure-white p-3 text-footnote text-graphite file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-obsidian file:px-4 file:py-2 file:text-footnote file:font-semibold file:text-pure-white hover:border-graphite"
              />
            </>
          )}
          <FieldError id={`${fieldId("logo")}-error`}>{logoMessage}</FieldError>
        </div>
      </Group>

      <Group legend={prototype.groups.content}>
        <ChoiceGroup
          id={fieldId("sections")}
          name="sections"
          legend={f.sections}
          hint={f.sectionsHint}
          type="checkbox"
          columns="grid-cols-2 lg:grid-cols-4"
          options={PROTOTYPE_SECTIONS.map((value) => ({ value, label: o.sections[value] }))}
          selected={values.sections}
          onToggle={(value) => toggle("sections", value, PROTOTYPE_SECTIONS.length)}
          error={errors.sections}
        />
        <TextAreaField
          id={fieldId("references")}
          name="references"
          label={f.references}
          optional={content.fields.optional}
          hint={f.referencesHint}
          rows={3}
          value={values.references}
          onChange={(event) => setValue("references", event.target.value)}
          error={errors.references}
        />
      </Group>

      <Group legend={prototype.groups.extra}>
        <TextAreaField
          id={fieldId("message")}
          name="message"
          label={f.message}
          optional={content.fields.optional}
          hint={f.messageHint}
          rows={4}
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
          label={prototype.submit}
          submittingLabel={content.submitting}
        />
      </Group>
    </form>
  );
}
