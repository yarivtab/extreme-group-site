export type JobCategory = {
  slug: string;
  label: string;
  title: string;
  eyebrow: string;
  description: string;
  fields: string[];
  skills: string[];
  questions: { title: string; text: string }[];
};

export const jobCategories: JobCategory[] = [
  { slug: "ai", label: "AI", title: "משרות AI ובינה מלאכותית", eyebrow: "AI CAREERS", description: "תפקידים המחברים מודלים, Data, מוצר ואוטומציה למערכות שעובדות בעולם האמיתי.", fields: ["AI / AUTOMATION"], skills: ["LLMs ו־GenAI", "Python ו־APIs", "Agentic Automation", "MLOps", "Product Thinking"], questions: [
    { title: "מה ארגונים מחפשים?", text: "לא רק היכרות עם מודלים, אלא יכולת להפוך צורך עסקי ליישום מדיד, בטוח ומשולב במערכות הקיימות." },
    { title: "למי זה מתאים?", text: "למפתחים, אנשי Data, אוטומציה ומוצר שכבר בנו מערכות ורוצים לעבוד קרוב יותר לשכבת ה־AI." },
  ] },
  { slug: "data", label: "Data", title: "משרות Data", eyebrow: "DATA CAREERS", description: "הזדמנויות בבניית תשתיות, pipelines ומוצרי מידע שמאפשרים לארגונים לקבל החלטות ולפתח יכולות AI.", fields: ["DATA"], skills: ["Python", "SQL", "Data Pipelines", "Cloud Warehouses", "Data Quality"], questions: [
    { title: "למה Data חשוב עכשיו?", text: "מודל AI טוב ככל שיהיה תלוי באיכות, בהקשר ובזמינות של המידע שמפעיל אותו." },
    { title: "מה בודקים בהתאמה?", text: "עומק טכני, ניסיון בסקייל, הבנת משתמשים ויכולת לבנות שכבת מידע שאפשר לסמוך עליה." },
  ] },
  { slug: "development", label: "פיתוח", title: "משרות פיתוח תוכנה", eyebrow: "SOFTWARE CAREERS", description: "משרות Backend, Frontend ו־Full‑Stack בצוותי מוצר, פלטפורמה ומערכות ארגוניות.", fields: ["ENGINEERING"], skills: ["TypeScript", "React", "Backend", "Cloud", "System Design"], questions: [
    { title: "מעבר ל־Tech Stack", text: "אנחנו בוחנים גם את סוג המוצר, אופי הצוות, רמת הבעלות והסביבה שבה המפתח או המפתחת יוכלו להצליח." },
    { title: "מה הופך תפקיד למדויק?", text: "שילוב נכון בין אתגר טכנולוגי, השפעה, קצב, מודל עבודה והשלב המקצועי הבא." },
  ] },
  { slug: "devops-cloud", label: "DevOps וענן", title: "משרות DevOps ו־Cloud", eyebrow: "CLOUD CAREERS", description: "תפקידי תשתיות, פלטפורמה ואמינות שמאפשרים לצוותי פיתוח לספק מערכות במהירות ובביטחון.", fields: ["CLOUD / INFRA"], skills: ["AWS / GCP", "Kubernetes", "Terraform", "CI/CD", "Observability"], questions: [
    { title: "מה נדרש היום?", text: "שילוב בין אוטומציה, אבטחה, הבנת מערכות ויכולת לעבוד עם צוותי פיתוח ומוצר." },
    { title: "איך אנחנו מתאימים?", text: "לפי סביבת הענן, קנה המידה, רמת הבעלות, מודל הכוננויות והבשלות ההנדסית של הארגון." },
  ] },
  { slug: "cyber", label: "סייבר", title: "משרות סייבר ואבטחת מידע", eyebrow: "CYBER CAREERS", description: "תפקידים באבטחת Cloud ואפליקציות, ניהול סיכונים, חקירה והגנה על מערכות קריטיות.", fields: ["SECURITY"], skills: ["Cloud Security", "Application Security", "Incident Response", "Risk", "Security Architecture"], questions: [
    { title: "איזה ניסיון חשוב?", text: "ניסיון מעשי בסביבה הרלוונטית, יכולת חקירה והבנה של הדרך שבה אבטחה משתלבת בפיתוח ובתפעול." },
    { title: "איך נראית התאמה טובה?", text: "התאמה בין ההתמחות, רמת האחריות, הרגולציה והתרבות שבה צוותי אבטחה וטכנולוגיה עובדים יחד." },
  ] },
];

export function getJobCategory(slug: string) {
  return jobCategories.find((category) => category.slug === slug);
}
