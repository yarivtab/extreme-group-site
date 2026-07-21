"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const tracks = [
  ["talent", "גיוס טכנולוגי"], ["project", "פרויקט AI / אוטומציה"], ["profile", "פרופיל משרה"], ["career", "קורות חיים"], ["referral", "המלצה על מועמד"], ["general", "שאלה כללית"],
];

type CareerStep = "idle" | "submitting" | "done";

export function IntakeForm({ initialTrack, role, bonus, jobId }: { initialTrack?: string; role?: string; bonus?: string; jobId?: string }) {
  const [sent, setSent] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(initialTrack || "talent");
  const isReferral = selectedTrack === "referral";
  const isCareer = selectedTrack === "career";
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }

  // --- Career track: single step (upload + email + consent), no parsing/confirm screen. ---
  const [careerStep, setCareerStep] = useState<CareerStep>("idle");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [careerEmail, setCareerEmail] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [careerError, setCareerError] = useState<string | null>(null);

  async function handleCareerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resumeFile) return;
    setCareerError(null);
    setCareerStep("submitting");
    try {
      const body = new FormData();
      body.append("file", resumeFile);
      body.append("email", careerEmail);
      body.append("jobId", jobId || "");
      body.append("role", role || "");
      body.append("consent", consentChecked ? "true" : "false");
      const response = await fetch("/api/intake/apply", { method: "POST", body });
      const data = await response.json().catch(() => null) as { ok?: boolean; error?: string } | null;
      if (response.ok && data?.ok) {
        setCareerStep("done");
      } else {
        setCareerError(data?.error || "לא הצלחנו לשמור את ההגשה. נסו שוב.");
        setCareerStep("idle");
      }
    } catch {
      setCareerError("לא הצלחנו לשמור את ההגשה. בדקו את החיבור לאינטרנט ונסו שוב.");
      setCareerStep("idle");
    }
  }

  if (isCareer && careerStep === "done") {
    return <div className="success-panel" role="status">
      <span>התקבל</span>
      <h2>קיבלנו את קורות החיים<br />שלך.</h2>
      <p>קורות החיים הועברו לצוות הגיוס שלנו ונחזור אליך אם נמצא התאמה.</p>
      <Link href="/experts#roles" className="button primary">חזרה לאתר <span>←</span></Link>
    </div>;
  }

  if (sent) return <div className="success-panel demo-success" role="status"><span>DEMO / VALIDATED</span><h2>הטופס תקין<br />ומוכן לחיבור.</h2><p>זו עדיין סביבת בדיקה: הפרטים והקובץ לא נשלחו ולא נשמרו. לאחר חיבור מערכת אדם, המועמדות תועבר למשרה הנכונה.</p><Link href={isReferral ? "/experts#roles" : "/"} className="button primary">חזרה לאתר <span>←</span></Link></div>;

  return <form className="intake-form" onSubmit={isCareer ? handleCareerSubmit : submit}>
    {!initialTrack && <fieldset className="track-fieldset"><legend>איך אפשר לעזור?</legend><div className="track-grid">{tracks.map(([value,label])=><label className="track-option" key={value}><input type="radio" name="track" value={value} checked={selectedTrack === value} onChange={() => setSelectedTrack(value)}/><span>{label}</span></label>)}</div></fieldset>}
    {isReferral && <div className="referral-form-summary"><span>REFERRAL PILOT</span><strong>{role || "משרה לבחירה"}</strong>{bonus && <b>מענק מוצע: ₪{Number(bonus).toLocaleString("he-IL")}</b>}<small>הסכום והתנאים הסופיים יאושרו לאחר החיבור ל־ATS.</small></div>}
    {isCareer && <div className="career-form-summary"><span>APPLICATION</span><strong>{role || "הגשת קורות חיים כללית"}</strong><small>{jobId ? `מספר משרה: ${jobId}` : "קובץ אחד להזדמנויות מקצועיות רלוונטיות"}</small></div>}
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
    </div> : isCareer ? <div className="form-grid career-application-grid compact-career-grid">
      <label className="full upload-box career-upload"><strong>העלאת קורות חיים</strong><span>PDF, DOC או DOCX</span><input type="file" name="file" accept=".pdf,.doc,.docx" required onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} /></label>
      <label className="full">אימייל לקבלת אישור<input type="email" value={careerEmail} onChange={(e) => setCareerEmail(e.target.value)} required placeholder="name@email.com" autoComplete="email" /></label>
      <label className="full referral-consent compact-consent"><input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} required /><span>אני מאשר/ת ל־Extreme להשתמש בפרטים לבחינת התאמה, בהתאם ל<Link href="/privacy">מדיניות הפרטיות</Link>.</span></label>
      {careerError && <p className="career-error full" role="alert">{careerError}</p>}
      <button className="button primary full" type="submit" disabled={careerStep === "submitting" || !resumeFile}>{careerStep === "submitting" ? "שולח..." : "שליחת קורות חיים"} <span>←</span></button>
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
