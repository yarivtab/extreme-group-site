import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { insights } from "./data";

const articles = insights.filter((insight) => !insight.isDraft);
const featuredArticle = articles[0];
// The grid below the featured card must not repeat it — previously
// `articles` (including index 0) was reused directly in the grid, so with
// only one published article it appeared twice, identical, on the page.
const remainingArticles = articles.slice(1);

export default function InsightsPage() {
  return <main className="insights-page">
    <Header />
    <section className="insights-hero shell" aria-labelledby="insights-title">
      <div className="bilingual-head bilingual-head-hero"><h1 id="insights-title">תובנות על אנשים, <em>Data</em> והעבודה החדשה.</h1><p className="kicker">EXTREME INSIGHTS</p></div>
      <p>מאמרים מקוריים, מחקר, סקרים ושיחות שמחברים בין גיוס, טכנולוגיה והחלטות אנושיות טובות יותר.</p>
      <nav className="insight-topics" aria-label="נושאי תוכן"><a href="#latest">הכול</a><a href="#latest">Recruiting Intelligence</a><a href="#latest">AI ואוטומציה</a><a href="#latest">Data ומחקר</a><a href="#latest">קריירה וטאלנטים</a></nav>
    </section>

    {featuredArticle && <Link href={`/insights/${featuredArticle.slug}`} className="insight-feature shell" aria-label={`מאמר מוביל: ${featuredArticle.title}`}>
      <div className="insight-feature-art insight-feature-image">{featuredArticle.image && <img src={featuredArticle.image} alt={featuredArticle.imageAlt ?? ""} width="1600" height="900" />}<span aria-hidden="true">01</span></div>
      <div className="insight-feature-copy"><small>מאמר מוביל · {featuredArticle.type}</small><h2>{featuredArticle.title}</h2><p>{featuredArticle.description}</p><span>{featuredArticle.meta} · לקריאה ←</span></div>
    </Link>}

    {remainingArticles.length > 0 && <section className="insight-feed shell" id="latest" aria-labelledby="latest-title">
      <div className="insight-feed-head"><div className="bilingual-head"><h2 id="latest-title">מה אנחנו חושבים עכשיו</h2><p className="kicker">LATEST THINKING</p></div><span>{remainingArticles.length} מאמרים ותכנים</span></div>
      <div className="insight-editorial-grid">
        {remainingArticles.map((article, index) => <Link href={`/insights/${article.slug}`} className={`insight-entry entry-${index + 1}${article.image ? ` has-image ${index % 2 === 0 ? "image-left" : "image-right"}` : ""}`} key={article.title}>{article.image && <img className="insight-entry-image" src={article.image} alt={article.imageAlt ?? ""} width="1448" height="1086" />}<small>{article.type}</small><h3>{article.title}</h3><p>{article.meta}</p><span aria-hidden="true">↗</span></Link>)}
      </div>
    </section>}
    <Footer />
  </main>;
}
export const metadata: Metadata = {
  title: "תובנות על גיוס, AI וקריירה",
  description: "מאמרים מקוריים, מחקר וסקרים על Recruiting Intelligence, גיוס טכנולוגי, Data, AI וקריירה.",
  alternates: { canonical: "/insights" },
};
