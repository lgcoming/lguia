import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { brandColors } from "@/lib/brand";

export const alt = "LGuIA: webs, automatización e IA práctica para pymes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontsDir = join(process.cwd(), "assets/fonts");

/** Shared social image for every route, drawn with the brand's route device. */
export default async function OpenGraphImage() {
  const [regular, bold] = await Promise.all([
    readFile(join(fontsDir, "schibsted-grotesk-latin-400.woff")),
    readFile(join(fontsDir, "schibsted-grotesk-latin-700.woff")),
  ]);

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px 80px",
        background: brandColors.ink,
        color: brandColors.paper,
        fontFamily: "Schibsted Grotesk",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg viewBox="0 0 32 32" width="64" height="64">
          <rect width="32" height="32" rx="9" fill={brandColors.pine} />
          <path
            d="M9.5 22.5c0-7 13-5 13-12.5"
            fill="none"
            stroke={brandColors.paper}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="9.5" cy="22.5" r="2.6" fill={brandColors.paper} />
          <circle cx="22.5" cy="10" r="3.4" fill={brandColors.signal} />
        </svg>
        <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>LGuIA</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
          Webs, automatizaciones e IA que resuelven problemas reales de tu negocio
        </div>
        <div style={{ fontSize: 30, color: brandColors.onDarkSoft }}>
          Agencia digital para pymes y negocios locales
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: brandColors.pine }} />
        <div style={{ flex: 1, height: 4, background: brandColors.inkRaised }} />
        <div style={{ width: 30, height: 30, borderRadius: 15, background: brandColors.signal }} />
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Schibsted Grotesk", data: regular, weight: 400, style: "normal" },
        { name: "Schibsted Grotesk", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
