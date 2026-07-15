import type { Metadata } from "next";
import Link from "next/link";
import { Footer, Header } from "../components";
import { jobs } from "./data";

export const metadata: Metadata = { title: "משרות פתוחות", description: "הזדמנויות טכנולוגיות נבחרות דרך Extreme Group." };

export default function JobsPage() {
  return <main className="talent-home"><Header /><section className="jobs-index-hero shell"><p className="eyebrow"><span /> EXTREME EXPERTS</p><h1>המשרה הבאה שלכם.</h1><p>הזדמנויות טכנולוגיות עם אתגר אמיתי, צוותים מצוינים ומקום להשפיע.</p></section><section className="jobs-section shell"><div className="job-card-grid">{jobs.map((job) => <Link className="role-card" href={`/jobs/${job.slug}`} key={job.slug}><div className="role-card-top"><span>{job.field}</span><small>{job.type}</small></div><h3>{job.title}</h3><p>{job.location} · {job.workMode}</p><div className="role-card-bottom"><span>{job.experience}</span><b>לפרטים והגשת מועמדות ←</b></div></Link>)}</div><div className="jobs-note"><p>לא מצאתם תפקיד מדויק?</p><Link href="/intake?track=career">שלחו קורות חיים ונכיר <span>←</span></Link></div></section><Footer /></main>;
}
