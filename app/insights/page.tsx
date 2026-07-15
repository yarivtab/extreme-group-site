import Link from "next/link";
import { Footer, Header } from "../components";

const articles = [
  { type: "קריירה וטאלנטים", title: "קורות החיים בעולם ה־AI — השינוי שכבר אי אפשר להתעלם ממנו", meta: "מאמר · 6 דקות" },
  { type: "Recruiting Intelligence", title: "מה מגייסות באמת צריכות מ־AI?", meta: "מאמר דעה · בקרוב" },
  { type: "קריירה וטאלנטים", title: "מדוע שנעסיק אותך? דרך טובה יותר לענות על השאלה", meta: "מדריך · 4 דקות" },
  { type: "Data ומחקר", title: "מסינון להתאמה: איך Data משנה את שרשרת הגיוס", meta: "מחקר · בקרוב" },
  { type: "קריירה וטאלנטים", title: "מה לרשום בתקציר ה־Summary שלכם ב־LinkedIn?", meta: "מדריך · 5 דקות" },
];

export default function InsightsPage() {
  return <main className="insights-page">
    <Header />
    <section className="insights-hero shell" aria-labelledby="insights-title">
      <p className="kicker">EXTREME INSIGHTS</p>
      <h1 id="insights-title">תובנות על אנשים, <em>Data</em> והעבודה החדשה.</h1>
      <p>מאמרים מקוריים, מחקר, סקרים ושיחות שמחברים בין גיוס, טכנולוגיה והחלטות אנושיות טובות יותר.</p>
      <nav className="insight-topics" aria-label="נושאי תוכן"><a href="#latest">הכול</a><a href="#latest">Recruiting Intelligence</a><a href="#latest">AI ואוטומציה</a><a href="#latest">Data ומחקר</a><a href="#latest">קריירה וטאלנטים</a></nav>
    </section>

    <section className="insight-feature shell" aria-label="מאמר מוביל">
      <div className="insight-feature-art" aria-hidden="true"><span>01</span><b>HUMAN<br />× DATA</b><i /></div>
      <div className="insight-feature-copy"><small>מאמר מוביל · RECRUITING INTELLIGENCE</small><h2>כשמועמדים, ארגונים ו־Data נפגשים — כל תהליך הגיוס נראה אחרת.</h2><p>לא עוד שכבת AI מעל תהליך ישן. מבט על הדרך שבה מידע איכותי, אוטומציה והחלטה אנושית מתחברים למערכת אחת.</p><span>7 דקות קריאה · מאמר חדש</span></div>
    </section>

    <section className="insight-feed shell" id="latest" aria-labelledby="latest-title">
      <div className="insight-feed-head"><div><p className="kicker">LATEST THINKING</p><h2 id="latest-title">מה אנחנו חושבים עכשיו</h2></div><span>{articles.length} תכנים בסקיצה</span></div>
      <div className="insight-editorial-grid">
        {articles.map((article, index) => <article className={`insight-entry entry-${index + 1}`} key={article.title}><small>{article.type}</small><h3>{article.title}</h3><p>{article.meta}</p><span aria-hidden="true">↗</span></article>)}
        <article className="insight-entry insight-video"><small>VIDEO / בקרוב</small><div className="video-mark" aria-hidden="true">▶</div><h3>שיחה קצרה על AI, גיוס ומה עדיין חייב להישאר אנושי.</h3><p>וידאו · 08:40</p></article>
      </div>
    </section>

    <section className="exi-recommends shell">
      <img src="/exi-avatar.png" alt="אקסי" width="900" height="900" />
      <div><p className="kicker">EXI RECOMMENDS</p><h2>נקודת התחלה אחת, בלי רעש.</h2><p>בכל חודש אקסי תבחר מאמר, נתון או שיחה אחת שכדאי לקחת לעבודה.</p><Link href="/intake?track=career">ספרו לנו מה מעניין אתכם ←</Link></div>
    </section>
    <Footer />
  </main>;
}
