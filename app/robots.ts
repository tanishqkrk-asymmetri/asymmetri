import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-content";

// AI search and assistant crawlers are named explicitly so it is clear they are
// welcome (GEO/AEO). To opt out of model training only, move GPTBot, ClaudeBot,
// Google-Extended, Applebot-Extended and CCBot into a Disallow rule.
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
];

const disallow = ["/admin", "/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
