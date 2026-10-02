import { CircleAlert } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/*
 * Form controls render label, hint and error together so the ARIA wiring
 * (aria-describedby, aria-invalid) is always correct.
 */

const controlClasses =
  "block w-full rounded-xl border border-control bg-paper px-4 py-3 text-base text-ink transition-colors duration-150 hover:border-ink aria-[invalid=true]:border-danger aria-[invalid=true]:bg-danger-50";

interface FieldChromeProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

function FieldLabel({ id, label, optional }: Pick<FieldChromeProps, "id" | "label" | "optional">) {
  return (
    <label htmlFor={id} className="mb-2 block font-semibold">
      {label}
      {optional ? <span className="font-normal text-ink-soft"> (opcional)</span> : null}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-danger">
      <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

function FieldHint({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 text-sm text-ink-soft">
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
          className="mt-0.5 size-6 shrink-0 cursor-pointer accent-pine-700"
          {...props}
        />
        <label htmlFor={id} className="cursor-pointer text-base">
          {label}
        </label>
      </div>
      <FieldHint id={`${id}-hint`}>{hint}</FieldHint>
      <FieldError id={`${id}-error`}>{error}</FieldError>
    </div>
  );
}
