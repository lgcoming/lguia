"use client";

import { Globe, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LanguageLink } from "@/components/layout/language-link";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
}

interface MainNavProps {
  items: NavItem[];
  home: NavItem;
  cta: NavItem;
  /** Longer call to action shown inside the mobile sheet. */
  mobileCta: string;
  language: { target: Locale; name: string; code: string; label: string };
  labels: { primary: string; mobile: string; menu: string; openMenu: string; closeMenu: string };
}

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Desktop: inline links, language switch and CTA. Below lg: a full-screen glass sheet built on a
 * modal <dialog>, which traps focus, closes on Escape and returns focus to the toggle natively.
 * All copy arrives as props, so no dictionary is bundled for the browser (SPEC-009).
 */
export function MainNav({ items, home, cta, mobileCta, language, labels }: MainNavProps) {
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
      <nav aria-label={labels.primary} className="hidden lg:block">
        <ul className="flex items-center">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "nav-link inline-flex min-h-11 items-center px-4 text-[0.9375rem] tracking-[-0.012em] opacity-80 transition-opacity duration-200 ease-out hover:opacity-100",
                  "aria-[current=page]:opacity-100",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-1 sm:gap-3">
        <LanguageLink
          target={language.target}
          label={language.label}
          className="hidden min-h-11 items-center gap-1.5 rounded-full px-3 text-footnote opacity-80 transition-opacity duration-200 ease-out hover:opacity-100 lg:inline-flex"
        >
          <Globe aria-hidden="true" className="size-4" strokeWidth={1.75} />
          {language.code}
        </LanguageLink>
        {/* Wrapped: overriding the button's own display utility would conflict. */}
        <div className="hidden sm:block">
          <ButtonLink href={cta.href} size="md">
            {cta.label}
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
          <span className="sr-only">{labels.openMenu}</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="menu-movil"
        aria-label={labels.menu}
        onClose={() => setIsOpen(false)}
        className="glass-light fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none p-0 text-obsidian backdrop:bg-transparent lg:hidden"
      >
        <div className="mx-auto flex h-(--header-height) w-full max-w-grid items-center justify-between px-4 sm:px-6">
          <Logo height={32} href={home.href} label={home.label} imageClassName="h-7 lg:h-8" />
          <button
            type="button"
            onClick={close}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-full transition-opacity duration-200 hover:opacity-70"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.75} />
            <span className="sr-only">{labels.closeMenu}</span>
          </button>
        </div>
        <nav
          aria-label={labels.mobile}
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
          <ButtonLink href={cta.href} size="lg" className="mt-10 w-full" onClick={close}>
            {mobileCta}
          </ButtonLink>
          <LanguageLink
            target={language.target}
            label={language.label}
            className="mt-6 inline-flex min-h-11 items-center gap-2 text-body text-sapphire underline-offset-4 hover:underline"
          >
            <Globe aria-hidden="true" className="size-4" strokeWidth={1.75} />
            {language.name}
          </LanguageLink>
        </nav>
      </dialog>
    </>
  );
}
