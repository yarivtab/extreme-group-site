"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const tracks = [
  ["talent", "גיוס טכנולוגי"], ["project", "פרויקט AI / אוטומציה"], ["profile", "פרופיל משרה"], ["career", "קורות חיים"], ["general", "שאלה כללית"],
];

export function IntakeForm({ initialTrack, initialMessage }: { initialTrack?: string; initialMessage?: string }) {
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  if (sent) return <div className="success-panel" role="status"><span>REQUEST / RECEIVED</span><h2>הפנייה התקבלה.<br />מכאן זה שלנו.</h2><p>תודה ששיתפתם. נחזור אליכם לשיחת מיקוד קצרה בתוך יום עסקים אחד.</p><Link href="/" className="button primary">חזרה לעמוד הבית <span>←</span></Link></div>;
  return <form className="intake-form" onSubmit={submit}>
    <fieldset className="track-fieldset"><legend>מה מביא אתכם אלינו?</legend><div className="track-grid">{tracks.map(([value,label])=><label className="track-option" key={value}><input type="radio" name="track" value={value} defaultChecked={(initialTrack || "talent") === value}/><span>{label}</span></label>)}</div></fieldset>
    <div className="form-grid">
      <label>שם מלא<input name="name" required placeholder="השם שלכם" autoComplete="name" /></label>
      <label>חברה<input name="company" placeholder="שם הארגון" autoComplete="organization" /></label>
      <label>אימייל<input type="email" name="email" required placeholder="name@company.com" autoComplete="email" /></label>
      <label>טלפון<input type="tel" name="phone" placeholder="050-0000000" autoComplete="tel" /></label>
      <label className="full">מה תרצו להשיג?<textarea name="message" required defaultValue={initialMessage} placeholder="כמה מילים על הצורך, התפקיד או הפרויקט יעזרו לנו לחבר את האדם הנכון לשיחה." /></label>
      <label className="full upload-box">אפשר לצרף קורות חיים או בריף<input type="file" name="file" accept=".pdf,.doc,.docx" /></label>
      <p className="form-note full">בשליחת הטופס אתם מאשרים לנו לחזור אליכם לגבי הפנייה. אנחנו משתמשים בפרטים רק כדי לטפל בה.</p>
      <button className="button primary full" type="submit">שלחו פנייה <span>←</span></button>
    </div>
  </form>;
}
