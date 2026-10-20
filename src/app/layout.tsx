import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { getSiteUrl, siteConfig } from "@/lib/site";

import "./globals.css";

// Substitute for SF Pro outside Apple devices (SPEC-002 v2); `opsz` gives display and text cuts.
const inter = Inter({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "LGuIA: webs, automatización e IA práctica para pymes",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        {/* Reveal animations start hidden; without JavaScript, show everything. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
