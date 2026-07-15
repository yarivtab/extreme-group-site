import Link from "next/link";
import { Footer, Header } from "./components";

const reasons = [
  ["מיקוד בטכנולוגיה ופינטק", "ניסיון עם חברות הייטק, פינטק, מדיקל וסטארטאפים בצמיחה."],
  ["Coretado.ai כמנוע פנימי", "AI שמאיץ איתור, התאמה ותיאום — כחלק מהשירות, לא כמוצר נפרד."],
  ["מודל שמתאים לצורך", "השמה, Outsourcing, צוות ייעודי או פרויקט טכנולוגי מלא."],
  ["תהליך שקוף ומדיד", "זמן לאיוש, איכות התאמה ורמת ביצוע לאורך כל הדרך."],
];

const steps = [
  ["01", "מבינים את ההקשר", "מגדירים את הבעיה, התפקיד או הפרויקט ואת מדדי ההצלחה."],
  ["02", "ממפים טאלנט ופתרון", "משלבים את Coretado.ai עם ניסיון השטח כדי לבנות את המודל הנכון."],
  ["03", "מפעילים ומלווים", "יוצאים לדרך עם בעלות ברורה, מדדים וליווי עד לתוצאה."],
];

export default function Home() {
  return (
    <main className="b2b-home">
      <Header />

      <section className="b2b-hero shell" aria-labelledby="hero-title">
        <p className="eyebrow"><span /> SMART TECH + TALENT</p>
        <h1 id="hero-title">Service as a Software לטאלנט וטכנולוגיה.</h1>
        <p>Extreme מחברת בין מומחי טכנולוגיה מובילים לארגונים, ומשלבת צוותים מנוסים עם מנועי AI חכמים. מגיוס מדויק ועד פרויקטי AI ואוטומציה מקצה לקצה.</p>
        <div className="actions">
          <Link className="button primary" href="/intake">דברו איתנו על פתרון <span>←</span></Link>
          <Link className="b2b-text-link" href="/jobs">צפייה במשרות פתוחות</Link>
        </div>
      </section>

      <section className="b2b-proof" aria-label="תחומי הליבה">
        <div className="shell">
          <div><small>01</small><strong>TECH TALENT</strong><span>מומחים וצוותים ייעודיים</span></div>
          <div><small>02</small><strong>SMART TECH</strong><span>AI, אוטומציה ו־Data</span></div>
          <div><small>03</small><strong>CORETADO.AI</strong><span>מנוע פנימי שמאיץ delivery</span></div>
        </div>
      </section>

      <section className="b2b-section shell" id="why">
        <div className="b2b-section-head">
          <p className="kicker">למה Extreme</p>
          <h2>שותף טאלנט וטכנולוגיה.<br />לא עוד חברת השמה.</h2>
          <p>אנחנו לא מוכרים שעות או קורות חיים. אנחנו בונים פתרון שמייצר תוצאה עסקית ברורה: צוות מתאים, תהליך מהיר יותר ו־delivery שאפשר למדוד.</p>
        </div>
        <div className="reason-list">
          {reasons.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="b2b-solutions" id="solutions">
        <div className="shell">
          <div className="b2b-section-head compact"><p className="kicker">שני פתרונות מרכזיים</p><h2>מה צריך לקדם?</h2></div>
          <div className="solution-pair">
            <article>
              <span>01 / TALENT</span>
              <h3>גיוס טכנולוגי חכם וצוותים ייעודיים</h3>
              <p>בונים צוותי פיתוח, DevOps, Data, Cyber ומוצר — בהשמה, Outsourcing, RPO או מודל פרויקטלי.</p>
              <ul><li>Mid עד VP</li><li>מודלים גמישים לפי הצורך</li><li>פחות רעש, יותר מועמדים רלוונטיים</li></ul>
              <Link href="/intake?track=talent">דברו איתנו על צוות מתאים <span>←</span></Link>
            </article>
            <article>
              <span>02 / SMART TECH</span>
              <h3>פרויקטי AI, אוטומציה ו־Data</h3>
              <p>מובילים פרויקטים מבדיקת היתכנות ועד delivery בפועל, עם מומחים מנוסים וטכנולוגיה מתקדמת.</p>
              <ul><li>AI ו־Machine Learning</li><li>אוטומציה לתהליכים עסקיים</li><li>Data Engineering ואינטגרציות</li></ul>
              <Link href="/intake?track=project">קבלו הצעת פתרון <span>←</span></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="b2b-process shell" id="process">
        <div className="b2b-section-head compact"><p className="kicker">איך זה עובד</p><h2>תהליך אחד, בלי חיכוך.</h2></div>
        <div className="step-row">
          {steps.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>

      <section className="b2b-metrics" id="coretado">
        <div className="shell metric-layout">
          <div><p className="kicker light">מדידה מהיום הראשון</p><h2>תוצאה שאפשר<br />לראות ולנהל.</h2></div>
          <div className="metric-list">
            <div><strong>זמן לאיוש</strong><span>מהבריף למועמד המתאים</span></div>
            <div><strong>איכות התאמה</strong><span>משוב מנהלים וצוותים</span></div>
            <div><strong>רמת ביצוע</strong><span>אבני דרך ותוצאות delivery</span></div>
          </div>
        </div>
      </section>

      <section className="b2b-contact shell" id="contact">
        <div>
          <p className="kicker">תיבת דיאלוג אחת</p>
          <h2>מה אתם צריכים<br />לקדם עכשיו?</h2>
          <p>כתבו לנו במשפט חופשי. נחבר את האדם הנכון ונחזור עם כיוון ממוקד.</p>
        </div>
        <form action="/intake" method="get">
          <label>סוג הפנייה<select name="track" defaultValue="talent"><option value="talent">גיוס טאלנט</option><option value="project">פרויקט טכנולוגי</option><option value="general">שאלה כללית</option></select></label>
          <label>מה תרצו להשיג?<textarea name="need" required placeholder="לדוגמה: צריך לבנות צוות Data תוך רבעון..." /></label>
          <button className="button primary" type="submit">שליחת פנייה ל־Extreme <span>←</span></button>
        </form>
      </section>

      <Footer />
    </main>
  );
}
