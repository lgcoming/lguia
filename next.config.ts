import type { NextConfig } from "next";

/**
 * Baseline security headers. A strict Content-Security-Policy needs per-request nonces for
 * Next.js inline scripts; it is on the roadmap rather than half-configured here.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // HTTPS only (the domain already forces it at Cloudflare); no preload until it is proven.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const RENAMED_SERVICE_SLUGS: Record<string, string> = {
  "desarrollo-web-a-medida": "diseno-web-a-medida",
  "agentes-ia-chatbots": "chatbots-agentes-ia",
  "seo-geo": "posicionamiento-seo-geo",
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // One canonical host: www.lguia.com is served by the same Worker and redirected here.
  async redirects() {
    return [
      // Service slugs renamed to carry the head search term (2026-11-26): keep old links working.
      ...Object.entries(RENAMED_SERVICE_SLUGS).map(([from, to]) => ({
        source: `/servicios/${from}`,
        destination: `/servicios/${to}`,
        permanent: true,
      })),
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lguia.com" }],
        destination: "https://lguia.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
