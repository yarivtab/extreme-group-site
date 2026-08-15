import type { Metadata } from "next";
import { Header } from "../components";
import { IntakeForm } from "./IntakeForm";

export const metadata: Metadata = {
  title: "מרכז הפנייה",
  description: "ספרו לנו מה אתם צריכים — גיוס, פרויקט, פרופיל משרה, קורות חיים או שאלה.",
  alternates: { canonical: "/intake" },
  robots: { index: false, follow: false },
};

export default async function IntakePage({ searchParams }: { searchParams: Promise<{ track?: string; role?: string; bonus?: string; jobId?: string }> }) {
  const { track, role, bonus, jobId } = await searchParams;
  const isCareer = track === "career";
  return <main className={`intake-page${isCareer ? " career-intake-page" : ""}`}><Header /><div className="shell intake-shell"><section className="intake-copy"><div className="bilingual-head bilingual-head-hero"><h1>{isCareer ? <>מעלים קורות חיים.<br /><em>ממשיכים משם.</em></> : <>ספרו לנו<br />מה אתם <em>צריכים.</em></>}</h1><p className="kicker light">{isCareer ? "QUICK APPLICATION" : "SMART INTAKE HUB"}</p></div><p>{isCareer ? "קובץ אחד, אימייל, ואישור — וזהו. קורות החיים עוברים ישירות לצוות הגיוס שלנו." : "בחרו את סוג הפנייה ושתפו רק את המידע הדרוש כדי שנחבר את האדם הנכון."}</p><div className="contact-note">{isCareer ? <><strong>מה קורה עם ההגשה שלך</strong>קורות החיים נשמרים אצלנו ומועברים במייל לצוות הגיוס.</> : <><strong>סביבת בדיקה</strong>הטופס עדיין אינו שולח פרטים או קבצים.</>}</div></section><IntakeForm initialTrack={track} role={role} bonus={bonus} jobId={jobId} /></div></main>;
}
