export type Job = {
  slug: string;
  title: string;
  field: string;
  type: string;
  location: string;
  workMode: string;
  experience: string;
  referralBonus: number;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const jobs: Job[] = [
  {
    slug: "senior-full-stack-developer",
    title: "Senior Full‑Stack Developer",
    field: "ENGINEERING",
    type: "משרה מלאה",
    location: "תל אביב",
    workMode: "היברידי",
    experience: "5+ שנות ניסיון",
    referralBonus: 3500,
    summary: "הובלת פיתוח של מוצרים דיגיטליים מורכבים, מהארכיטקטורה ועד לחוויית המשתמש.",
    responsibilities: ["פיתוח end-to-end בסביבת Web מודרנית", "קבלת החלטות ארכיטקטוניות ועבודה עם צוותי מוצר", "כתיבת קוד איכותי, בדיקות ו־code review"],
    requirements: ["ניסיון משמעותי ב־TypeScript וב־React", "ניסיון בפיתוח צד שרת ובמסדי נתונים", "יכולת הובלה ותקשורת מצוינת"],
  },
  {
    slug: "ai-automation-lead",
    title: "AI Automation Lead",
    field: "AI / AUTOMATION",
    type: "משרה מלאה",
    location: "מרכז",
    workMode: "היברידי",
    experience: "4+ שנות ניסיון",
    referralBonus: 5000,
    summary: "הובלת פתרונות AI ואוטומציה שמחברים בין מודלים, תהליכים ומערכות ארגוניות.",
    responsibilities: ["אפיון והקמה של סוכני AI ותהליכים אוטומטיים", "חיבור למערכות ארגוניות ומקורות מידע", "הובלת פיילוטים עד לייצור ומדידת ערך"],
    requirements: ["ניסיון מעשי ב־LLMs ובאוטומציה", "היכרות עם APIs ואינטגרציות", "חשיבה עסקית ויכולת עבודה מול לקוחות"],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    field: "CLOUD / INFRA",
    type: "משרה מלאה",
    location: "השרון",
    workMode: "היברידי",
    experience: "3+ שנות ניסיון",
    referralBonus: 3000,
    summary: "בניית תשתיות ענן יציבות, מאובטחות ומהירות עבור מערכות בקנה מידה גבוה.",
    responsibilities: ["ניהול תשתיות Cloud ו־Kubernetes", "בניית תהליכי CI/CD ואוטומציה", "שיפור ניטור, ביצועים ואמינות"],
    requirements: ["ניסיון ב־AWS או GCP", "ניסיון ב־Terraform וב־Kubernetes", "שליטה ב־Linux ובכתיבת סקריפטים"],
  },
  {
    slug: "data-engineer",
    title: "Data Engineer",
    field: "DATA",
    type: "משרה מלאה",
    location: "תל אביב",
    workMode: "היברידי",
    experience: "3+ שנות ניסיון",
    referralBonus: 3500,
    summary: "הקמת תשתיות Data אמינות שמאפשרות לצוותים לקבל החלטות ולבנות מוצרי AI.",
    responsibilities: ["פיתוח pipelines ותהליכי עיבוד נתונים", "תכנון מודלים ותשתיות Data בענן", "עבודה עם צוותי Analytics ו־ML"],
    requirements: ["ניסיון חזק ב־Python וב־SQL", "היכרות עם כלי orchestration ו־data warehouse", "הבנה של איכות נתונים וסקייל"],
  },
  {
    slug: "cybersecurity-specialist",
    title: "Cybersecurity Specialist",
    field: "SECURITY",
    type: "משרה מלאה",
    location: "מרכז",
    workMode: "היברידי",
    experience: "4+ שנות ניסיון",
    referralBonus: 4000,
    summary: "חיזוק מערכי הגנה, זיהוי סיכונים והטמעת אבטחה כחלק מתהליכי הפיתוח.",
    responsibilities: ["ביצוע הערכות סיכון ובקרות אבטחה", "ליווי צוותי פיתוח וענן", "טיפול באירועים ושיפור מוכנות"],
    requirements: ["ניסיון באבטחת Cloud ואפליקציות", "היכרות עם תקנים ומתודולוגיות אבטחה", "יכולת חקירה וירידה לפרטים"],
  },
  {
    slug: "technical-product-manager",
    title: "Technical Product Manager",
    field: "PRODUCT",
    type: "משרה מלאה",
    location: "תל אביב",
    workMode: "היברידי",
    experience: "4+ שנות ניסיון",
    referralBonus: 3000,
    summary: "חיבור בין צורך עסקי, משתמשים וטכנולוגיה כדי להוביל מוצר מורכב לתוצאה ברורה.",
    responsibilities: ["הגדרת חזון, roadmap ומדדי הצלחה", "עבודה צמודה עם פיתוח, עיצוב ולקוחות", "תעדוף והובלת delivery מקצה לקצה"],
    requirements: ["ניסיון בניהול מוצר טכנולוגי B2B", "הבנה טכנית ויכולת עבודה עם צוותי R&D", "תקשורת מעולה וקבלת החלטות מבוססת נתונים"],
  },
];
