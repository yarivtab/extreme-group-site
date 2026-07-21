import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components";
import { getInsight, insights } from "../data";
import { configuredSiteUrl } from "../../seo";

/** Converts the site's display date format (DD.MM.YYYY) to ISO 8601 for structured data. */
function toIsoDate(value?: string) {
  const match = value?.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!match) return undefined;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function generateStaticParams() { return insights.filter((insight) => !insight.isDraft).map((insight) => ({ slug: insight.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const insight = getInsight((await params).slug);
  if (!insight || insight.isDraft) return {};
  return { title: insight.title, description: insight.description, alternates: { canonical: `/insights/${insight.slug}` }, robots: insight.isDraft ? { index: false, follow: true } : { index: true, follow: true }, openGraph: { title: insight.title, description: insight.description, type: "article", url: `/insights/${insight.slug}`, images: insight.image ? [{ url: insight.image, width: 1600, height: 900, alt: insight.imageAlt ?? insight.title }] : undefined }, twitter: insight.image ? { card: "summary_large_image", title: insight.title, description: insight.description, images: [insight.image] } : undefined };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const insight = getInsight((await params).slug);
  if (!insight || insight.isDraft) notFound();
  const moreInsights = insights.filter((item) => !item.isDraft && item.slug !== insight.slug);
  const siteUrl = configuredSiteUrl();
  const isoDate = toIsoDate(insight.publishedAt);
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.description,
    ...(insight.image ? { image: [`${siteUrl}${insight.image}`] } : {}),
    ...(isoDate ? { datePublished: isoDate, dateModified: isoDate } : {}),
    author: { "@type": "Organization", name: "Extreme Group", url: siteUrl },
    publisher: { "@type": "Organization", name: "Extreme Group", url: siteUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/insights/${insight.slug}` },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "דף הבית", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "תובנות", item: `${siteUrl}/insights` },
      { "@type": "ListItem", position: 3, name: insight.title, item: `${siteUrl}/insights/${insight.slug}` },
    ],
  };
  return <main className="article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article).replace(/</g, "\\u003c") }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
    <Header /><article><header className="article-hero"><div className="shell"><Link className="job-back" href="/insights">→ חזרה לכל התובנות</Link><p className="kicker">{insight.type}</p><h1>{insight.title}</h1><p>{insight.description}</p><div className="article-meta"><span>{insight.meta}</span><span>Extreme Insights</span><span>{insight.publishedAt ? `פורסם · ${insight.publishedAt}` : "פורסם"}</span></div></div></header>{insight.image && <figure className="article-cover shell"><img src={insight.image} alt={insight.imageAlt ?? ""} width="1600" height="900" /></figure>}<div className="article-layout shell"><aside><strong>במאמר הזה</strong>{insight.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.title}>0{index + 1} · {section.title}</a>)}</aside><div className="article-body"><p className="article-intro">{insight.intro}</p>{insight.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.title}><span>0{index + 1}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<section className="article-takeaways"><p className="kicker">TAKEAWAYS</p><h2>מה לקחת מכאן</h2><ul>{insight.takeaways.map((item) => <li key={item}>{item}</li>)}</ul><Link className="article-career-link" href="/experts">למשרות הפתוחות ב־Extreme ←</Link></section>{insight.sources && <section className="article-sources"><p className="kicker">SOURCES</p><h2>מקורות וקריאה נוספת</h2><ul>{insight.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a></li>)}</ul></section>}</div></div></article>{moreInsights.length > 0 && <section className="article-next shell"><h2>להמשיך לחשוב</h2><div>{moreInsights.map((item) => <Link href={`/insights/${item.slug}`} key={item.slug}><small>{item.type}</small><strong>{item.title}</strong><span>לקריאה ←</span></Link>)}</div></section>}<Footer /></main>;
}
