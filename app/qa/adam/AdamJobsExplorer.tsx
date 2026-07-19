"use client";

import { useMemo, useState } from "react";
import type { StoredAdamJob } from "../../../lib/adam-db";

const all = "הכול";

export function AdamJobsExplorer({ jobs }: { jobs: StoredAdamJob[] }) {
  const [query, setQuery] = useState("");
  const [profession, setProfession] = useState(all);
  const [area, setArea] = useState(all);
  const professions = useMemo(() => [all, ...new Set(jobs.map((job) => job.profession).filter(Boolean))], [jobs]);
  const areas = useMemo(() => [all, ...new Set(jobs.flatMap((job) => job.areas).filter(Boolean))], [jobs]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("he");
    return jobs.filter((job) => {
      const matchesQuery = !needle || `${job.title} ${job.descriptionText} ${job.location}`.toLocaleLowerCase("he").includes(needle);
      return matchesQuery && (profession === all || job.profession === profession) && (area === all || job.areas.includes(area));
    });
  }, [area, jobs, profession, query]);

  return <>
    <div className="adam-qa-filters">
      <label>חיפוש<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="תפקיד, טכנולוגיה או מיקום" /></label>
      <label>תחום<select value={profession} onChange={(event) => setProfession(event.target.value)}>{professions.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label>אזור<select value={area} onChange={(event) => setArea(event.target.value)}>{areas.map((item) => <option key={item}>{item}</option>)}</select></label>
    </div>
    <p className="adam-qa-count">{filtered.length} מתוך {jobs.length} משרות</p>
    <div className="adam-qa-list">
      {filtered.map((job) => <article key={job.id}>
        <div>
          <div className="adam-editorial-state"><span>{job.editorialStatus === "auto_published" ? "פורסם אוטומטית" : "פורסם עם סימון לבדיקה"}</span><small>ביטחון {job.editorialConfidence}%</small></div>
          <span>ADAM #{job.id}</span><h2>{job.title}</h2>
          {job.sourceTitle !== job.title && <p className="adam-source-title"><strong>כותרת מקור:</strong> {job.sourceTitle}</p>}
          <p>{[job.profession, job.location, job.jobScope].filter(Boolean).join(" · ")}</p>
        </div>
        <details><summary>מקור מול פרסום <span>+</span></summary>
          <div className="adam-editorial-comparison">
            <section><small>PUBLIC SUMMARY</small><strong>{job.publicSummary || "לא נוצר תקציר."}</strong></section>
            <section><small>PUBLIC DESCRIPTION</small><div>{job.descriptionText || "לא התקבל תיאור ציבורי."}</div></section>
            <section><small>SOURCE DESCRIPTION</small><div>{job.sourceDescriptionText || "לא התקבל תיאור מקור."}</div></section>
          </div>
          {job.requirementsText && <div className="adam-qa-requirements"><strong>דרישות שפורסמו</strong>{job.requirementsText}</div>}
          {job.editorialFlags.length > 0 && <div className="adam-editorial-flags">{job.editorialFlags.map((flag) => <span key={flag}>{flag}</span>)}</div>}
        </details>
      </article>)}
    </div>
  </>;
}
