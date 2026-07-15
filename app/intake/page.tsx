import type { Metadata } from "next";
import { Header } from "../components";
import { IntakeForm } from "./IntakeForm";

export const metadata: Metadata = { title: "מרכז הפנייה", description: "ספרו לנו מה אתם צריכים — גיוס, פרויקט, פרופיל משרה, קורות חיים או שאלה." };

export default async function IntakePage({ searchParams }: { searchParams: Promise<{ track?: string; role?: string; bonus?: string }> }) {
  const { track, role, bonus } = await searchParams;
  return <main className="intake-page"><Header /><div className="shell intake-shell"><section className="intake-copy"><div className="bilingual-head bilingual-head-hero"><h1>ספרו לנו<br />מה אתם <em>צריכים.</em></h1><p className="kicker light">SMART INTAKE HUB</p></div><p>בקשה עסקית, פרופיל משרה, קורות חיים, Referral או שאלה — בוחרים מסלול, משתפים בכמה מילים ואנחנו מחברים את האדם הנכון.</p><div className="contact-note"><strong>מה קורה אחרי השליחה?</strong>חוזרים אליכם בתוך יום עסקים אחד לשיחת מיקוד קצרה. בלי שרשרת העברות ובלי טופס נוסף.</div></section><IntakeForm initialTrack={track} role={role} bonus={bonus} /></div></main>;
}
