import Link from "next/link";

export function Header() {
  return <header className="site-header"><div className="shell nav-wrap">
    <Link className="nav-cta" href="/intake?track=career">הגשת מועמדות <span>←</span></Link>
    <nav aria-label="ניווט ראשי"><Link href="/#experts">מומחים</Link><Link href="/solutions">ארגונים</Link><Link href="/#research">מחקר</Link><Link href="/#vision">חזון</Link><Link href="/#coretado">Coretado</Link></nav>
    <Link href="/" className="brand" aria-label="Extreme Group דף הבית"><img className="brand-logo" src="/extreme-logo.png" alt="Extreme" width="238" height="46" /></Link>
  </div></header>;
}

export function Footer() {
  return <footer><div className="shell footer-grid"><div><Link href="/" className="brand footer-brand"><img className="brand-logo" src="/extreme-logo.png" alt="Extreme" width="238" height="46" /></Link><p>אנשים מעולים. מערכות חכמות. פחות חיכוך.</p></div><div><strong>לארגונים</strong><Link href="/solutions">פתרונות</Link><Link href="/solutions#talent">גיוס טכנולוגי</Link><Link href="/solutions#technology">AI ואוטומציה</Link></div><div><strong>למועמדים</strong><Link href="/#careers">משרות פתוחות</Link><Link href="/intake?track=career">שליחת קורות חיים</Link></div><div><strong>בואו נדבר</strong><Link href="/intake">מרכז הפנייה</Link><a href="mailto:hello@extreme.co.il">hello@extreme.co.il</a></div></div><div className="shell footer-bottom"><span>© 2026 Extreme Group</span><span>תל אביב · ישראל</span></div></footer>;
}
