"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const tracks = [
  ["talent", "גיוס טכנולוגי"], ["project", "פרויקט AI / אוטומציה"], ["profile", "פרופיל משרה"], ["career", "קורות חיים"], ["referral", "המלצה על מועמד"], ["general", "שאלה כללית"],
];

export function IntakeForm({ initialTrack, role, bonus, jobId }: { initialTrack?: string; role?: string; bonus?: string; jobId?: string }) {
  const [sent, setSent] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(initialTrack || "talent");
  const isReferral = selectedTrack === "referral";
  const isCareer = selectedTrack === "career";
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  if (sent) return <div className="success-panel demo-success" role="status"><span>DEMO / VALIDATED</span><h2>בדיקת הטופס<br />הושלמה בהצלחה.</h2><p>זו סביבת דמה: הפרטים וקובץ קורות החיים לא נשלחו ולא נשמרו. לאחר חיבור מערכת אדם, אותו מסלול יעביר את המועמדות למשרה הנכונה.</p><Link href={isCareer || isReferral ? "/experts#roles" : "/"} className="button primary">חזרה לאתר <span>←</span></Link></div>;
  return <form className="intake-form" onSubmit={submit}>
    <div className="demo-form-notice"><strong>סביבת דמה</strong><span>אפשר לבדוק את חוויית הטופס. שום מידע אינו נשלח או נשמר.</span></div>
    <fieldset className="track-fieldset"><legend>מה מביא אתכם אלינו?</legend><div className="track-grid">{tracks.map(([value,label])=><label className="track-option" key={value}><input type="radio" name="track" value={value} checked={selectedTrack === value} onChange={() => setSelectedTrack(value)}/><span>{label}</span></label>)}</div></fieldset>
    {isReferral && <div className="referral-form-summary"><span>REFERRAL PILOT</span><strong>{role || "משרה לבחירה"}</strong>{bonus && <b>מענק מוצע: ₪{Number(bonus).toLocaleString("he-IL")}</b>}<small>הסכום והתנאים הסופיים יאושרו לאחר החיבור ל־ATS.</small></div>}
    {isCareer && <div className="career-form-summary"><span>APPLICATION / DEMO</span><strong>{role || "הגשת קורות חיים כללית"}</strong><small>{jobId ? `מספר משרה: ${jobId}` : "הפרופיל יישמר למגוון הזדמנויות לאחר חיבור ה־ATS"}</small></div>}
    {isReferral ? <div className="form-grid referral-form-grid">
      <input type="hidden" name="jobId" value={jobId || ""} />
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
      <label className="full referral-consent"><input type="checkbox" name="consent" required /><span>אני מאשר/ת שהמועמד/ת יודע/ת ומסכים/ה להעברת הפרטים ל־Extreme לצורך בחינת ההתאמה, בהתאם ל<Link href="/privacy">מדיניות הפרטיות</Link>.</span></label>
      <p className="form-note full">הזכאות למענק כפופה לתנאי תוכנית ההפניות, לזיהוי הממליץ הראשון ולקליטת המועמד/ת.</p>
      <button className="button primary full" type="submit">שליחת המלצה <span>←</span></button>
    </div> : isCareer ? <div className="form-grid career-application-grid">
      <input type="hidden" name="jobId" value={jobId || ""} />
      <input type="hidden" name="role" value={role || ""} />
      <label>שם מלא<input name="name" required placeholder="השם שלכם" autoComplete="name" /></label>
      <label>אימייל<input type="email" name="email" required placeholder="name@email.com" autoComplete="email" /></label>
      <label>טלפון<input type="tel" name="phone" required placeholder="050-0000000" autoComplete="tel" /></label>
      <label>אזור מגורים<input name="location" placeholder="עיר או אזור" autoComplete="address-level2" /></label>
      <label className="full">LinkedIn או קישור מקצועי<input type="url" name="linkedin" placeholder="https://linkedin.com/in/..." /></label>
      <label className="full">כמה מילים עליכם<textarea name="message" placeholder="ניסיון רלוונטי, כיוון מקצועי או מידע שחשוב שנכיר." /></label>
      <label className="full upload-box">צירוף קורות חיים<input type="file" name="file" accept=".pdf,.doc,.docx" required /></label>
      <label className="full referral-consent"><input type="checkbox" name="consent" required /><span>אני מאשר/ת ל־Extreme להשתמש בפרטים לצורך בחינת התאמה למשרה ולהזדמנויות מקצועיות רלוונטיות, בהתאם ל<Link href="/privacy">מדיניות הפרטיות</Link>.</span></label>
      <p className="form-note full">בדמו הקובץ נבדק בצד הדפדפן בלבד ואינו מועלה לשרת.</p>
      <button className="button primary full" type="submit">בדיקת הגשת מועמדות <span>←</span></button>
    </div> : <div className="form-grid">
      <label>שם מלא<input name="name" required placeholder="השם שלכם" autoComplete="name" /></label>
      <label>חברה<input name="company" placeholder="שם הארגון" autoComplete="organization" /></label>
      <label>אימייל<input type="email" name="email" required placeholder="name@company.com" autoComplete="email" /></label>
      <label>טלפון<input type="tel" name="phone" placeholder="050-0000000" autoComplete="tel" /></label>
      <label className="full">מה תרצו להשיג?<textarea name="message" required placeholder="כמה מילים על הצורך, התפקיד או הפרויקט יעזרו לנו לחבר את האדם הנכון לשיחה." /></label>
      <label className="full upload-box">אפשר לצרף קורות חיים או בריף<input type="file" name="file" accept=".pdf,.doc,.docx" /></label>
      <p className="form-note full">בשליחת הטופס אתם מאשרים לנו לחזור אליכם לגבי הפנייה. אנחנו משתמשים בפרטים רק כדי לטפל בה, בהתאם ל<Link href="/privacy">מדיניות הפרטיות</Link>.</p>
      <button className="button primary full" type="submit">שלחו פנייה <span>←</span></button>
    </div>}
  </form>;
}
