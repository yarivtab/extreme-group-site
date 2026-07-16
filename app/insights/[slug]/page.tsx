import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components";
import { getInsight, insights } from "../data";

export function generateStaticParams() { return insights.map((insight) => ({ slug: insight.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const insight = getInsight((await params).slug);
  if (!insight) return {};
  return { title: insight.title, description: insight.description, alternates: { canonical: `/insights/${insight.slug}` }, robots: insight.isDraft ? { index: false, follow: true } : { index: true, follow: true }, openGraph: { title: insight.title, description: insight.description, type: "article", url: `/insights/${insight.slug}` } };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const insight = getInsight((await params).slug);
  if (!insight) notFound();
  return <main className="article-page"><Header /><article><header className="article-hero"><div className="shell"><Link className="job-back" href="/insights">→ חזרה לכל התובנות</Link><p className="kicker">{insight.type}</p><h1>{insight.title}</h1><p>{insight.description}</p><div className="article-meta"><span>{insight.meta}</span><span>Extreme Insights</span><span>טיוטת מערכת</span></div></div></header>{insight.image && <figure className="article-cover shell"><img src={insight.image} alt="" width="1448" height="1086" /></figure>}<div className="article-layout shell"><aside><strong>במאמר הזה</strong>{insight.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.title}>0{index + 1} · {section.title}</a>)}</aside><div className="article-body"><p className="article-intro">{insight.intro}</p>{insight.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.title}><span>0{index + 1}</span><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<section className="article-takeaways"><p className="kicker">TAKEAWAYS</p><h2>מה לקחת מכאן</h2><ul>{insight.takeaways.map((item) => <li key={item}>{item}</li>)}</ul></section></div></div></article><section className="article-next shell"><h2>להמשיך לחשוב</h2><div>{insights.filter((item) => item.slug !== insight.slug).map((item) => <Link href={`/insights/${item.slug}`} key={item.slug}><small>{item.type}</small><strong>{item.title}</strong><span>לקריאה ←</span></Link>)}</div></section><Footer /></main>;
}
