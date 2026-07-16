import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { jobs } from "../jobs/data";
import { JobsExplorer } from "./JobsExplorer";
import { jobCategories } from "../jobs/categories";

export const metadata: Metadata = {
  title: "מומחים ומשרות",
  description: "משרות טכנולוגיות, התאמה חכמה והזדמנויות מקצועיות למומחים של Extreme.",
  alternates: { canonical: "/experts" },
};

const reasons = [
  { number: "01", title: "מגוון פרויקטים", text: "גישה להזדמנויות בחברות מובילות, בצוותים טכנולוגיים ובפרויקטים שמשפיעים באמת — מתפקידי ליבה ועד אתגרי AI ו־Data." },
  { number: "02", title: "התאמה מקסימלית לתפקיד", text: "אנחנו מסתכלים מעבר למילות מפתח: ניסיון, יכולות, סביבת עבודה, שאיפות והצעד המקצועי הנכון עבורכם." },
  { number: "03", title: "קלות העסקה", text: "תהליך פשוט, ליווי ברור ופחות התעסקות מסביב — כדי שתוכלו להתמקד בעבודה, בצוות ובהתקדמות המקצועית." },
];

export default function ExpertsPage() {
  return <main className="experts-page">
    <Header />

    <section className="experts-hero">
      <div className="shell experts-hero-grid">
        <div className="experts-hero-copy">
          <div className="bilingual-head bilingual-head-hero"><h1>ההזדמנות הבאה שלכם,<br /><em>בהתאמה טובה יותר.</em></h1><p className="kicker">EXTREME EXPERTS</p></div>
          <p>משרות ופרויקטים לאנשים של טכנולוגיה. בחרו תפקיד פתוח או העלו קורות חיים פעם אחת — ואנחנו נחפש את החיבור הנכון עבורכם.</p>
        </div>
        <aside className="experts-resume-card">
          <span>PROFILE / ONE TIME</span>
          <h2>קורות חיים אחד.<br />יותר מהזדמנות אחת.</h2>
          <p>נכיר את הניסיון והכיוון שלכם ונוכל להציע התאמות גם למשרות שאינן מופיעות כרגע באתר.</p>
          <Link className="button primary" href="/intake?track=career">העלאת קורות חיים <span>←</span></Link>
          <small>PDF, DOC או DOCX · מתחילים בכמה דקות</small>
        </aside>
      </div>
    </section>

    <section className="experts-openings shell" id="roles" aria-labelledby="experts-jobs-title">
      <div className="experts-section-head"><div className="bilingual-head"><h2 id="experts-jobs-title">מצאו את התפקיד הבא.</h2><p className="kicker">OPEN OPPORTUNITIES</p></div><p>חפשו לפי תחום או מיקום, היכנסו למשרה והגישו מועמדות ישירות.</p></div>
      <div className="jobs-demo-notice"><strong>DEMO DATA</strong><span>המשרות בעמוד הן נתוני דמה לבדיקת התבנית. הן יוחלפו אוטומטית במשרות ממערכת אדם לאחר החיבור.</span></div>
      <nav className="job-category-links" aria-label="משרות לפי תחום">{jobCategories.map((category) => <Link href={`/jobs/category/${category.slug}`} key={category.slug}>{category.label}</Link>)}</nav>
      <JobsExplorer jobs={jobs} />
    </section>

    <section className="experts-why" aria-labelledby="experts-why-title">
      <div className="shell">
        <div className="experts-why-head bilingual-head"><h2 id="experts-why-title">למה מומחים בוחרים לעבוד עם Extreme?</h2><p className="kicker">WHY EXTREME</p></div>
        <div className="experts-reasons">{reasons.map((reason) => <article key={reason.number}><span>{reason.number}</span><h3>{reason.title}</h3><p>{reason.text}</p></article>)}</div>
        <div className="experts-final-line"><p>לא מצאתם כרגע את המשרה המדויקת?</p><Link href="/intake?track=career">העלו קורות חיים ונכיר <span>←</span></Link></div>
      </div>
    </section>

    <Footer />
  </main>;
}
