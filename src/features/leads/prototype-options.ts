/** Choices of the free prototype request (SPEC-012). Labels live in the lead content files. */

export const PROTOTYPE_PROJECT_TYPES = ["new", "redesign"] as const;
export const PROTOTYPE_GOALS = ["leads", "sales", "bookings", "brand", "portfolio"] as const;
export const PROTOTYPE_STYLES = [
  "minimal",
  "corporate",
  "modern",
  "warm",
  "bold",
  "premium",
] as const;
export const PROTOTYPE_PALETTES = ["brand", "custom", "suggest"] as const;
export const PROTOTYPE_TONES = ["light", "dark", "any"] as const;
export const PROTOTYPE_SECTIONS = [
  "home",
  "services",
  "about",
  "portfolio",
  "blog",
  "shop",
  "bookings",
  "contact",
] as const;

export const PROTOTYPE_MAX_STYLES = 3;
export const PROTOTYPE_MAX_COLORS = 3;

export const LOGO_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
] as const;
export const LOGO_MAX_BYTES = 3 * 1024 * 1024;
/** Base64 grows 4 bytes for every 3; the schema checks the encoded length. */
export const LOGO_MAX_BASE64_LENGTH = Math.ceil(LOGO_MAX_BYTES / 3) * 4;

export type PrototypeProjectType = (typeof PROTOTYPE_PROJECT_TYPES)[number];
export type PrototypeGoal = (typeof PROTOTYPE_GOALS)[number];
export type PrototypeStyle = (typeof PROTOTYPE_STYLES)[number];
export type PrototypePalette = (typeof PROTOTYPE_PALETTES)[number];
export type PrototypeTone = (typeof PROTOTYPE_TONES)[number];
export type PrototypeSection = (typeof PROTOTYPE_SECTIONS)[number];
export type LogoType = (typeof LOGO_TYPES)[number];

/** Accepts "miweb.es" or "https://miweb.es" and always returns an https URL. */
export function normalizeWebsite(value: string): string {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function isWebsite(value: string): boolean {
  try {
    const url = new URL(normalizeWebsite(value));
    return url.hostname.includes(".") && !/\s/.test(value.trim());
  } catch {
    return false;
  }
}
