import Link from "next/link";
import { Footer, Header } from "./components";
import { jobs } from "./jobs/data";

export default function Home() {
  return (
    <main className="talent-home">
      <Header />

      <section className="talent-hero shell" aria-labelledby="hero-title">
        <p className="eyebrow"><span /> RECRUITING INTELLIGENCE NETWORK</p>
        <h1 id="hero-title"><span className="hero-english" dir="ltr">Recruiting Intelligence</span><span className="hero-hebrew">שמחבר אנשים <em>להזדמנויות הנכונות.</em></span></h1>
        <p>Data איכותי, מודלי AI ואוטומציה שמפחיתים רעש, משפרים התאמות ומקצרים את הדרך — לצוותי גיוס ולטאלנטים.</p>
        <div className="talent-hero-actions">
          <Link className="button hero-employer" href="/intake?track=talent">אני מגייסת <span>←</span></Link>
          <Link className="button hero-talent" href="#experts">אני מחפש/ת הזדמנות <span>↓</span></Link>
        </div>
      </section>

      <section className="network-steps" id="how-it-works" aria-labelledby="steps-title">
        <div className="shell">
          <div className="network-steps-head"><p className="kicker">HOW IT WORKS</p><h2 id="steps-title">שלושה צעדים לחיבור מדויק יותר.</h2></div>
          <div className="network-step-grid">
            <article><span>01</span><h3>משתפים צורך או פרופיל</h3><p>צוותי גיוס מגדירים תפקיד. טאלנטים משתפים ניסיון, יכולות והעדפות.</p></article>
            <article><span>02</span><h3>ה־Intelligence עובד</h3><p>Data, מודלי AI ואוטומציה מזהים התאמות ומפחיתים רעש משני הצדדים.</p></article>
            <article><span>03</span><h3>נפגשים ומתקדמים</h3><p>המגייסת והטאלנט מקבלים הקשר ברור וממשיכים להחלטה אנושית טובה יותר.</p></article>
          </div>
        </div>
      </section>

      <section className="jobs-section shell" id="experts" aria-labelledby="jobs-title">
        <div className="jobs-title-row">
          <div><p className="kicker">LATEST ROLES</p><h2 id="jobs-title">משרות פתוחות</h2></div>
          <span>{jobs.length} תפקידים נבחרים</span>
        </div>
        <div className="job-card-grid">
          {jobs.map((job) => (
            <Link className="role-card" href={`/jobs/${job.slug}`} key={job.slug}>
              <div className="role-card-top"><span>{job.field}</span><small>{job.type}</small></div>
              <h3>{job.title}</h3>
              <p>{job.location} · {job.workMode}</p>
              <div className="role-card-bottom"><span>{job.experience}</span><b>לפרטים והגשת מועמדות ←</b></div>
            </Link>
          ))}
        </div>
        <div className="jobs-note">
          <p>לא מצאתם תפקיד מדויק?</p>
          <Link href="/intake?track=career">שלחו קורות חיים ונכיר <span>←</span></Link>
        </div>
      </section>

      <section className="talent-links shell" aria-label="מידע נוסף">
        <Link href="/solutions" id="organizations"><small>לארגונים</small><strong>בונים את הצוות הנכון</strong><span>←</span></Link>
        <Link href="https://www.extreme.co.il/extreme-academy/" id="research"><small>תובנות</small><strong>אנשים, AI והעבודה החדשה</strong><span>←</span></Link>
        <Link href="/solutions" id="vision"><small>חזון</small><strong>טכנולוגיה שמקדמת אנשים</strong><span>←</span></Link>
        <Link href="/intake" id="coretado"><small>Coretado</small><strong>בואו נדבר</strong><span>←</span></Link>
      </section>

      <Footer />
    </main>
  );
}
