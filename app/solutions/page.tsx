import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";

export const metadata: Metadata = { title: "פתרונות לארגונים", description: "גיוס טכנולוגי ופרויקטי AI, אוטומציה ו־IT שמייצרים תוצאות עסקיות." };

export default function SolutionsPage() {
  return <main><Header />
    <section className="inner-hero shell"><div className="bilingual-head bilingual-head-hero"><h1>פחות זמן בחיפוש.<br />יותר זמן <em>בתנועה.</em></h1><p className="kicker">FOR ORGANIZATIONS</p></div><p>כשחסר טאלנט, כשצריך להרחיב capacity או כשפרויקט טכנולוגי חייב לקרות — אנחנו מחברים צורך עסקי לתוצאה, בדרך אחת ברורה.</p><div className="actions"><Link className="button primary" href="/intake">קבלו פרטים <span>←</span></Link><Link className="button secondary" href="/intake?track=talent">שלחו פרופיל משרה</Link></div></section>

    <section className="split-feature">
      <div className="talent-half" id="talent"><p className="kicker light">01 / Talent</p><h2>מגייסים את היכולת<br />להתקדם.</h2><p>לא מאגר קורות חיים — תהליך מיקוד שמבין את התפקיד, את הצוות ואת הסביבה שבה האדם צריך להצליח.</p><ul><li>גיוס ממוקד לתפקידי פיתוח, דאטה, DevOps, מוצר וסייבר</li><li>הרחבת צוותים ומומחים לפרויקטים</li><li>מיקור חוץ גמיש עם ניהול ושקיפות</li><li>מיפוי שוק וייעוץ לתהליך הגיוס</li></ul><Link className="button lime" href="/intake?track=talent">שלחו פרופיל משרה <span>←</span></Link></div>
      <div className="tech-half" id="technology"><p className="kicker">02 / Technology</p><h2>בונים מערכת.<br />לא עוד מצגת AI.</h2><p>מתרגמים תהליך ידני, צוואר בקבוק או הזדמנות עסקית לפתרון שעובד בתוך הארגון ומתחבר למה שכבר קיים.</p><ul><li>סוכני AI ויישומי GenAI ארגוניים</li><li>אוטומציה של תהליכים תפעוליים</li><li>אינטגרציות, דאטה ומודרניזציה</li><li>Discovery, פיילוט, הטמעה והרחבה</li></ul><Link className="button primary" href="/intake?track=project">פתחו בקשה לפרויקט <span>←</span></Link></div>
    </section>

    <section className="section shell"><div className="section-heading horizontal"><div className="bilingual-head"><h2>תוצאה שאפשר<br />לראות ולמדוד.</h2><p className="kicker">WHAT YOU GET</p></div><p>הפורמט משתנה לפי האתגר, אבל עקרונות העבודה נשארים: בעלות, בהירות, קצב ויכולת להמשיך קדימה.</p></div><div className="outcomes"><article className="outcome-card"><span>01 / FOCUS</span><h3>הגדרה חדה</h3><p>מיישרים את הבעיה, היעד והמדדים לפני שמתחילים לרוץ.</p></article><article className="outcome-card"><span>02 / DELIVERY</span><h3>צוות שמספק</h3><p>האנשים והיכולות הנכונים, עם בעלות ברורה על התוצאה.</p></article><article className="outcome-card"><span>03 / MOMENTUM</span><h3>קצב שאפשר להרגיש</h3><p>אבני דרך קצרות, שקיפות מלאה וערך שמגיע מוקדם.</p></article></div></section>

    <section className="section process-section"><div className="shell"><div className="section-heading horizontal"><div className="bilingual-head"><h2>מקצרים מרחק<br />בין צורך לתוצאה.</h2><p className="kicker">HOW WE WORK</p></div><Link className="text-link" href="/intake">מתחילים בשיחה קצרה <span>←</span></Link></div><ol className="process-list"><li><span>01</span><div><h3>Discovery ממוקד</h3><p>מבינים את ההקשר העסקי והטכנולוגי, לא רק את רשימת הדרישות.</p></div></li><li><span>02</span><div><h3>מסלול מותאם</h3><p>גיוס, צוות, פרויקט או שילוב ביניהם — בלי לדחוף פורמט קבוע.</p></div></li><li><span>03</span><div><h3>התחלה מהירה</h3><p>תוכנית, אנשים ואבני דרך שאפשר לצאת איתן לדרך.</p></div></li><li><span>04</span><div><h3>שיפור מתמשך</h3><p>מודדים, לומדים ומרחיבים רק כשיש ערך ברור.</p></div></li></ol></div></section>
    <section className="final-cta"><div className="shell"><div className="bilingual-head"><h2>אתם מביאים את האתגר.<br /><em>אנחנו נביא את הדרך.</em></h2><p className="kicker light">NEXT STEP</p></div><div className="actions"><Link className="button lime" href="/intake">קבלו פרטים <span>←</span></Link><Link className="button ghost-light" href="/intake?track=talent">שלחו פרופיל משרה</Link></div></div></section><Footer />
  </main>;
}
