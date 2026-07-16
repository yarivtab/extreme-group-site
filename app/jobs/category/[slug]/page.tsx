import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../../components";
import { getJobCategory, jobCategories } from "../../categories";
import { jobs } from "../../data";

export function generateStaticParams() {
  return jobCategories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = getJobCategory((await params).slug);
  if (!category) return {};
  return { title: category.title, description: `${category.description} צפו במשרות פתוחות, דרישות מקצועיות והגישו מועמדות דרך Extreme.`, alternates: { canonical: `/jobs/category/${category.slug}` } };
}

export default async function JobCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = getJobCategory((await params).slug);
  if (!category) notFound();
  const categoryJobs = jobs.filter((job) => category.fields.includes(job.field));
  return <main className="job-category-page"><Header />
    <section className="job-category-hero"><div className="shell"><Link className="job-back" href="/experts#roles">→ חזרה לכל המשרות</Link><div className="bilingual-head bilingual-head-hero"><h1>{category.title}</h1><p className="kicker">{category.eyebrow}</p></div><p>{category.description}</p><div className="category-skills" aria-label="מיומנויות נפוצות">{category.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></section>
    <section className="category-openings shell" aria-labelledby="category-openings-title"><div className="bilingual-head"><h2 id="category-openings-title">משרות פתוחות בתחום</h2><p className="kicker">CURRENT OPPORTUNITIES</p></div><div className="jobs-demo-notice"><strong>DEMO DATA</strong><span>המשרות המוצגות כעת הן להמחשת התבנית ויוחלפו במשרות פעילות ממערכת אדם.</span></div>{categoryJobs.length ? <div className="category-job-list">{categoryJobs.map((job) => <Link href={`/jobs/${job.slug}`} key={job.slug}><small>{job.field}</small><h3>{job.title}</h3><p>{job.location} · {job.workMode} · {job.experience}</p><span>לפרטים והגשת מועמדות ←</span></Link>)}</div> : <div className="category-empty"><h3>אין כרגע משרה פתוחה בקטגוריה הזאת.</h3><p>אפשר להעלות קורות חיים פעם אחת ואנחנו נחפש התאמה גם להזדמנויות שעדיין לא פורסמו.</p><Link className="button primary" href="/intake?track=career">העלאת קורות חיים <span>←</span></Link></div>}</section>
    <section className="category-context"><div className="shell"><div className="category-context-grid">{category.questions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div></div></section>
    <section className="category-more shell"><div><p className="kicker">EXPLORE MORE</p><h2>תחומים נוספים</h2></div><nav aria-label="קטגוריות משרות נוספות">{jobCategories.filter((item) => item.slug !== category.slug).map((item) => <Link href={`/jobs/category/${item.slug}`} key={item.slug}>{item.label} <span>←</span></Link>)}</nav></section><Footer />
  </main>;
}
