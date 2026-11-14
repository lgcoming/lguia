import { CircleAlert } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/*
 * Form controls render label, hint and error together so the ARIA wiring
 * (aria-describedby, aria-invalid) is always correct.
 */

const controlClasses =
  "block w-full rounded-control border border-silver bg-pure-white px-4 py-3 text-body text-obsidian transition-colors duration-200 ease-out hover:border-graphite focus-visible:border-iris-blue aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger";

interface FieldChromeProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  /** Suffix for optional fields in the form's language, e.g. "(opcional)". */
  optional?: string;
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function FieldLabel({ id, label, optional }: Pick<FieldChromeProps, "id" | "label" | "optional">) {
  return (
    <label htmlFor={id} className="mb-2 block text-footnote font-semibold">
      {label}
      {optional ? <span className="font-normal text-pewter"> {optional}</span> : null}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-footnote text-danger">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function FieldHint({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 text-footnote text-pewter">
      {children}
    </p>
  );
}

type TextFieldProps = FieldChromeProps & Omit<ComponentProps<"input">, "id">;

export function TextField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  ...props
}: TextFieldProps) {
  return (
    <div className={className}>
      <FieldLabel id={id} label={label} optional={optional} />
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={controlClasses}
        {...props}
      />
      <FieldHint id={`${id}-hint`}>{hint}</FieldHint>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

type TextAreaFieldProps = FieldChromeProps & Omit<ComponentProps<"textarea">, "id">;

export function TextAreaField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  ...props
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <FieldLabel id={id} label={label} optional={optional} />
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, "min-h-32 resize-y")}
        {...props}
      />
      <FieldHint id={`${id}-hint`}>{hint}</FieldHint>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

type SelectFieldProps = FieldChromeProps &
  Omit<ComponentProps<"select">, "id"> & {
    options: ReadonlyArray<{ value: string; label: string }>;
  };

export function SelectField({
  id,
  label,
  hint,
  error,
  optional,
  options,
  className,
  ...props
}: SelectFieldProps) {
  return (
    <div className={className}>
      <FieldLabel id={id} label={label} optional={optional} />
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClasses, "appearance-auto")}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FieldHint id={`${id}-hint`}>{hint}</FieldHint>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}

type CheckboxFieldProps = Omit<FieldChromeProps, "label" | "optional"> &
  Omit<ComponentProps<"input">, "id" | "type"> & { label: ReactNode };

export function CheckboxField({ id, label, hint, error, className, ...props }: CheckboxFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className="mt-0.5 size-6 shrink-0 cursor-pointer accent-iris-blue"
          {...props}
        />
        <label htmlFor={id} className="cursor-pointer text-footnote text-graphite">
          {label}
        </label>
      </div>
      <FieldHint id={`${id}-hint`}>{hint}</FieldHint>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}
