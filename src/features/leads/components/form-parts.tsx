import { CircleAlert, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

/** Off-screen field that only bots fill in. Hidden from people and assistive technology. */
export function HoneypotField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label htmlFor={id}>{label}</label>
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

export function DataProtectionNotice({ content }: { content: { title: string; text: string } }) {
  return (
    <p className="text-caption text-pewter">
      <strong className="font-semibold text-obsidian">{content.title}</strong> {content.text}{" "}
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
  submittingLabel,
}: {
  submitting: boolean;
  label: string;
  submittingLabel: string;
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
