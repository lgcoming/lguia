import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { brandColors } from "@/lib/brand";

export const OG_SIZE = { width: 1200, height: 630 };

const publicDir = join(process.cwd(), "public");

/**
 * Social image of one language: the hero footage, the logo and the promise. The renderer's
 * built-in sans (Geist) stands in for SF Pro / Inter, since Satori cannot read the variable
 * WOFF2 that next/font serves.
 */
export async function renderOgImage(locale: Locale): Promise<ImageResponse> {
  const { meta } = getDictionary(locale);
  const [logo, poster] = await Promise.all([
    readFile(join(publicDir, "brand/lguia-logo-light.png"), "base64"),
    readFile(join(publicDir, "media/video/hero-connections-poster.jpg"), "base64"),
  ]);

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        background: brandColors.carbon,
        color: brandColors.pureWhite,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>. */}
      <img
        src={`data:image/jpeg;base64,${poster}`}
        alt=""
        width={1200}
        height={630}
        style={{ position: "absolute", inset: 0, width: 1200, height: 630, objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.62) 50%, rgba(0,0,0,0.82) 100%)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 80px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img>. */}
        <img src={`data:image/png;base64,${logo}`} alt="" width={210} height={74} />
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 62, lineHeight: 1.06, letterSpacing: -2.2 }}>
            {meta.ogHeadline}
          </div>
          <div style={{ fontSize: 30, color: brandColors.ashVeil }}>{meta.ogTagline}</div>
        </div>
      </div>
    </div>,
    OG_SIZE,
  );
}
