import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../../components";
import { readAdamJobs } from "../../../lib/adam-db";
import { AdamJobsExplorer } from "./AdamJobsExplorer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "בדיקת סנכרון Adam",
  robots: { index: false, follow: false },
};

export default async function AdamQaPage() {
  const jobs = await readAdamJobs();
  const lastSync = jobs[0]?.syncedAt;
  return <main className="adam-qa-page">
    <Header />
    <section className="shell adam-qa-hero">
      <p className="kicker">PRIVATE QA / ADAM SYNC</p>
      <h1>משרות מסונכרנות<br />מ־Adam.</h1>
      <p>מסלול בדיקה מבודד. הנתונים נשמרים במסד המקומי והחיפוש מתבצע באתר Extreme.</p>
      <div className="adam-qa-status"><strong>{jobs.length} משרות פעילות</strong><span>{lastSync ? `סנכרון אחרון: ${new Date(lastSync).toLocaleString("he-IL")}` : "טרם בוצע סנכרון"}</span></div>
    </section>
    <section className="shell adam-qa-content">
      {jobs.length ? <AdamJobsExplorer jobs={jobs} /> : <div className="adam-qa-empty"><h2>המסד מוכן לסנכרון הראשון.</h2><p>לאחר הפעלת הסנכרון המאובטח, המשרות יופיעו כאן לבדיקה.</p><Link href="/qa">חזרה למרכז הבדיקות</Link></div>}
    </section>
  </main>;
}
