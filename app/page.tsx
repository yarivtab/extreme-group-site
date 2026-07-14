import Link from "next/link";
import { Footer, Header } from "./components";

const examples = [
  { code: "AI / OPS", title: "סוכן AI לשירות ותפעול", detail: "פחות טיפול ידני, יותר רציפות", track: "project" },
  { code: "DATA / TEAM", title: "צוות Data למשימה קריטית", detail: "היכולת הנכונה, בזמן הנכון", track: "talent" },
  { code: "AUTO / FLOW", title: "אוטומציה חוצת מערכות", detail: "פחות העתקות, פחות טעויות", track: "project" },
];

export default function Home() {
  return (
    <main className="compact-home">
      <Header />

      <div className="signal-strip shell" aria-label="עיקרי השירות">
        <span><strong>2</strong> מסלולי ליבה</span>
        <span><strong>1</strong> שותף אחד</span>
        <span><strong>≤ 1</strong> יום עסקים למענה</span>
      </div>

      <section className="compact-hero shell" aria-labelledby="hero-title">
        <p className="eyebrow"><span /> אנשים · AI · אוטומציה</p>
        <h1 id="hero-title">האנשים והטכנולוגיה<br />שמקדמים את <em>העסק.</em></h1>
        <p>Extreme Group מחברת ארגונים לטאלנט טכנולוגי ולפתרונות AI ואוטומציה — משלב הצורך ועד לתוצאה עובדת.</p>
        <div className="actions">
          <Link className="button primary" href="/intake">ספרו לנו מה צריך <span>←</span></Link>
          <Link className="button secondary" href="/solutions">לכל הפתרונות</Link>
        </div>
      </section>

      <section className="trust-band compact-trust">
        <div className="shell trust-grid">
          <p>שותפים לארגונים מובילים בישראל</p>
          <div className="logo-row" aria-label="לקוחות נבחרים">
            <img src="/client-philips.png" alt="Philips" />
            <img src="/client-ceva.png" alt="CEVA" />
            <img src="/client-qualcomm.png" alt="Qualcomm" />
            <img src="/client-pepper.png" alt="Pepper" />
            <img src="/client-biosense.png" alt="Biosense Webster" />
          </div>
        </div>
      </section>

      <section className="compact-section shell" id="solutions">
        <div className="compact-heading">
          <p className="kicker">מה צריך לקדם?</p>
          <h2>שתי דרכים. יעד אחד.</h2>
        </div>
        <div className="compact-solutions">
          <Link href="/solutions#talent" className="compact-solution">
            <span>01 / TALENT</span>
            <h3>לגייס את האנשים הנכונים</h3>
            <p>לתפקיד אחד, צוות חדש או חיזוק זמני.</p>
            <b>לגיוס טכנולוגי ←</b>
          </Link>
          <Link href="/solutions#technology" className="compact-solution accent">
            <span>02 / TECHNOLOGY</span>
            <h3>להפוך תהליך לפתרון עובד</h3>
            <p>AI, אוטומציה ואינטגרציות שמייצרות ערך.</p>
            <b>לפתרונות טכנולוגיים ←</b>
          </Link>
        </div>
      </section>

      <section className="compact-examples">
        <div className="shell">
          <div className="compact-heading inline">
            <div><p className="kicker">דוגמאות מהשטח</p><h2>מתחילים מהמשימה.</h2></div>
            <p>לא מחבילת שירותים. ממה שצריך לקרות עכשיו.</p>
          </div>
          <div className="example-list">
            {examples.map((example, index) => (
              <Link key={example.code} href={`/intake?track=${example.track}`}>
                <span>0{index + 1}</span>
                <small>{example.code}</small>
                <h3>{example.title}</h3>
                <p>{example.detail}</p>
                <b>←</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="compact-final shell" id="careers">
        <div>
          <p className="kicker">לארגונים</p>
          <h2>יש יעד שצריך לקדם?</h2>
          <Link className="button primary" href="/intake">בואו נדבר <span>←</span></Link>
        </div>
        <div>
          <p className="kicker">לאנשי טכנולוגיה</p>
          <h2>מחפשים את הדבר הבא?</h2>
          <Link className="button secondary" href="/intake?track=career">שלחו קורות חיים <span>←</span></Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
