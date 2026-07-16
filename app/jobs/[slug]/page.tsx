import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components";
import { jobs } from "../data";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const job = jobs.find((item) => item.slug === slug);
  if (!job) return {};

  return {
    title: `${job.title} — ${job.location}`,
    description: `${job.summary} משרה ${job.workMode} ב${job.location}. לפרטים, דרישות והגשת מועמדות.`,
    alternates: { canonical: `/jobs/${job.slug}` },
    robots: job.isDemo ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: `${job.title} | Extreme Group`,
      description: `${job.summary} ${job.location} · ${job.workMode}`,
      type: "article",
      url: `/jobs/${job.slug}`,
    },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const job = jobs.find((item) => item.slug === slug);
  if (!job) notFound();

  const jobPosting = !job.isDemo && job.datePosted ? {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `<p>${job.summary}</p><h2>תחומי אחריות</h2><ul>${job.responsibilities.map((item) => `<li>${item}</li>`).join("")}</ul><h2>דרישות</h2><ul>${job.requirements.map((item) => `<li>${item}</li>`).join("")}</ul>`,
    identifier: { "@type": "PropertyValue", name: "Extreme Group", value: job.externalId },
    datePosted: job.datePosted,
    ...(job.validThrough ? { validThrough: job.validThrough } : {}),
    employmentType: "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: "Extreme Group", sameAs: "https://www.extreme.co.il", logo: "https://www.extreme.co.il/extreme-logo.png" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IL" } },
  } : null;

  return (
    <main className="job-page">
      {jobPosting && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting).replace(/</g, "\\u003c") }} />}
      <Header />
      <article className="job-detail shell">
        <Link className="job-back" href="/experts#roles">→ חזרה לכל המשרות</Link>
        <div className="job-detail-head">
          <div><p className="kicker">{job.field}</p><h1>{job.title}</h1><p>הזדמנות מקצועית ב־Extreme</p></div>
          <Link className="button primary" href={`/intake?track=career&role=${encodeURIComponent(job.title)}&jobId=${job.externalId}`}>הגשת מועמדות <span>←</span></Link>
        </div>
        <dl className="job-facts" aria-label="פרטי המשרה">
          <div><dt>מיקום</dt><dd>{job.location}</dd></div>
          <div><dt>מודל עבודה</dt><dd>{job.workMode}</dd></div>
          <div><dt>היקף משרה</dt><dd>{job.type}</dd></div>
          <div><dt>ניסיון</dt><dd>{job.experience}</dd></div>
          <div><dt>מספר משרה</dt><dd>{job.externalId}</dd></div>
          {job.salaryRange && <div><dt>טווח שכר</dt><dd>{job.salaryRange}</dd></div>}
        </dl>
        <div className="job-detail-body">
          <section className="job-description">
            <div><p className="kicker">THE ROLE</p><h2>תיאור המשרה</h2><p>{job.summary}</p></div>
            <div><h2>תחומי אחריות</h2><ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div><h2>דרישות התפקיד</h2><ul>{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </section>
          <div className="job-sidebar">
            <aside className="job-apply-card"><span>השלב הבא</span><h2>נשמע מתאים?</h2><p>שלחו קורות חיים ונחזור אליכם אם נמצא חיבור נכון לתפקיד.</p><Link href={`/intake?track=career&role=${encodeURIComponent(job.title)}&jobId=${job.externalId}`}>להגשת מועמדות ←</Link></aside>
            <section className="job-referral-card" aria-labelledby="referral-title">
              <small>REFERRAL PILOT</small>
              <h2 id="referral-title">מכירים מישהו<br />שמתאים לתפקיד?</h2>
              <p>המליצו על מועמד או מועמדת. אם ההפניה תוביל לקליטה בהתאם לתנאי התוכנית, מענק ההפניה יהיה:</p>
              <strong className="referral-amount" aria-label={`מענק הפניה בסך ${job.referralBonus.toLocaleString("he-IL")} שקלים`}><span>₪</span>{job.referralBonus.toLocaleString("he-IL")}</strong>
              <Link href={`/intake?track=referral&role=${encodeURIComponent(job.title)}&jobId=${job.externalId}&bonus=${job.referralBonus}`}>להמלצה על מועמד <span>←</span></Link>
              <em>פיילוט · הסכום והתנאים יאושרו בחיבור ל־ATS</em>
            </section>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
