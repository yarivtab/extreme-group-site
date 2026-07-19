import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { insights } from "./data";

const articles = [
  ...insights,
  { type: "קריירה וטאלנטים", title: "מדוע שנעסיק אותך? דרך טובה יותר לענות על השאלה", meta: "מדריך · 4 דקות" },
  { type: "קריירה וטאלנטים", title: "מה לרשום בתקציר ה־Summary שלכם ב־LinkedIn?", meta: "מדריך · 5 דקות" },
];

export default function InsightsPage() {
  return <main className="insights-page">
    <Header />
    <section className="insights-hero shell" aria-labelledby="insights-title">
      <div className="bilingual-head bilingual-head-hero"><h1 id="insights-title">תובנות על אנשים, <em>Data</em> והעבודה החדשה.</h1><p className="kicker">EXTREME INSIGHTS</p></div>
      <p>מאמרים מקוריים, מחקר, סקרים ושיחות שמחברים בין גיוס, טכנולוגיה והחלטות אנושיות טובות יותר.</p>
      <nav className="insight-topics" aria-label="נושאי תוכן"><a href="#latest">הכול</a><a href="#latest">Recruiting Intelligence</a><a href="#latest">AI ואוטומציה</a><a href="#latest">Data ומחקר</a><a href="#latest">קריירה וטאלנטים</a></nav>
    </section>

    <section className="insight-feature shell" aria-label="מאמר מוביל">
      <div className="insight-feature-art insight-feature-image"><img src="/insights-feature-human-data.png" alt="מנהלת טאלנט ומועמד בשיחה המבוססת על תובנות Data" width="1448" height="1086" /><span aria-hidden="true">01</span></div>
      <div className="insight-feature-copy"><small>מאמר מוביל · RECRUITING INTELLIGENCE</small><h2>כשמועמדים, ארגונים ו־Data נפגשים — כל תהליך הגיוס נראה אחרת.</h2><p>לא עוד שכבת AI מעל תהליך ישן. מבט על הדרך שבה מידע איכותי, אוטומציה והחלטה אנושית מתחברים למערכת אחת.</p><span>7 דקות קריאה · מאמר חדש</span></div>
    </section>

    <section className="insight-feed shell" id="latest" aria-labelledby="latest-title">
      <div className="insight-feed-head"><div className="bilingual-head"><h2 id="latest-title">מה אנחנו חושבים עכשיו</h2><p className="kicker">LATEST THINKING</p></div><span>{articles.length} מאמרים ותכנים</span></div>
      <div className="insight-editorial-grid">
        {articles.map((article, index) => "slug" in article ? <Link href={`/insights/${article.slug}`} className={`insight-entry entry-${index + 1}${article.image ? " has-image" : ""}`} key={article.title}>{article.image && <img className="insight-entry-image" src={article.image} alt="" width="1448" height="1086" />}<small>{article.type}</small><h3>{article.title}</h3><p>{article.meta}</p><span aria-hidden="true">↗</span></Link> : <article className={`insight-entry entry-${index + 1}`} key={article.title}><small>{article.type}</small><h3>{article.title}</h3><p>{article.meta}</p><span aria-hidden="true">בקרוב</span></article>)}
        <article className="insight-entry insight-video"><img className="insight-video-image" src="/insights-video-conversation.png" alt="שיחה מצולמת בין מנהלת משאבי אנוש למייסד טכנולוגי" width="1086" height="1448" /><small>VIDEO / בקרוב</small><div className="video-mark" aria-hidden="true">▶</div><h3>שיחה קצרה על AI, גיוס ומה עדיין חייב להישאר אנושי.</h3><p>וידאו · 08:40</p></article>
      </div>
    </section>

    <section className="exi-recommends shell">
      <img src="/exi-avatar.png" alt="אקסי" width="900" height="900" />
      <div><div className="bilingual-head bilingual-head-compact"><h2>נקודת התחלה אחת, בלי רעש.</h2><p className="kicker">EXI RECOMMENDS</p></div><p>בכל חודש אקסי תבחר מאמר, נתון או שיחה אחת שכדאי לקחת לעבודה.</p><Link href="/intake?track=career">ספרו לנו מה מעניין אתכם ←</Link></div>
    </section>
    <Footer />
  </main>;
}
export const metadata: Metadata = {
  title: "תובנות על גיוס, AI וקריירה",
  description: "מאמרים מקוריים, מחקר וסקרים על Recruiting Intelligence, גיוס טכנולוגי, Data, AI וקריירה.",
  alternates: { canonical: "/insights" },
};
