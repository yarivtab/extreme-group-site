import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../../components";
import { getJobCategory, jobCategories } from "../../categories";
import { readAdamJobs } from "../../../../lib/adam-db";

export function generateStaticParams() {
  return jobCategories.map((category) => ({ slug: category.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = getJobCategory((await params).slug);
  if (!category) return {};
  return { title: category.title, description: `${category.description} צפו במשרות פתוחות, דרישות מקצועיות והגישו מועמדות דרך Extreme.`, alternates: { canonical: `/jobs/category/${category.slug}` } };
}

export default async function JobCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = getJobCategory((await params).slug);
  if (!category) notFound();
  const jobs = await readAdamJobs();
  const categoryTerms = [...category.fields, category.label, ...category.skills].map((item) => item.toLocaleLowerCase("he"));
  const categoryJobs = jobs.filter((job) => {
    const text = `${job.title} ${job.profession} ${job.subprofession}`.toLocaleLowerCase("he");
    return categoryTerms.some((term) => text.includes(term));
  });
  return <main className="job-category-page"><Header />
    <section className="job-category-hero"><div className="shell"><Link className="job-back" href="/experts#roles">→ חזרה לכל המשרות</Link><div className="bilingual-head bilingual-head-hero"><h1>{category.title}</h1><p className="kicker">{category.eyebrow}</p></div><p>{category.description}</p><div className="category-skills" aria-label="מיומנויות נפוצות">{category.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></section>
    <section className="category-openings shell" aria-labelledby="category-openings-title"><div className="bilingual-head"><h2 id="category-openings-title">משרות פתוחות בתחום</h2><p className="kicker">CURRENT OPPORTUNITIES</p></div>{categoryJobs.length ? <div className="category-job-list">{categoryJobs.map((job) => <Link href={`/jobs/${job.slug}`} key={job.slug}><small>{job.profession || category.label}</small><h3>{job.title}</h3><p>{[job.location || job.areas.join(" · "), job.jobScope, job.subprofession].filter(Boolean).join(" · ")}</p><span>לפרטים ←</span></Link>)}</div> : <div className="category-empty"><h3>אין כרגע משרה פתוחה בקטגוריה הזאת.</h3><p>אפשר לצפות בכל המשרות הפעילות או להעלות קורות חיים פעם אחת.</p><Link className="button primary" href="/experts#roles">לכל המשרות <span>←</span></Link></div>}</section>
    <section className="category-context"><div className="shell"><div className="category-context-grid">{category.questions.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h2>{item.title}</h2><p>{item.text}</p></article>)}</div></div></section>
    <section className="category-more shell"><div><p className="kicker">EXPLORE MORE</p><h2>תחומים נוספים</h2></div><nav aria-label="קטגוריות משרות נוספות">{jobCategories.filter((item) => item.slug !== category.slug).map((item) => <Link href={`/jobs/category/${item.slug}`} key={item.slug}>{item.label} <span>←</span></Link>)}</nav></section><Footer />
  </main>;
}
