import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export const dynamic = "force-static";

const PRIVATE = ["/wp-admin/", "/cart/", "/checkout/", "/my-account/", "/?s=", "/?add-to-cart="];

// AI search and assistant crawlers are welcome: being read and cited by them is
// part of the strategy. They get the same rules as everyone else, stated explicitly.
const AI_AGENTS = [
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
  "DuckAssistBot",
  "MistralAI-User",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_AGENTS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
