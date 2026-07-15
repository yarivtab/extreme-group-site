import Link from "next/link";

export function Header() {
  return <header className="site-header"><div className="shell nav-wrap">
    <Link href="/" className="brand" aria-label="Extreme Group דף הבית"><img className="brand-logo" src="/extreme-logo.png" alt="Extreme" width="238" height="46" /></Link>
    <nav aria-label="ניווט ראשי"><Link href="/#solutions">פתרונות</Link><Link href="/#why">למה Extreme</Link><Link href="/#process">איך זה עובד</Link><Link href="/#coretado">Coretado.ai</Link><Link href="/jobs">משרות</Link></nav>
    <Link className="nav-cta" href="/#contact">דברו איתנו <span>←</span></Link>
  </div></header>;
}

export function Footer() {
  return <footer><div className="shell footer-grid"><div><Link href="/" className="brand footer-brand"><img className="brand-logo" src="/extreme-logo.png" alt="Extreme" width="238" height="46" /></Link><p>Smart Tech + Talent. פחות חיכוך, יותר תוצאה.</p></div><div><strong>פתרונות</strong><Link href="/#solutions">גיוס טכנולוגי</Link><Link href="/#solutions">AI ואוטומציה</Link><Link href="/#coretado">Coretado.ai</Link></div><div><strong>מומחים</strong><Link href="/jobs">משרות פתוחות</Link><Link href="/intake?track=career">שליחת קורות חיים</Link></div><div><strong>בואו נדבר</strong><Link href="/#contact">פנייה עסקית</Link><a href="mailto:hello@extreme.co.il">hello@extreme.co.il</a></div></div><div className="shell footer-bottom"><span>© 2026 Extreme Group</span><span>תל אביב · ישראל</span></div></footer>;
}
