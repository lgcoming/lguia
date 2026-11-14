import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

const PRIVATE = ["/admin", "/api"];

/*
 * Crawlers that feed AI search and assistants, named explicitly (SPEC-009, GEO): search indexers
 * (OAI-SearchBot, PerplexityBot, Claude-SearchBot), user-triggered fetchers (ChatGPT-User,
 * Perplexity-User, Claude-User), training crawlers (GPTBot, ClaudeBot) and the Gemini control
 * token (Google-Extended). All are allowed: being read is the point of the public pages. To opt
 * out of model training only, move GPTBot, ClaudeBot and Google-Extended to a Disallow rule.
 */
const AI_CRAWLERS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
