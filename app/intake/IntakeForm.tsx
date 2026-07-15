"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const tracks = [
  ["talent", "גיוס טכנולוגי"], ["project", "פרויקט AI / אוטומציה"], ["profile", "פרופיל משרה"], ["career", "קורות חיים"], ["referral", "המלצה על מועמד"], ["general", "שאלה כללית"],
];

export function IntakeForm({ initialTrack, role, bonus }: { initialTrack?: string; role?: string; bonus?: string }) {
  const [sent, setSent] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(initialTrack || "talent");
  const isReferral = selectedTrack === "referral";
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  if (sent) return <div className="success-panel" role="status"><span>{isReferral ? "REFERRAL / RECEIVED" : "REQUEST / RECEIVED"}</span><h2>{isReferral ? <>ההמלצה התקבלה.<br />מכאן זה שלנו.</> : <>הפנייה התקבלה.<br />מכאן זה שלנו.</>}</h2><p>{isReferral ? "נבדוק את פרטי ההפניה ונחזור אליכם לגבי המשך התהליך והזכאות למענק." : "תודה ששיתפתם. נחזור אליכם לשיחת מיקוד קצרה בתוך יום עסקים אחד."}</p><Link href={isReferral ? "/experts#roles" : "/"} className="button primary">חזרה לאתר <span>←</span></Link></div>;
  return <form className="intake-form" onSubmit={submit}>
    <fieldset className="track-fieldset"><legend>מה מביא אתכם אלינו?</legend><div className="track-grid">{tracks.map(([value,label])=><label className="track-option" key={value}><input type="radio" name="track" value={value} checked={selectedTrack === value} onChange={() => setSelectedTrack(value)}/><span>{label}</span></label>)}</div></fieldset>
    {isReferral && <div className="referral-form-summary"><span>REFERRAL PILOT</span><strong>{role || "משרה לבחירה"}</strong>{bonus && <b>מענק מוצע: ₪{Number(bonus).toLocaleString("he-IL")}</b>}<small>הסכום והתנאים הסופיים יאושרו לאחר החיבור ל־ATS.</small></div>}
    {isReferral ? <div className="form-grid referral-form-grid">
      <input type="hidden" name="role" value={role || ""} />
      <input type="hidden" name="bonus" value={bonus || ""} />
      <label>שם הממליץ/ה<input name="referrerName" required placeholder="השם שלכם" autoComplete="name" /></label>
      <label>אימייל הממליץ/ה<input type="email" name="referrerEmail" required placeholder="name@email.com" autoComplete="email" /></label>
      <label>טלפון הממליץ/ה<input type="tel" name="referrerPhone" required placeholder="050-0000000" autoComplete="tel" /></label>
      <label>שם המועמד/ת<input name="candidateName" required placeholder="שם מלא" /></label>
      <label>אימייל המועמד/ת<input type="email" name="candidateEmail" required placeholder="candidate@email.com" /></label>
      <label>טלפון המועמד/ת<input type="tel" name="candidatePhone" placeholder="050-0000000" /></label>
      <label className="full">LinkedIn או קישור מקצועי<input type="url" name="candidateLinkedin" placeholder="https://linkedin.com/in/..." /></label>
      <label className="full">למה זו התאמה טובה?<textarea name="message" required placeholder="כמה מילים על הניסיון, הקשר שלכם וההתאמה לתפקיד." /></label>
      <label className="full upload-box">צירוף קורות החיים של המועמד/ת<input type="file" name="file" accept=".pdf,.doc,.docx" /></label>
      <label className="full referral-consent"><input type="checkbox" name="consent" required /><span>אני מאשר/ת שהמועמד/ת יודע/ת ומסכים/ה להעברת הפרטים ל־Extreme לצורך בחינת ההתאמה.</span></label>
      <p className="form-note full">הזכאות למענק כפופה לתנאי תוכנית ההפניות, לזיהוי הממליץ הראשון ולקליטת המועמד/ת.</p>
      <button className="button primary full" type="submit">שליחת המלצה <span>←</span></button>
    </div> : <div className="form-grid">
      <label>שם מלא<input name="name" required placeholder="השם שלכם" autoComplete="name" /></label>
      <label>חברה<input name="company" placeholder="שם הארגון" autoComplete="organization" /></label>
      <label>אימייל<input type="email" name="email" required placeholder="name@company.com" autoComplete="email" /></label>
      <label>טלפון<input type="tel" name="phone" placeholder="050-0000000" autoComplete="tel" /></label>
      <label className="full">מה תרצו להשיג?<textarea name="message" required placeholder="כמה מילים על הצורך, התפקיד או הפרויקט יעזרו לנו לחבר את האדם הנכון לשיחה." /></label>
      <label className="full upload-box">אפשר לצרף קורות חיים או בריף<input type="file" name="file" accept=".pdf,.doc,.docx" /></label>
      <p className="form-note full">בשליחת הטופס אתם מאשרים לנו לחזור אליכם לגבי הפנייה. אנחנו משתמשים בפרטים רק כדי לטפל בה.</p>
      <button className="button primary full" type="submit">שלחו פנייה <span>←</span></button>
    </div>}
  </form>;
}
