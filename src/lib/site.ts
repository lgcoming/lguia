export const siteConfig = {
  name: "LGuIA",
  tagline: "Webs, automatización e IA práctica para pymes",
  description:
    "Ayudamos a pymes y negocios locales a conseguir más clientes con su web, ahorrar tiempo automatizando tareas y usar la IA donde aporta valor.",
  // Placeholder until the real mailbox is confirmed (see MEMORY.md).
  email: "hola@lguia.es",
  locale: "es_ES",
  areaServed: "España",
} as const;

export interface NavItem {
  href: string;
  label: string;
}

export const mainNav: NavItem[] = [
  { href: "/servicios", label: "Servicios" },
  { href: "/planes", label: "Planes" },
  { href: "/diagnostico-digital", label: "Diagnóstico" },
  { href: "/contacto", label: "Contacto" },
];

/**
 * Canonical origin for metadata, sitemap and structured data.
 * Order: explicit env → Vercel production domain → local development.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProduction) return new URL(`https://${vercelProduction}`);

  return new URL("http://localhost:3000");
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
