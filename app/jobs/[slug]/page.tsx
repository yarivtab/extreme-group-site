import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Header } from "../../components";
import { readAdamJobBySlug } from "../../../lib/adam-db";

export const dynamic = "force-dynamic";

function blocks(value: string) {
  return value.split(/\n{2,}|\r?\n/).map((item) => item.trim()).filter(Boolean);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const job = await readAdamJobBySlug((await params).slug);
  if (!job) return {};
  const location = job.location || job.areas.join(" · ") || "ישראל";
  const description = (job.descriptionText || `${job.profession} ב־${location}`).slice(0, 155);
  return {
    title: `${job.title} — ${location}`,
    description,
    alternates: { canonical: `/jobs/${job.slug}` },
    robots: { index: true, follow: true },
    openGraph: { title: `${job.title} | Extreme Group`, description, type: "article", url: `/jobs/${job.slug}` },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const job = await readAdamJobBySlug((await params).slug);
  if (!job) notFound();

  const location = job.location || job.areas.join(" · ") || "ישראל";
  const descriptionBlocks = blocks(job.descriptionText);
  const requirementBlocks = blocks(job.requirementsText);
  const intakeUrl = `/intake?track=career&role=${encodeURIComponent(job.title)}&jobId=${job.id}`;
  const jobPosting = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: [job.descriptionText, job.requirementsText].filter(Boolean).join("\n\n"),
    identifier: { "@type": "PropertyValue", name: "Extreme Group", value: String(job.id) },
    ...(job.publishedAt ? { datePosted: job.publishedAt } : {}),
    ...(job.closesAt ? { validThrough: job.closesAt } : {}),
    ...(job.jobScope ? { employmentType: job.jobScope } : {}),
    hiringOrganization: { "@type": "Organization", name: "Extreme Group", sameAs: "https://www.extreme.co.il" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: location, addressCountry: "IL" } },
  };

  return <main className="job-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting).replace(/</g, "\\u003c") }} />
    <Header />
    <article className="job-detail shell">
      <Link className="job-back" href="/experts#roles">→ חזרה לכל המשרות</Link>
      <div className="job-detail-head">
        <div><p className="kicker">{job.profession || "OPEN POSITION"}</p><h1>{job.title}</h1><p>הזדמנות מקצועית ב־Extreme</p></div>
        <Link className="button primary" href={intakeUrl}>הגשת מועמדות <span>←</span></Link>
      </div>
      <dl className="job-facts" aria-label="פרטי המשרה">
        <div><dt>מיקום</dt><dd>{location}</dd></div>
        {job.areas.length > 0 && <div><dt>אזור</dt><dd>{job.areas.join(" · ")}</dd></div>}
        {job.jobScope && <div><dt>היקף משרה</dt><dd>{job.jobScope}</dd></div>}
        {job.subprofession && <div><dt>תחום משנה</dt><dd>{job.subprofession}</dd></div>}
        <div><dt>מספר משרה</dt><dd>{job.id}</dd></div>
      </dl>
      <div className="job-detail-body">
        <section className="job-description">
          <div><p className="kicker">THE ROLE</p><h2>תיאור המשרה</h2>{descriptionBlocks.length ? descriptionBlocks.map((item) => <p key={item}>{item}</p>) : <p>פרטים נוספים יימסרו בתהליך הגיוס.</p>}</div>
          {requirementBlocks.length > 0 && <div><h2>דרישות התפקיד</h2><ul>{requirementBlocks.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        </section>
        <div className="job-sidebar">
          <aside className="job-apply-card"><span>השלב הבא</span><h2>נשמע מתאים?</h2><p>שלחו קורות חיים ונחזור אליכם אם נמצא חיבור נכון לתפקיד. בשלב הבדיקה הטופס עדיין אינו מעביר נתונים ל־Adam.</p><Link href={intakeUrl}>להגשת מועמדות ←</Link></aside>
          {job.referralReward > 0 && <section className="job-referral-card" aria-labelledby="referral-title">
            <small>REFERRAL</small><h2 id="referral-title">מכירים מישהו<br />שמתאים לתפקיד?</h2>
            <p>המליצו על מועמד או מועמדת. אם ההפניה תוביל לקליטה בהתאם לתנאי התוכנית, מענק ההפניה יהיה:</p>
            <strong className="referral-amount" aria-label={`מענק הפניה בסך ${job.referralReward.toLocaleString("he-IL")} שקלים`}><span>₪</span>{job.referralReward.toLocaleString("he-IL")}</strong>
            <Link href={`/intake?track=referral&role=${encodeURIComponent(job.title)}&jobId=${job.id}&bonus=${job.referralReward}`}>להמלצה על מועמד <span>←</span></Link>
          </section>}
        </div>
      </div>
    </article>
    <Footer />
  </main>;
}
