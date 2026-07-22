"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks: [string, string][] = [
  ["/experts", "מומחים"], ["/solutions", "ארגונים"], ["/insights", "תובנות"], ["/vision", "חזון"],
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <header className="site-header"><div className="shell nav-wrap">
    <Link className="nav-cta" href="/intake?track=career">הגשת מועמדות <span>←</span></Link>
    <button
      type="button"
      className="nav-toggle"
      aria-label={menuOpen ? "סגירת תפריט" : "פתיחת תפריט"}
      aria-expanded={menuOpen}
      onClick={() => setMenuOpen((open) => !open)}
    ><span /><span /><span /></button>
    <nav aria-label="ניווט ראשי" className={menuOpen ? "nav-open" : undefined}>
      {navLinks.map(([href, label]) => <Link href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
    </nav>
    <Link href="/" className="brand" aria-label="Extreme Group דף הבית"><img className="brand-logo" src="/extreme-logo.png" alt="Extreme" width="238" height="46" /></Link>
  </div></header>;
}

export function Footer() {
  return <footer className="extreme-footer">
    <div className="shell footer-brand-row">
      <p>Recruiting Intelligence שמחבר אנשים להזדמנויות הנכונות.</p>
      <div className="footer-socials" aria-label="עקבו אחרינו"><a href="https://www.linkedin.com/company/extreme-technologies" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://on.fb.me/1Fe92Pr" target="_blank" rel="noreferrer">Facebook ↗</a><a href="https://bit.ly/1D2IoVF" target="_blank" rel="noreferrer">Instagram ↗</a></div>
    </div>
    <div className="shell footer-directory">
      <div><strong>מומחים</strong><Link href="/experts#roles">משרות פתוחות</Link><Link href="/intake?track=career">הגשת מועמדות</Link></div>
      <div><strong>ארגונים</strong><Link href="/solutions">פתרונות</Link><Link href="/solutions#talent">גיוס טכנולוגי</Link><Link href="/solutions#technology">AI ואוטומציה</Link></div>
      <div><strong>תובנות</strong><Link href="/insights">בלוגים ומאמרים שלנו</Link><Link href="/insights#latest">סקרים ומגמות</Link></div>
      <div><strong>Extreme</strong><Link href="/vision">חזון</Link><Link href="/#coretado">Coretado</Link></div>
      <div><strong>קשר</strong><Link href="/intake">מרכז הפנייה</Link><a href="mailto:hello@extreme.co.il">hello@extreme.co.il</a></div>
    </div>
    <div className="shell footer-legal"><span>© 2026 Extreme Group</span><Link href="/privacy">מדיניות פרטיות</Link><span>תל אביב · ישראל</span></div>
  </footer>;
}
