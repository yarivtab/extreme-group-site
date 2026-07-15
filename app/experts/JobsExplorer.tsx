"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Job } from "../jobs/data";

const all = "הכול";

export function JobsExplorer({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [field, setField] = useState(all);
  const [location, setLocation] = useState(all);

  const fields = useMemo(() => [all, ...new Set(jobs.map((job) => job.field))], [jobs]);
  const locations = useMemo(() => [all, ...new Set(jobs.map((job) => job.location))], [jobs]);
  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("he");
    return jobs.filter((job) => {
      const matchesQuery = !normalizedQuery || [job.title, job.field, job.summary, job.location]
        .join(" ")
        .toLocaleLowerCase("he")
        .includes(normalizedQuery);
      return matchesQuery && (field === all || job.field === field) && (location === all || job.location === location);
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
        <div><small>{job.field}</small><h3>{job.title}</h3><p>{job.summary}</p></div>
        <div className="experts-job-meta"><span>{job.location}</span><span>{job.workMode}</span><span>{job.experience}</span></div>
        <b aria-hidden="true">←</b>
      </Link>)}
    </div> : <div className="experts-empty"><h3>לא מצאנו משרה לפי הסינון הזה.</h3><p>אפשר לנקות את הפילטרים או להעלות קורות חיים — ונחפש התאמה גם מעבר לרשימה הפתוחה.</p><button type="button" onClick={reset}>הציגו את כל המשרות</button></div>}
  </div>;
}
