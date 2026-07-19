"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { StoredAdamJob } from "../../lib/adam-db";

const all = "הכול";

export function JobsExplorer({ jobs }: { jobs: StoredAdamJob[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState(all);
  const [location, setLocation] = useState(all);

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

  const reset = () => { setQuery(""); setField(all); setLocation(all); };

  return <div className="experts-jobs-explorer">
    <div className="experts-filter-bar" aria-label="סינון משרות">
      <label className="experts-search"><span>חיפוש</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="תפקיד, טכנולוגיה או מילת מפתח" /></label>
      <label><span>תחום</span><select value={field} onChange={(event) => setField(event.target.value)}>{fields.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
      <label><span>מיקום</span><select value={location} onChange={(event) => setLocation(event.target.value)}>{locations.map((option) => <option value={option} key={option}>{option}</option>)}</select></label>
      <button type="button" onClick={reset}>ניקוי</button>
    </div>

    <div className="experts-results-head" aria-live="polite"><strong>{filteredJobs.length} משרות</strong><span>מתעדכן לפי הבחירה שלכם</span></div>
    {filteredJobs.length > 0 ? <div className="experts-job-list">
      {filteredJobs.map((job, index) => <Link href={`/jobs/${job.slug}`} className="experts-job-row" key={job.slug}>
        <span className="experts-job-index">{String(index + 1).padStart(2, "0")}</span>
        <div><small>{job.profession || "משרה פתוחה"}</small><h3>{job.title}</h3><p>{job.descriptionText || job.subprofession || "לפרטים המלאים על התפקיד"}</p></div>
        <div className="experts-job-meta"><span>{job.location || job.areas.join(" · ") || "ישראל"}</span>{job.jobScope && <span>{job.jobScope}</span>}{job.subprofession && <span>{job.subprofession}</span>}{job.referralReward > 0 && <span className="referral-tag">Referral · ₪{job.referralReward.toLocaleString("he-IL")}</span>}</div>
        <b aria-hidden="true">←</b>
      </Link>)}
    </div> : <div className="experts-empty"><h3>לא מצאנו משרה לפי הסינון הזה.</h3><p>אפשר לנקות את הפילטרים או להעלות קורות חיים — ונחפש התאמה גם מעבר לרשימה הפתוחה.</p><button type="button" onClick={reset}>הציגו את כל המשרות</button></div>}
  </div>;
}
