import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type TextLinkProps = ComponentProps<typeof Link> & {
  tone?: "light" | "dark";
  size?: "body" | "footnote";
};

/** Apple-style inline action: blue text with a chevron icon (never a typed "→"). */
export function TextLink({
  tone = "light",
  size = "body",
  className,
  children,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={cn(
        "group/link inline-flex min-h-11 items-center gap-0.5 underline-offset-4 hover:underline",
        size === "body" ? "text-body" : "text-footnote",
        tone === "dark" ? "text-sky-signal" : "text-sapphire",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronRight
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover/link:translate-x-0.5"
      />
    </Link>
  );
}
