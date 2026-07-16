import type { MetadataRoute } from "next";
import { configuredSiteUrl } from "./seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = configuredSiteUrl();
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/intake", "/qa"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
