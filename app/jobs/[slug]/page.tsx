import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components";
import { jobs } from "../data";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = jobs.find((item) => item.slug === slug);
  if (!job) notFound();

  return (
    <main className="job-page">
      <Header />
      <article className="job-detail shell">
        <Link className="job-back" href="/#experts">→ חזרה לכל המשרות</Link>
        <div className="job-detail-head">
          <div><p className="kicker">{job.field}</p><h1>{job.title}</h1><p>{job.location} · {job.workMode} · {job.type}</p></div>
          <Link className="button primary" href={`/intake?track=career&role=${encodeURIComponent(job.title)}`}>הגשת מועמדות <span>←</span></Link>
        </div>
        <div className="job-detail-body">
          <section><h2>על התפקיד</h2><p>{job.summary}</p><h2>מה עושים בתפקיד</h2><ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <aside><span>ניסיון</span><strong>{job.experience}</strong><h2>מה אנחנו מחפשים</h2><ul>{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul><Link href={`/intake?track=career&role=${encodeURIComponent(job.title)}`}>רוצים להצטרף? שלחו מועמדות ←</Link></aside>
        </div>
      </article>
      <Footer />
    </main>
  );
}
