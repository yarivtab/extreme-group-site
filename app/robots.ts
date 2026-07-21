import type { MetadataRoute } from "next";
import { configuredSiteUrl } from "./seo";

// AI answer engines that crawl for citation/answer content (GEO). Listed
// explicitly — even though the wildcard rule below already allows them —
// so access is a documented, intentional choice rather than incidental.
const aiAnswerEngineBots = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const siteUrl = configuredSiteUrl();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/intake", "/qa"] },
      ...aiAnswerEngineBots.map((userAgent) => ({ userAgent, allow: "/", disallow: ["/intake", "/qa"] })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
