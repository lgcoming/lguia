import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/*
 * Apple-style pill buttons (SPEC-002 v2). `primary` is the only filled blue action in a group;
 * the others are companions for light surfaces, dark bands and media.
 */
type ButtonVariant = "primary" | "secondary" | "on-dark" | "light" | "glass" | "plain";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  // A barely-there top highlight gives the filled pill its "lit from above" finish.
  primary:
    "bg-iris-blue bg-linear-to-b from-pure-white/12 to-pure-white/0 text-pure-white hover:bg-iris-blue-hover",
  secondary: "border border-sapphire text-sapphire hover:bg-sapphire hover:text-pure-white",
  "on-dark": "border border-sky-signal text-sky-signal hover:bg-sky-signal hover:text-carbon",
  light: "bg-pure-white text-obsidian hover:bg-ash-veil",
  glass: "glass-panel text-pure-white hover:bg-pure-white/20",
  plain: "text-sapphire hover:underline underline-offset-4",
};

const sizeClasses: Record<ButtonSize, string> = {
  // Compact pill for the 52px header; still well above the 24px WCAG 2.2 AA target size.
  sm: "min-h-9 px-4 text-footnote",
  md: "min-h-11 px-5 text-footnote",
  lg: "min-h-12 px-7 text-body",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-1.5 rounded-full font-normal whitespace-nowrap",
    "transition-[background-color,color,transform] duration-200 ease-out active:scale-[0.98]",
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & Omit<ButtonStyleOptions, "className">;

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & Omit<ButtonStyleOptions, "className">;

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonStyles({ variant, size, className })} {...props} />;
}
