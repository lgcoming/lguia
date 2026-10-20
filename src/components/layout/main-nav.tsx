"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import type { NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Desktop: inline links + CTA. Below lg: a full-screen glass sheet built on a modal <dialog>,
 * which traps focus, closes on Escape and returns focus to the toggle natively.
 */
export function MainNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Navigating (links, back/forward) always closes the sheet.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  function open() {
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <nav aria-label="Principal" className="hidden lg:block">
        <ul className="flex items-center">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center px-4 text-[0.9375rem] tracking-[-0.012em] opacity-80 transition-opacity duration-200 ease-out hover:opacity-100",
                  "aria-[current=page]:underline aria-[current=page]:decoration-1 aria-[current=page]:underline-offset-[6px] aria-[current=page]:opacity-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-3">
        {/* Wrapped: overriding the button's own display utility would conflict. */}
        <div className="hidden sm:block">
          <ButtonLink href="/diagnostico-digital" size="md">
            Diagnóstico gratuito
          </ButtonLink>
        </div>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="menu-movil"
          aria-haspopup="dialog"
          onClick={open}
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70 lg:hidden"
        >
          <Menu aria-hidden="true" className="size-5" strokeWidth={1.75} />
          <span className="sr-only">Abrir menú</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="menu-movil"
        aria-label="Menú"
        onClose={() => setIsOpen(false)}
        className="glass-light fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none p-0 text-obsidian backdrop:bg-transparent lg:hidden"
      >
        <div className="mx-auto flex h-(--header-height) w-full max-w-grid items-center justify-between px-4 sm:px-6">
          <Logo height={32} imageClassName="h-7 lg:h-8" />
          <button
            type="button"
            onClick={close}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
            <span className="sr-only">Cerrar menú</span>
          </button>
        </div>
        <nav
          aria-label="Principal móvil"
          className="mx-auto w-full max-w-grid px-6 pt-6 pb-10 sm:px-8"
        >
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  onClick={close}
                  className="flex min-h-12 items-center text-heading-sm font-semibold transition-colors duration-200 hover:text-graphite aria-[current=page]:text-sapphire"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ButtonLink
            href="/diagnostico-digital"
            size="lg"
            className="mt-10 w-full"
            onClick={close}
          >
            Haz tu diagnóstico digital
          </ButtonLink>
        </nav>
      </dialog>
    </>
  );
}
