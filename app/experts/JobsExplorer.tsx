"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type PublicJobCard = {
  slug: string;
  title: string;
  profession: string;
  subprofession: string;
  location: string;
  areas: string[];
  jobScope: string;
  publicSummary: string;
  descriptionText: string;
  referralReward: number;
};

const all = "הכול";
const pageSize = 12;

function excerpt(value: string) {
  const compact = value.replace(/\s+/g, " ").trim();
  if (!compact) return "היכנסו לפרטי המשרה המלאים ולדרישות התפקיד.";
  return compact.length > 170 ? `${compact.slice(0, 167).trim()}…` : compact;
}

export function JobsExplorer({ jobs }: { jobs: PublicJobCard[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState(all);
  const [location, setLocation] = useState(all);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const fields = useMemo(() => [all, ...new Set(jobs.map((job) => job.profession).filter(Boolean))], [jobs]);
  const locations = useMemo(() => [all, ...new Set(jobs.flatMap((job) => job.areas.length ? job.areas : [job.location]).filter(Boolean))], [jobs]);
  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("he");
    return jobs.filter((job) => {
      const matchesQuery = !normalizedQuery || [job.title, job.profession, job.subprofession, job.descriptionText, job.location, ...job.areas]
        .join(" ")
        .toLocaleLowerCase("he")
        .includes(normalizedQuery);
      return matchesQuery && (field === all || job.profession === field) && (location === all || job.location === location || job.areas.includes(location));
    });
  }, [field, jobs, location, query]);
  const visibleJobs = filteredJobs.slice(0, visibleCount);

  const reset = () => { setQuery(""); setField(all); setLocation(all); setVisibleCount(pageSize); };

  return <div className="experts-jobs-explorer">
    <div className="experts-filter-bar" aria-label="סינון משרות">
      <label className="experts-search"><span>חיפוש</span><input value={query} onChange={(event) => { setQuery(event.target.value); setVisibleCount(pageSize); }} placeholder="תפקיד, טכנולוגיה או מילת מפתח" /></label>
      <label><span>תחום</span><select value={field} onChange={(event) => { setField(event.target.value); setVisibleCount(pageSize); }}>{fields.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
      <label><span>מיקום</span><select value={location} onChange={(event) => { setLocation(event.target.value); setVisibleCount(pageSize); }}>{locations.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
      <button type="button" onClick={reset}>ניקוי</button>
    </div>

    <div className="experts-results-head" aria-live="polite"><strong>{filteredJobs.length} משרות נמצאו</strong><span>{filteredJobs.length ? `מציגים ${Math.min(visibleCount, filteredJobs.length)} משרות` : "מתעדכן לפי הבחירה שלכם"}</span></div>
    {filteredJobs.length > 0 ? <div className="experts-job-list">
      {visibleJobs.map((job) => <Link href={`/jobs/${job.slug}`} className="experts-job-row" key={job.slug}>
        <div className="experts-job-copy"><small>{job.profession || "משרה פתוחה"}</small><h3>{job.title}</h3><p>{job.publicSummary || excerpt(job.descriptionText || job.subprofession)}</p></div>
        <div className="experts-job-meta"><span>{job.location || job.areas.join(" · ") || "ישראל"}</span>{job.jobScope && <span>{job.jobScope}</span>}{job.subprofession && <span>{job.subprofession}</span>}{job.referralReward > 0 && <span className="referral-tag">Referral · ₪{job.referralReward.toLocaleString("he-IL")}</span>}</div>
        <div className="experts-job-link"><span>לפרטי המשרה</span><b aria-hidden="true">←</b></div>
      </Link>)}
      {visibleCount < filteredJobs.length && <button className="experts-load-more" type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>הציגו עוד משרות <span>+{Math.min(pageSize, filteredJobs.length - visibleCount)}</span></button>}
    </div> : <div className="experts-empty"><h3>לא מצאנו משרה לפי הסינון הזה.</h3><p>אפשר לנקות את הפילטרים או להעלות קורות חיים — ונחפש התאמה גם מעבר לרשימה הפתוחה.</p><button type="button" onClick={reset}>הציגו את כל המשרות</button></div>}
  </div>;
}
