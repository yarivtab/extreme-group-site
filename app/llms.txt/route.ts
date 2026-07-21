import { configuredSiteUrl } from "../seo";
import { readAdamJobs } from "../../lib/adam-db";
import { jobCategories } from "../jobs/categories";
import { insights } from "../insights/data";

// A plain-text summary of the site for AI assistants and answer engines
// (ChatGPT, Claude, Perplexity, Gemini, etc.) that fetch /llms.txt when
// asked about a company or its openings. See llmstxt.org for the emerging
// convention this follows. Kept as a dynamic route (not a static public/
// file) so it always reflects the current deployment's URL and live jobs.
export async function GET() {
  const siteUrl = configuredSiteUrl();
  const jobs = await readAdamJobs();

  const lines = [
    "# Extreme Group (אקסטרים)",
    "",
    "> Extreme Group is an Israeli technology recruiting company that also builds AI and automation solutions for organizations. It connects software, data, AI, DevOps/cloud, and cyber security talent with hiring companies across Israel's tech industry.",
    "",
    "## Key facts",
    "- Company: Extreme Group (אקסטרים)",
    "- Country: Israel",
    "- Address: טחנה 1, כפר סבא (Tachana 1, Kfar Saba)",
    "- Candidate contact: jobs@extreme.co.il",
    "- General contact: info@extreme.co.il",
    "- Services: technology recruiting, RPO (recruitment process outsourcing), AI & automation consulting for organizations",
    "- Candidates can apply with a single résumé upload (PDF/DOC/DOCX) — no account required",
    "",
    "## Key pages",
    `- Homepage: ${siteUrl}/`,
    `- Open positions: ${siteUrl}/experts`,
    `- Solutions for organizations: ${siteUrl}/solutions`,
    `- Career insights & articles: ${siteUrl}/insights`,
    `- Company vision: ${siteUrl}/vision`,
    `- Apply / submit a résumé: ${siteUrl}/intake?track=career`,
    `- Privacy policy: ${siteUrl}/privacy`,
    "",
    "## Job categories",
    ...jobCategories.map((category) => `- ${category.title}: ${siteUrl}/jobs/category/${category.slug}`),
    "",
    `## Currently open positions (${jobs.length})`,
    ...jobs.slice(0, 30).map((job) => `- ${job.title}${job.location ? ` — ${job.location}` : ""}: ${siteUrl}/jobs/${job.slug}`),
    "",
    "## Recent insights",
    ...insights.filter((insight) => !insight.isDraft).map((insight) => `- ${insight.title}: ${siteUrl}/insights/${insight.slug}`),
  ];

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
