import Link from "next/link";
import { Footer, Header } from "./components";

const jobs = [
  { title: "Senior Full‑Stack", meta: "תל אביב · היברידי" },
  { title: "AI Automation Lead", meta: "מרכז · היברידי" },
  { title: "DevOps Engineer", meta: "שרון · היברידי" },
];

const insights = [
  ["גיוס טכנולוגי", "איך מקצרים גיוס בלי להתפשר על הדיוק"],
  ["AI בארגון", "מה הופך תהליך אוטומציה לפרויקט שמייצר ערך"],
  ["מגמות", "הצוות הטכנולוגי החדש: ליבה פנימית ומומחיות מבחוץ"],
];

const missions = [
  { code: "AI / OPS", title: "סוכן AI לשירות ותפעול", body: "מסכם פניות, מסווג משימות, מציע תשובה ומעדכן את המערכות שכבר עובדות בארגון.", result: "פחות עבודה ידנית · יותר רציפות", track: "project" },
  { code: "DATA / TEAM", title: "צוות Data למשימה קריטית", body: "מומחי Data Engineering, Analytics ו־ML שמתחברים לצוות קיים סביב יעד ברור.", result: "היכולת הנכונה · בלי להעמיס מבנה", track: "talent" },
  { code: "AUTO / FLOW", title: "אוטומציה חוצת מערכות", body: "תהליך אחד שמחבר CRM, ERP, מסמכים ואישורים — עם בקרה אנושית בנקודות הנכונות.", result: "פחות העתקות · פחות טעויות", track: "project" },
  { code: "TECH / ROLE", title: "גיוס לתפקיד שקשה לאייש", body: "מגדירים מחדש את פרופיל ההצלחה ומגיעים למועמדים שמתאימים גם לטכנולוגיה וגם לצוות.", result: "חיפוש ממוקד · החלטה בטוחה", track: "talent" },
];

export default function Home() {
  return (
    <main>
      <Header />

      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span /> טכנולוגיה שעובדת בשביל העסק</p>
          <h1 id="hero-title">אנשים וטכנולוגיה<br />שמזיזים ארגונים<br /><em>קדימה.</em></h1>
          <p className="hero-lede">Extreme Group הופכת גיוס טכנולוגי ופרויקטי AI, אוטומציה ו־IT לאוטומטיים יותר, מדויקים יותר, מהירים יותר — ובעיקר נוחים יותר.</p>
          <div className="hero-stats" aria-label="נתוני פעילות"><div><strong>2</strong><span>מסלולי ליבה</span></div><div><strong>1</strong><span>כתובת אחת</span></div><div><strong>≤ 1</strong><span>יום עסקים למענה</span></div></div>
          <div className="actions">
            <Link className="button primary" href="/intake">קבלו פרטים <span>←</span></Link>
            <Link className="button secondary" href="/intake?track=career">שלחו קורות חיים</Link>
          </div>
          <Link className="text-link" href="#careers">או צפו במשרות הפתוחות <span>↙</span></Link>
        </div>
      </section>

      <section className="trust-band">
        <div className="shell trust-grid">
          <p>שותפים לצמיחה של ארגונים מובילים בישראל</p>
          <div className="logo-row" aria-label="לקוחות נבחרים"><img src="/client-philips.png" alt="Philips" /><img src="/client-ceva.png" alt="CEVA" /><img src="/client-qualcomm.png" alt="Qualcomm" /><img src="/client-pepper.png" alt="Pepper" /><img src="/client-biosense.png" alt="Biosense Webster" /></div>
        </div>
      </section>

      <section className="section shell" id="solutions">
        <div className="section-heading">
          <p className="kicker">מה אנחנו עושים</p>
          <h2>שני מסלולים.<br />שותף אחד שאפשר לסמוך עליו.</h2>
          <p>מהאנשים הנכונים ועד למערכת הנכונה — בוחרים את הדרך שמתאימה לאתגר, ומתקדמים.</p>
        </div>
        <div className="service-grid">
          <article className="service-card dark-card">
            <span className="card-index">01 / TALENT</span>
            <div>
              <h3>גיוס טכנולוגי<br />שמדבר תוצאות</h3>
              <p>מאתרים, מסננים ומחברים אתכם לטאלנט המדויק — לתפקיד בודד, צוות שלם או חיזוק זמני.</p>
              <ul><li>גיוס לתפקידי פיתוח, דאטה ותשתיות</li><li>הרחבת צוותים ומיקור חוץ</li><li>תהליך קצר, שקוף וממוקד</li></ul>
            </div>
            <Link href="/solutions#talent" className="card-link">לפתרונות הגיוס <span>←</span></Link>
          </article>
          <article className="service-card light-card">
            <span className="card-index">02 / TECHNOLOGY</span>
            <div>
              <h3>פרויקטי AI<br />שעובדים בעולם האמיתי</h3>
              <p>מתכננים ומקימים פתרונות AI, אוטומציה ו־IT שמורידים עומס, מחברים מערכות ומייצרים ערך מדיד.</p>
              <ul><li>סוכני AI ותהליכי אוטומציה</li><li>אינטגרציות ומודרניזציה</li><li>מהיתכנות ועד הטמעה</li></ul>
            </div>
            <Link href="/solutions#technology" className="card-link">לפתרונות הטכנולוגיים <span>←</span></Link>
          </article>
        </div>
      </section>

      <section className="missions-section">
        <div className="shell">
          <div className="section-heading horizontal">
            <div><p className="kicker light">משימות, לא באזז</p><h2>מה צריך לקרות<br />אצלכם עכשיו?</h2></div>
            <p>מתחילים מתוצאה עסקית קונקרטית. האנשים, המערכת או השילוב ביניהם מגיעים אחר כך.</p>
          </div>
          <div className="mission-grid">
            {missions.map((mission, index) => <Link key={mission.code} href={`/intake?track=${mission.track}`} className="mission-card">
              <div className="mission-top"><span>0{index + 1}</span><small>{mission.code}</small></div>
              <h3>{mission.title}</h3><p>{mission.body}</p>
              <div className="mission-result"><span>{mission.result}</span><b>↙</b></div>
            </Link>)}
          </div>
        </div>
      </section>

      <section className="early-intake shell">
        <div>
          <p className="kicker">אפשר להתחיל קטן</p>
          <h2>רוצים לבדוק התאמה?</h2>
          <p>שלושה פרטים, ואנחנו כבר נדע לכוון את השיחה.</p>
        </div>
        <form action="/intake" method="get" className="quick-form">
          <label><span>שם</span><input name="name" placeholder="איך קוראים לך?" /></label>
          <label><span>חברה</span><input name="company" placeholder="איפה עובדים?" /></label>
          <label><span>מה מחפשים</span><select name="track" defaultValue=""><option value="" disabled>בחרו מסלול</option><option value="talent">גיוס טכנולוגי</option><option value="project">פרויקט AI / אוטומציה</option><option value="other">עוד לא בטוחים</option></select></label>
          <button className="button primary" type="submit">קבלו פרטים <span>←</span></button>
        </form>
      </section>

      <section className="section value-section">
        <div className="shell">
          <div className="section-heading horizontal">
            <div><p className="kicker">למה Extreme</p><h2>הדרך החכמה<br />להתקדם.</h2></div>
            <p>לא עוד שכבות, המתנות והעברות. צוות מנוסה, תהליך ברור וטכנולוגיה שמורידה רעש.</p>
          </div>
          <div className="value-grid">
            <article><span>01</span><h3>אוטומטי יותר</h3><p>הופכים פעולות חוזרות לתהליך שעובד, כדי שהצוות יתמקד במה שחשוב.</p></article>
            <article><span>02</span><h3>מדויק יותר</h3><p>מתחילים מהצורך העסקי ומחברים אליו אנשים ופתרונות שנבחרו נכון.</p></article>
            <article><span>03</span><h3>מהיר יותר</h3><p>מקצרים את הדרך מהבריף לאנשים, ומהרעיון למערכת עובדת.</p></article>
            <article><span>04</span><h3>נוח יותר</h3><p>כתובת אחת, תקשורת ישירה ותהליך שאפשר להבין בכל רגע.</p></article>
          </div>
        </div>
      </section>

      <section className="section shell proof-section">
        <div className="proof-number"><strong>4×</strong><span>מהר יותר מרעיון<br />לפיילוט עובד</span></div>
        <blockquote>“Extreme ידעו לקחת צורך מורכב, לפרק אותו נכון ולהביא גם את האנשים וגם את הפתרון. בלי רעש, עם הרבה מאוד אחריות.”<cite>— סמנכ״ל טכנולוגיות, ארגון פיננסי</cite></blockquote>
        <div className="proof-caption"><span>CASE 04</span><p>אוטומציה לתהליך תפעולי שחיברה 3 מערכות והחזירה מאות שעות לצוות בכל חודש.</p></div>
      </section>

      <section className="section process-section">
        <div className="shell">
          <div className="section-heading horizontal"><div><p className="kicker">איך זה עובד</p><h2>פשוט להתקדם<br />כשכולם מיושרים.</h2></div><Link className="text-link" href="/intake">ספרו לנו על האתגר <span>←</span></Link></div>
          <ol className="process-list">
            <li><span>01</span><div><h3>מבינים צורך</h3><p>מטרה, אילוצים, לוחות זמנים ומדדי הצלחה.</p></div></li>
            <li><span>02</span><div><h3>מתאימים פתרון</h3><p>אנשים, פרויקט או שילוב מדויק ביניהם.</p></div></li>
            <li><span>03</span><div><h3>יוצאים לדרך</h3><p>תוכנית ברורה, בעלות ואבני דרך קצרות.</p></div></li>
            <li><span>04</span><div><h3>מתקדמים מהר</h3><p>שקיפות, מדידה ושיפור תוך כדי תנועה.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="section careers-section" id="careers">
        <div className="shell career-layout">
          <div className="career-copy">
            <p className="kicker light">קריירה באקסטרים</p>
            <h2>התפקיד הבא שלך<br />כנראה קרוב יותר<br /><em>ממה שנדמה.</em></h2>
            <p>אנחנו מחברים אנשי טכנולוגיה להזדמנויות שיש בהן אתגר אמיתי, אנשים טובים ומקום להתפתח.</p>
            <div className="actions"><Link href="/intake?track=career" className="button lime">שלחו קורות חיים <span>←</span></Link><a href="#open-jobs" className="button ghost-light">ראו משרות פתוחות</a></div>
          </div>
          <div className="jobs-panel" id="open-jobs">
            <div className="jobs-head"><span>משרות נבחרות</span><strong>18<small> פתוחות עכשיו</small></strong></div>
            {jobs.map((job, index) => <Link key={job.title} href={`/intake?track=career&role=${encodeURIComponent(job.title)}`} className="job-row"><span>0{index + 1}</span><div><strong>{job.title}</strong><small>{job.meta}</small></div><b>↙</b></Link>)}
            <Link className="all-jobs" href="/intake?track=career">לכל המשרות <span>←</span></Link>
          </div>
        </div>
      </section>

      <section className="section shell insights-section">
        <div className="section-heading horizontal"><div><p className="kicker">תובנות מהשטח</p><h2>ידע שעוזר<br />לקבל החלטות.</h2></div><a className="text-link" href="#insights">לכל התובנות <span>←</span></a></div>
        <div className="insight-grid" id="insights">{insights.map(([tag, title], index) => <article key={title}><div className={`insight-art art-${index + 1}`}><span>0{index + 1}</span></div><p>{tag}</p><h3>{title}</h3><a href="#insights" aria-label={`קראו: ${title}`}>↙</a></article>)}</div>
      </section>

      <section className="section faq-section shell">
        <div className="section-heading"><p className="kicker">שאלות טובות</p><h2>לפני שמתחילים.</h2></div>
        <div className="faq-list">
          <details><summary>עם אילו ארגונים אתם עובדים?<span>+</span></summary><p>מחברות בצמיחה ועד ארגונים גדולים, בעיקר במקומות שבהם צריך להתקדם מהר בלי להתפשר על איכות, אבטחה או התאמה.</p></details>
          <details><summary>אפשר להתחיל מפיילוט קטן?<span>+</span></summary><p>כן. בפרויקטי AI ואוטומציה זו לעיתים הדרך הנכונה ביותר: בוחרים תהליך משמעותי, מוכיחים ערך ומתרחבים.</p></details>
          <details><summary>מה קורה אחרי ששולחים פנייה?<span>+</span></summary><p>איש או אשת מקצוע מהתחום המתאים חוזרים אליכם לשיחת מיקוד קצרה, בדרך כלל בתוך יום עסקים אחד.</p></details>
          <details><summary>אפשר לשלוח קורות חיים בלי משרה ספציפית?<span>+</span></summary><p>בהחלט. אנחנו שומרים את הפרטים ומחברים להזדמנויות רלוונטיות כשהן נפתחות.</p></details>
        </div>
      </section>

      <section className="final-cta"><div className="shell"><p className="kicker light">בואו נתחיל</p><h2>האתגר שלכם.<br /><em>הצעד הבא שלנו.</em></h2><div className="actions"><Link className="button lime" href="/intake">קבלו פרטים <span>←</span></Link><Link className="button ghost-light" href="/intake?track=career">שלחו קורות חיים</Link></div></div></section>
      <Footer />
    </main>
  );
}
