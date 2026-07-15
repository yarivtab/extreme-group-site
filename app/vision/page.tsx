import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";

export const metadata: Metadata = {
  title: "החזון שלנו",
  description: "החזון והמשימה של Extreme: לחבר אנשים, Data וטכנולוגיה כדי להפוך את הגיוס למדויק, מהיר ואנושי יותר.",
};

const missionPillars = [
  { number: "01", title: "מבינים את הצורך", text: "מתחילים בתפקיד, בצוות ובסביבה שבה האדם צריך להצליח — לא רק ברשימת דרישות." },
  { number: "02", title: "מפעילים Intelligence", text: "Data איכותי, מודלי AI ומיפוי שוק יוצרים תמונה מדויקת ומצמצמים רעש." },
  { number: "03", title: "מייצרים תנועה", text: "אוטומציה מקצרת פעולות ידניות ומקדמת את האנשים הנכונים בזמן הנכון." },
  { number: "04", title: "משאירים את ההחלטה אנושית", text: "הטכנולוגיה מספקת הקשר וביטחון. אנשים בוחרים אנשים." },
];

export default function VisionPage() {
  return <main className="vision-page">
    <Header />

    <section className="vision-hero">
      <div className="shell">
        <p className="kicker">OUR VISION</p>
        <h1>בונים את שכבת ה־Intelligence<br /><em>שמחברת אנשים להזדמנויות.</em></h1>
        <div className="vision-hero-copy"><p>החזון שלנו הוא עולם עבודה מדויק, מהיר ואנושי יותר — שבו כל ארגון יכול להגיע לאנשים הנכונים, וכל אדם יכול להגיע להזדמנות שבה יוכל להצליח.</p><span>AI‑NATIVE<br />HUMAN‑LED</span></div>
      </div>
    </section>

    <section className="vision-graphic" aria-labelledby="vision-graphic-title">
      <div className="shell vision-graphic-head"><p className="kicker">THE INTELLIGENCE LAYER</p><h2 id="vision-graphic-title">לא עוד כלי AI.<br />מערכת שלמה שעובדת יחד.</h2></div>
      <div className="shell vision-network" aria-label="Data, מודלי AI ואוטומציה מחזקים החלטות אנושיות ומייצרים התאמה מדויקת">
        <div className="vision-node node-data"><span>01</span><strong>Quality Data</strong><small>שוק · ניסיון · יכולות</small></div>
        <div className="vision-node node-models"><span>02</span><strong>AI Models</strong><small>זיהוי · דירוג · הקשר</small></div>
        <div className="vision-node node-automation"><span>03</span><strong>Automation</strong><small>תנועה · מהירות · רציפות</small></div>
        <div className="vision-core"><small>HUMAN</small><strong>שיקול דעת</strong><span>אנשים בוחרים אנשים</span></div>
        <div className="vision-output"><small>OUTPUT / 01</small><strong>החיבור הנכון</strong><span>ארגון × טאלנט × הזדמנות</span></div>
        <i className="signal-one" /><i className="signal-two" /><i className="signal-three" />
      </div>
    </section>

    <section className="vision-mission shell" aria-labelledby="mission-title">
      <div className="vision-mission-intro"><div><p className="kicker">OUR MISSION</p><h2 id="mission-title">לבנות Recruiting Intelligence Network שמקצר את הדרך בין צורך ארגוני לטאלנט המתאים.</h2></div><p>אנחנו משלבים Data איכותי, מודלי AI, אוטומציה ומומחיות אנושית כדי לייעל את כל שרשרת הגיוס — מהבנת הצורך ומיפוי השוק, דרך איתור והתאמה, ועד לקליטה ולהתקדמות מקצועית.</p></div>
      <div className="vision-pillars">{missionPillars.map((pillar) => <article key={pillar.number}><span>{pillar.number}</span><h3>{pillar.title}</h3><p>{pillar.text}</p></article>)}</div>
    </section>

    <section className="founder-story" aria-labelledby="founder-story-title">
      <div className="shell founder-story-head"><p className="kicker">OUR FOUNDING STORY</p><h2 id="founder-story-title">למה הקמנו את Extreme —<br />ולמה אנחנו בונים אותה מחדש.</h2></div>
      <div className="shell founder-path" aria-label="המסע של Extreme מחברת תוכנה ל־AI-Native Recruiting Intelligence">
        <div><span>01</span><strong>Software</strong><small>פרויקטי פיתוח</small></div>
        <i>←</i>
        <div><span>02</span><strong>Talent</strong><small>מומחים טכנולוגיים</small></div>
        <i>←</i>
        <div><span>03</span><strong>Startups</strong><small>יזמות וניסיון מהשטח</small></div>
        <i>←</i>
        <div className="active"><span>04</span><strong>Intelligence</strong><small>Data · AI · Automation</small></div>
      </div>
      <div className="shell founder-story-body">
        <article>
          <p>Extreme הוקמה כחברת תוכנה שמחברת בין שני עולמות: היכולת לבנות ולהוציא לפועל פרויקטי פיתוח מורכבים, והיכולת לאתר ולגייס את האנשים הטכנולוגיים הנכונים כדי לגרום להם לקרות.</p>
          <p>יזמות תמיד הייתה חלק מה־DNA שלנו. במהלך הדרך יצאנו, המייסדים, לתקופות שבהן הקמנו והובלנו חברות סטארט־אפ — ואז חזרנו ל־Extreme עם ניסיון חדש, נקודת מבט רחבה יותר והבנה עמוקה של האתגרים שאיתם מתמודדים ארגונים טכנולוגיים.</p>
          <p>התפתחות ה־AI יצרה עבורנו רגע של הבנה: כדי ש־AI יהיה משמעותי, הוא זקוק ל־Data איכותי, להקשר מקצועי ולידע אנושי אמיתי. במשך שנים אנחנו עובדים עם מומחים בתעשייה, מלווים ארגונים ועוקבים אחר השינויים בשוק. הידע המצטבר וה־Data המקצועי שנבנה לאורך הדרך מאפשרים לנו לעזור ללקוחות לקבל החלטות טובות יותר לגבי הנכס החשוב ביותר שלהם — האנשים.</p>
          <p>אנחנו לא מבקשים רק לשפר את תהליך הגיוס הקיים. אנחנו רוצים לבנות מחדש את הדרך שבה ארגונים ואנשים מוצאים זה את זה, מבינים התאמה ומתקדמים יחד.</p>
          <div className="founder-signature"><strong>מייסד Extreme</strong><span>על החברה שאנחנו בונים עכשיו</span></div>
        </article>
        <aside><small>WHAT EXCITES US</small><blockquote>ה־AI הוא המנוע,<br />ה־Data הוא התשתית —<br /><em>אבל האנשים הם הסיבה שבגללה אנחנו בונים.</em></blockquote><p>מה שמרגש אותנו הוא החיבור בין חדשנות לבין תהליכים ותיקים שזקוקים לשינוי רדיקלי כדי להתאים לכלכלה המודרנית.</p></aside>
      </div>
    </section>

    <section className="vision-belief">
      <div className="shell"><p className="kicker">WHAT WE BELIEVE</p><blockquote>העתיד של הגיוס לא יהיה פחות אנושי.<br /><em>הוא יהיה אנושי — עם Intelligence טוב יותר.</em></blockquote><div><span>פחות זמן בחיפוש</span><span>פחות רעש בתהליך</span><span>יותר חיבורים שמצליחים</span></div><Link className="button primary" href="/solutions">איך אנחנו עובדים עם ארגונים <span>←</span></Link></div>
    </section>

    <Footer />
  </main>;
}
