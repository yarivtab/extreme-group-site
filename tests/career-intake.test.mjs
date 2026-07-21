import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validateResumeFile } from "../lib/resume-upload.ts";
import { extractResumeText } from "../lib/resume-text-extract.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

// A minimal hand-built one-page PDF with a real text layer, so extraction
// can be verified end-to-end without a binary fixture file.
const SAMPLE_PDF_TEXT = "Yariv Tabac - yarivt@extreme.co.il";
const SAMPLE_PDF = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 300 144] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length 68 >>
stream
BT /F1 18 Tf 20 100 Td (${SAMPLE_PDF_TEXT}) Tj ET
endstream
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000241 00000 n
0000000312 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
430
%%EOF
`;

function pdfBytes() {
  return new TextEncoder().encode(SAMPLE_PDF).buffer;
}

test("validateResumeFile rejects empty, oversized, and wrong-type uploads", () => {
  const emptyFile = new File([], "resume.pdf", { type: "application/pdf" });
  assert.match(validateResumeFile(emptyFile) ?? "", /empty/i);

  const oversized = new File([new Uint8Array(9 * 1024 * 1024)], "resume.pdf", { type: "application/pdf" });
  assert.match(validateResumeFile(oversized) ?? "", /too large/i);

  const wrongType = new File(["hello"], "resume.exe", { type: "application/x-msdownload" });
  assert.match(validateResumeFile(wrongType) ?? "", /unsupported/i);

  const validPdf = new File(["%PDF-1.4"], "resume.pdf", { type: "application/pdf" });
  assert.equal(validateResumeFile(validPdf), null);
});

test("extractResumeText reads text from a real PDF and flags unsupported formats", async () => {
  const pdfResult = await extractResumeText({ bytes: pdfBytes(), filename: "resume.pdf", contentType: "application/pdf" });
  assert.equal(pdfResult.status, "ok");
  assert.match(pdfResult.text, /Yariv Tabac/);

  const docResult = await extractResumeText({ bytes: new ArrayBuffer(10), filename: "resume.doc", contentType: "application/msword" });
  assert.equal(docResult.status, "unsupported");
});

test("parse/confirm flow is disabled — kept dormant, not deleted", async () => {
  const [parseRoute, parser] = await Promise.all([
    read("../app/api/intake/parse/route.ts"),
    read("../lib/resume-parser.ts"),
  ]);

  // The route must be an inert 404, not a live parsing endpoint — the
  // parse/confirm screen was cut per docs/intake-ux-notes.md, but the
  // underlying parser is kept working for a possible future "more
  // comprehensive system".
  assert.match(parseRoute, /status: 404/);
  assert.doesNotMatch(parseRoute, /createCandidateApplication|storeResumeInR2/);

  assert.match(parser, /ResumeParserNotConfiguredError/);
  assert.match(parser, /OPENAI_API_KEY/);
});

test("apply route validates input, saves before responding, and only best-effort emails", async () => {
  const [applyRoute, db, email] = await Promise.all([
    read("../app/api/intake/apply/route.ts"),
    read("../lib/candidate-applications-db.ts"),
    read("../lib/send-application-email.ts"),
  ]);

  assert.match(applyRoute, /Invalid email address/);
  assert.match(applyRoute, /Consent is required/);
  assert.match(applyRoute, /ok: true, id: applicationId/);

  // Resume bytes must go to R2, never into a D1 column.
  assert.match(db, /storeResumeInR2/);
  assert.doesNotMatch(db, /resume_bytes|resumeBytes/);
  assert.match(db, /received_pending_adam_sync/);

  // Order matters: R2 + D1 save must happen (and be able to fail the
  // request) before the best-effort email is attempted.
  const r2Index = applyRoute.indexOf("storeResumeInR2");
  const dbIndex = applyRoute.indexOf("createCandidateApplication(");
  const emailIndex = applyRoute.indexOf("sendApplicationEmail(");
  assert.ok(r2Index > -1 && dbIndex > -1 && emailIndex > -1, "expected all three calls to be present");
  assert.ok(r2Index < dbIndex, "resume must be stored in R2 before the D1 row is created");
  assert.ok(dbIndex < emailIndex, "the D1/R2 record must be saved before the notification email is attempted");

  // A failed/unconfigured email must never fail the HTTP response — it's
  // only ever recorded via notification_email_status.
  assert.match(applyRoute, /updateNotificationEmailStatus/);
  assert.doesNotMatch(applyRoute, /catch[\s\S]{0,120}sendApplicationEmail[\s\S]{0,120}status:\s*(500|502)/);

  assert.match(email, /ApplicationEmailNotConfiguredError/);
  assert.match(email, /RESEND_API_KEY/);
  assert.match(email, /api\.resend\.com/);
});

test("career success screen reports a real save, not a demo/no-op", async () => {
  const intakeForm = await read("../app/intake/IntakeForm.tsx");
  assert.match(intakeForm, /קיבלנו את קורות החיים/);
  assert.match(intakeForm, /careerStep === "done"/);
  // The career track's own success branch must be checked before the
  // generic demo-success branch, and must not itself be the demo path.
  const doneIndex = intakeForm.indexOf('careerStep === "done"');
  const demoIndex = intakeForm.indexOf("demo-success");
  assert.ok(doneIndex > -1 && demoIndex > -1 && doneIndex < demoIndex);

  // Single-step form: no separate parse/confirm UI state left wired up.
  assert.doesNotMatch(intakeForm, /careerStep === "parsing"|careerStep === "confirm"/);
  assert.match(intakeForm, /"\/api\/intake\/apply"/);
});
