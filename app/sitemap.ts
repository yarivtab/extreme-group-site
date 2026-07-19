import type { MetadataRoute } from "next";
import { readAdamJobs } from "../lib/adam-db";
import { configuredSiteUrl } from "./seo";
import { jobCategories } from "./jobs/categories";
import { insights } from "./insights/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = configuredSiteUrl();
  const now = new Date();
  const jobs = await readAdamJobs();
  const staticPages = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/experts", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/solutions", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/insights", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/vision", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return [
    ...staticPages.map((page) => ({ url: `${siteUrl}${page.path}`, lastModified: now, changeFrequency: page.changeFrequency, priority: page.priority })),
    ...jobCategories.map((category) => ({ url: `${siteUrl}/jobs/category/${category.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.75 })),
    ...insights.filter((insight) => !insight.isDraft).map((insight) => ({ url: `${siteUrl}/insights/${insight.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...jobs.map((job) => ({ url: `${siteUrl}/jobs/${job.slug}`, lastModified: job.sourceUpdatedAt ? new Date(job.sourceUpdatedAt) : job.publishedAt ? new Date(job.publishedAt) : now, changeFrequency: "daily" as const, priority: 0.8 })),
  ];
}
