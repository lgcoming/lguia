import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "on-dark" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-pine-700 text-paper hover:bg-pine-800",
  secondary: "border border-control bg-paper text-ink hover:border-ink hover:bg-mist",
  "on-dark": "bg-signal text-ink hover:bg-signal-300",
  ghost: "text-pine-700 hover:bg-pine-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-6 text-body",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors duration-150",
    "disabled:cursor-not-allowed disabled:opacity-50",
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
