import type { MetadataRoute } from "next";
import { jobs } from "./jobs/data";
import { configuredSiteUrl } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = configuredSiteUrl();
  const now = new Date();
  const staticPages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/experts", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/solutions", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/vision", priority: 0.6, changeFrequency: "yearly" as const },
  ];

  return [
    ...staticPages.map((page) => ({ url: `${siteUrl}${page.path}`, lastModified: now, changeFrequency: page.changeFrequency, priority: page.priority })),
    ...jobs.filter((job) => !job.isDemo).map((job) => ({ url: `${siteUrl}/jobs/${job.slug}`, lastModified: job.datePosted ? new Date(job.datePosted) : now, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
