import { CircleAlert, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

/** Off-screen field that only bots fill in. Hidden from people and assistive technology. */
export function HoneypotField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label htmlFor={id}>No rellenes este campo</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export function DataProtectionNotice() {
  return (
    <p className="text-caption text-pewter">
      <strong className="font-semibold text-obsidian">Protección de datos.</strong> Responsable:
      lguia. Finalidad: responder a tu solicitud y, si lo pides, enviarte una propuesta. No cedemos
      tus datos a terceros. Puedes acceder a ellos, rectificarlos o suprimirlos escribiendo a{" "}
      <a href={`mailto:${siteConfig.email}`} className="text-sapphire underline underline-offset-2">
        {siteConfig.email}
      </a>
      .
    </p>
  );
}

export function FormAlert({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-control border border-danger bg-pure-white p-4 text-footnote text-danger"
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <p className="font-semibold">{children}</p>
    </div>
  );
}

export function SubmitButton({
  submitting,
  label,
  submittingLabel = "Enviando…",
}: {
  submitting: boolean;
  label: string;
  submittingLabel?: string;
}) {
  return (
    <Button type="submit" size="lg" disabled={submitting} aria-disabled={submitting}>
      {submitting ? (
        <>
          <LoaderCircle aria-hidden="true" className="size-5 motion-safe:animate-spin" />
          {submittingLabel}
        </>
      ) : (
        label
      )}
    </Button>
  );
}
