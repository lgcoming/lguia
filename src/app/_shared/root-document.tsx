import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { MotionProvider } from "@/components/motion/motion-provider";
import { LOCALE_INFO, type Locale } from "@/i18n/config";

import "../globals.css";

// Substitute for SF Pro outside Apple devices (SPEC-002 v2); `opsz` gives display and text cuts.
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * The <html> document shared by the root layout of every language (SPEC-009). Each language
 * has its own root layout so `lang` is correct in the server-rendered HTML without a proxy.
 */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={LOCALE_INFO[locale].lang} className={inter.variable}>
      <head>
        {/*
          Without JavaScript: reveals start visible, and the scroll hero is a plain hero (no
          pinned track to scroll through, no outro).
        */}
        <noscript>
          <style>
            {"[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}" +
              "[data-scroll-track]{height:auto!important}" +
              "[data-scroll-stage]{position:relative!important;height:auto!important}" +
              "[data-hero-outro]{display:none!important}"}
          </style>
        </noscript>
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
