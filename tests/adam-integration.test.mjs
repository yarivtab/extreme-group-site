import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createEditorialProjection } from "../lib/job-editorial.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("keeps Adam credentials server-side and protects synchronization", async () => {
  const [adapter, route, example, gitignore] = await Promise.all([
    read("../lib/adam.ts"),
    read("../app/api/adam/sync/route.ts"),
    read("../.env.example"),
    read("../.gitignore"),
  ]);

  assert.match(adapter, /ADAM_COMPANY_TOKEN/);
  assert.match(adapter, /GetOrdersDetails/);
  assert.match(route, /x-adam-sync-secret/);
  assert.match(route, /status: 401/);
  assert.match(example, /ADAM_COMPANY_TOKEN=\n/);
  assert.match(example, /ADAM_SYNC_SECRET=\n/);
  assert.match(gitignore, /\.env\*/);
  assert.doesNotMatch(`${adapter}\n${route}\n${example}`, /railcareer/i);
  assert.doesNotMatch(`${adapter}\n${route}\n${example}`, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
});

test("publishes only the approved public job projection", async () => {
  const [adapter, database, qaPage, publicJobsPage, publicJobsExplorer, homePage, jobPage, jobPreview] = await Promise.all([
    read("../lib/adam.ts"),
    read("../lib/adam-db.ts"),
    read("../app/qa/adam/page.tsx"),
    read("../app/experts/page.tsx"),
    read("../app/experts/JobsExplorer.tsx"),
    read("../app/page.tsx"),
    read("../app/jobs/[slug]/page.tsx"),
    read("../app/jobs/[slug]/opengraph-image.tsx"),
  ]);

  assert.match(adapter, /descriptionText/);
  assert.match(adapter, /profession_name/);
  assert.match(adapter, /order_def_area_name1/);
  assert.match(database, /adam_job_publications/);
  assert.match(database, /public_title/);
  assert.doesNotMatch(database, /email_rakaz|email_snif|telefon|perot_tafked/);
  assert.match(qaPage, /index: false, follow: false/);
  assert.match(qaPage, /readAdamJobs/);
  assert.match(publicJobsPage, /readAdamJobs/);
  assert.match(publicJobsPage, /PublicJobCard/);
  assert.match(publicJobsPage, /daysSincePublished/);
  assert.match(publicJobsPage, /workArrangement/);
  assert.doesNotMatch(publicJobsPage, /sourceTitle:\s*job\.sourceTitle|sourceDescriptionText:\s*job\.sourceDescriptionText/);
  assert.match(publicJobsExplorer, /pageSize = 12/);
  assert.match(publicJobsExplorer, /experts-load-more/);
  assert.match(publicJobsExplorer, /publishedLabel/);
  assert.match(homePage, /readAdamJobs/);
  assert.match(jobPage, /summary_large_image/);
  assert.match(jobPreview, /readAdamJobBySlug/);
  assert.match(jobPreview, /OPEN POSITION/);
  assert.match(jobPreview, /jobNumber/);
  assert.doesNotMatch(`${publicJobsPage}\n${homePage}`, /DEMO DATA/);
});

test("responsible publisher removes recruitment language and job numbers", () => {
  const projection = createEditorialProjection({
    id: 23651,
    slug: "full-stack-23651",
    title: "דרוש/ה מפתח/ת Full Stack - מספר משרה 23651",
    profession: "פיתוח",
    subprofession: "Full Stack",
    location: "תל אביב",
    areas: ["מרכז"],
    jobScope: "משרה מלאה",
    descriptionText: "דרוש/ה מפתח/ת Full Stack - מספר משרה 23651\nבניית מערכות Web מורכבות.\nבניית מערכות Web מורכבות.",
    requirementsText: "3 שנות ניסיון",
    publishedAt: null,
    closesAt: null,
    sourceUpdatedAt: null,
    referralReward: 0,
  });

  assert.equal(projection.publicTitle, "מפתח/ת Full Stack");
  assert.equal(projection.publicSummary, "בניית מערכות Web מורכבות.");
  assert.equal(projection.publicDescription, "בניית מערכות Web מורכבות.");
  assert.equal(projection.status, "auto_published");
  assert.doesNotMatch(projection.publicTitle, /דרוש|23651|מספר משרה/);

  const genericCampaign = createEditorialProjection({
    ...projection,
    id: 23045,
    slug: "it-23045",
    title: "מחפשים את ההזדמנות הבאה שלכם בעולם ה-IT ?",
    profession: "אחר",
    subprofession: "",
    location: "",
    areas: [],
    jobScope: "",
    descriptionText: "Help Desk Support, NOC Engineer, System Administrator",
    requirementsText: "0",
    publishedAt: null,
    closesAt: null,
    sourceUpdatedAt: null,
    referralReward: 0,
  });
  assert.equal(genericCampaign.publicTitle, "משרות תמיכה ותשתיות IT");
  assert.match(genericCampaign.publicSummary, /Help Desk, NOC, System, Cloud/);
  assert.equal(genericCampaign.publicRequirements, "");
});

test("keeps the public site focused on working content and a lean application", async () => {
  const [intakeForm, insightsPage, insightPage, solutionsPage, components] = await Promise.all([
    read("../app/intake/IntakeForm.tsx"),
    read("../app/insights/page.tsx"),
    read("../app/insights/[slug]/page.tsx"),
    read("../app/solutions/page.tsx"),
    read("../app/components.tsx"),
  ]);

  assert.match(intakeForm, /career-upload/);
  // Career-track applicants aren't asked for an email address (cut deliberately
  // to reduce friction) — keep the assertion pointed at that intent instead of
  // a label that no longer exists.
  assert.doesNotMatch(intakeForm, /אימייל לקבלת אישור/);
  assert.match(intakeForm, /שליחת קורות חיים/);
  assert.doesNotMatch(insightsPage, /בקרוב|insight-video/);
  assert.doesNotMatch(solutionsPage, /COMING SOON|sivan-video/);
  assert.doesNotMatch(components, /exi-dock/);
  assert.match(insightPage, /!insight\.isDraft/);
});
