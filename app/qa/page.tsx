import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components";

export const metadata: Metadata = {
  title: "QA Hub",
  description: "מרכז בדיקות לאתר Extreme החדש.",
  alternates: { canonical: "/qa" },
  robots: { index: false, follow: false },
};

const journeys = [
  ["מועמד/ת", "כניסה למומחים → סינון → פתיחת משרה → הגשת מועמדות → אישור דמה"],
  ["Referral", "פתיחת משרה → המלצה על מועמד → מילוי פרטי מפנה ומועמד → אישור דמה"],
  ["מגייס/ת", "עמוד הבית → אני מגייס/ת → בחירת מסלול → מילוי בקשה → אישור דמה"],
  ["תוכן", "ניווט בין חזון, פתרונות ותובנות → בדיקת קישורים, היררכיה וקריאות"],
];

export default function QaPage() {
  return <main className="qa-page"><Header /><section className="shell qa-shell">
    <p className="kicker">EXTREME / QA HUB</p>
    <h1>בדיקת האתר החדש</h1>
    <p className="qa-lead">זהו אתר בדיקות ציבורי. כל המשרות והשליחות בטפסים הן נתוני דמה; מידע שמוזן אינו נשמר ואינו נשלח למערכת אדם.</p>
    <div className="qa-actions"><Link className="button primary" href="/">פתיחת האתר לבדיקה <span>←</span></Link><Link className="button secondary" href="/experts#roles">בדיקת מסלול משרות</Link></div>
    <section><h2>מסלולים מרכזיים</h2><div className="qa-grid">{journeys.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="qa-checks"><h2>מה חשוב לבדוק</h2><ul><li>מובייל, טאבלט ומחשב שולחני</li><li>עברית מימין לשמאל ואנגלית משמאל לימין</li><li>ניווט מקלדת, פוקוס, ניגודיות וטקסט חלופי לתמונות</li><li>חיפוש וסינון משרות, קישורים, פרמטרים ועמודי שגיאה</li><li>כותרות SEO, canonical, robots, sitemap ונתוני JobPosting במשרות אמיתיות בלבד</li><li>אין שמירת מידע או העלאת קבצים בפועל בסביבת הדמה</li></ul></section>
    <aside className="qa-report"><strong>פורמט דיווח מומלץ</strong><p>עמוד · מכשיר/דפדפן · צעדים לשחזור · תוצאה בפועל · תוצאה צפויה · חומרה · צילום מסך</p></aside>
  </section></main>;
}
