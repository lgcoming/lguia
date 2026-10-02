import { ImageResponse } from "next/og";

import { brandColors } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: brandColors.pine }}>
      <svg viewBox="0 0 32 32" width="180" height="180">
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
    </div>,
    size,
  );
}
