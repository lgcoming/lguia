"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ButtonLink } from "@/components/ui/button";
import type { NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on: navigating closes it without an effect.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const isOpen = openOnPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenOnPath(null);
        toggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <>
      <nav aria-label="Principal" className="hidden md:block">
        <ul className="flex items-center gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-4 font-medium transition-colors duration-150 hover:bg-mist",
                  "aria-[current=page]:text-pine-700 aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-2">
        {/* Wrapped: overriding the button's own display utility would conflict. */}
        <div className="hidden sm:block">
          <ButtonLink href="/diagnostico-digital">Diagnóstico gratuito</ButtonLink>
        </div>
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="menu-movil"
          onClick={() => setOpenOnPath(isOpen ? null : pathname)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-line md:hidden"
        >
          {isOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
          <span className="sr-only">{isOpen ? "Cerrar menú" : "Abrir menú"}</span>
        </button>
      </div>

      <div
        id="menu-movil"
        hidden={!isOpen}
        className="absolute inset-x-0 top-full border-b border-line bg-paper shadow-lift md:hidden"
      >
        <nav aria-label="Principal móvil" className="mx-auto max-w-content px-4 pt-2 pb-6 sm:px-6">
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  onClick={() => setOpenOnPath(null)}
                  className="flex min-h-12 items-center text-h4 font-semibold aria-[current=page]:text-pine-700"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/diagnostico-digital"
            size="lg"
            className="mt-4 w-full"
            onClick={() => setOpenOnPath(null)}
          >
            Haz tu diagnóstico digital
          </ButtonLink>
        </nav>
      </div>
    </>
  );
}
