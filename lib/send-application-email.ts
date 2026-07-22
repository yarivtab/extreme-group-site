import { env } from "cloudflare:workers";

// Sends the candidate's resume as an email attachment to the recruiting
// inbox via Resend (https://resend.com). This is the "send it to a human"
// half of the career intake flow: simple, no parsing, no confirm screen —
// per Yariv's call to cut friction for the target audience. The application
// is still saved to D1/R2 first (see lib/candidate-applications-db.ts) so a
// failed or spam-filtered email never means the application is lost.

export class ApplicationEmailNotConfiguredError extends Error {
  constructor() {
    super("RESEND_API_KEY is not configured — application emails cannot be sent.");
    this.name = "ApplicationEmailNotConfiguredError";
  }
}

export type ApplicationEmailInput = {
  candidateEmail?: string | null;
  jobId?: number | null;
  jobSlug?: string | null;
  role?: string | null;
  resumeBytes: ArrayBuffer;
  resumeFilename: string;
  resumeContentType: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Emails the resume to the recruiting inbox. Throws
 * `ApplicationEmailNotConfiguredError` if no Resend key is set, and a plain
 * `Error` for any upstream failure. Callers must treat this as best-effort —
 * a thrown error here must NOT fail the candidate's submission, since the
 * D1/R2 record is the durable copy of the application.
 */
export async function sendApplicationEmail(input: ApplicationEmailInput): Promise<{ id: string }> {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const apiKey = (runtimeEnv.RESEND_API_KEY || process.env.RESEND_API_KEY)?.trim();
  if (!apiKey) throw new ApplicationEmailNotConfiguredError();

  const fromAddress = (runtimeEnv.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "").trim();
  if (!fromAddress) throw new Error("RESEND_FROM_EMAIL is not configured");
  const toAddress = (runtimeEnv.JOBS_INBOX_EMAIL || process.env.JOBS_INBOX_EMAIL || "jobs@extreme.co.il").trim();

  const candidateEmail = input.candidateEmail?.trim() || "";
  const subject = input.role ? `הגשת מועמדות דרך האתר: ${input.role}` : "הגשת מועמדות חדשה דרך האתר";
  const html = `<div dir="rtl" style="font-family:sans-serif;font-size:15px;line-height:1.6">
    <p>התקבלה הגשת מועמדות חדשה דרך טופס הקריירה באתר.</p>
    ${candidateEmail ? `<p><strong>אימייל המועמד/ת:</strong> ${escapeHtml(candidateEmail)}</p>` : ""}
    ${input.role ? `<p><strong>תפקיד:</strong> ${escapeHtml(input.role)}</p>` : ""}
    ${input.jobId ? `<p><strong>מספר משרה:</strong> ${input.jobId}</p>` : ""}
    <p>קורות החיים מצורפים לאימייל זה.</p>
  </div>`;

  const base64Content = Buffer.from(input.resumeBytes).toString("base64");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: fromAddress,
      to: [toAddress],
      ...(candidateEmail ? { reply_to: candidateEmail } : {}),
      subject,
      html,
      attachments: [{ content: base64Content, filename: input.resumeFilename, content_type: input.resumeContentType }],
    }),
  });

  if (!response.ok) {
    const message = (await response.text()).slice(0, 300);
    throw new Error(`Resend request failed (${response.status}): ${message}`);
  }

  const data = (await response.json()) as { id?: string };
  return { id: data.id ?? "" };
}
