import Link from "next/link";

export function Header() {
  return <header className="site-header"><div className="shell nav-wrap">
    <Link className="nav-cta" href="/intake?track=career">הגשת מועמדות <span>←</span></Link>
    <nav aria-label="ניווט ראשי"><Link href="/#experts">מומחים</Link><Link href="/solutions">ארגונים</Link><Link href="/#research">תובנות</Link><Link href="/#vision">חזון</Link><Link href="/#coretado">Coretado</Link></nav>
    <Link href="/" className="brand" aria-label="Extreme Group דף הבית"><img className="brand-logo" src="/extreme-logo.png" alt="Extreme" width="238" height="46" /></Link>
  </div></header>;
}

export function Footer() {
  return <footer className="extreme-footer">
    <div className="shell footer-brand-row">
      <Link href="/" className="brand footer-brand" aria-label="Extreme Group דף הבית"><img className="brand-logo" src="/extreme-logo.png" alt="Extreme" width="238" height="46" /></Link>
      <p>Recruiting Intelligence שמחבר אנשים להזדמנויות הנכונות.</p>
    </div>
    <div className="shell footer-directory">
      <div><strong>מומחים</strong><Link href="/#experts">משרות פתוחות</Link><Link href="/intake?track=career">הגשת מועמדות</Link></div>
      <div><strong>ארגונים</strong><Link href="/solutions">פתרונות</Link><Link href="/solutions#talent">גיוס טכנולוגי</Link><Link href="/solutions#technology">AI ואוטומציה</Link></div>
      <div><strong>תובנות</strong><Link href="/#research">מאמרים ותוכן</Link><Link href="/#research">סקרים ומגמות</Link></div>
      <div><strong>Extreme</strong><Link href="/#vision">חזון</Link><Link href="/#coretado">Coretado</Link></div>
      <div><strong>קשר</strong><Link href="/intake">מרכז הפנייה</Link><a href="mailto:hello@extreme.co.il">hello@extreme.co.il</a></div>
    </div>
    <div className="shell footer-legal"><span>© 2026 Extreme Group</span><span>תל אביב · ישראל</span></div>
  </footer>;
}
