import { validateResumeFile } from "../../../../lib/resume-upload";
import { createCandidateApplication, storeResumeInR2, updateNotificationEmailStatus } from "../../../../lib/candidate-applications-db";
import { sendApplicationEmail, ApplicationEmailNotConfiguredError } from "../../../../lib/send-application-email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The only route that actually saves a career application. Single step:
 * upload + email + consent (no parsing/confirm screen — see
 * docs/intake-ux-notes.md for why that got cut).
 *
 * Order of operations matters here:
 * 1. Save the resume to R2 + a metadata row to D1 — this is the durable
 *    record. The client must only show a success state after this succeeds.
 * 2. Best-effort email the resume to the recruiting inbox via Resend. A
 *    failure here (missing key, Resend outage, etc.) must NOT fail the
 *    request — the D1/R2 row is already saved either way. The outcome is
 *    recorded in notification_email_status so a silent email failure is
 *    still visible to whoever checks the database.
 *
 * IMPORTANT: this does NOT submit the candidate to Adam — that integration
 * doesn't exist yet (see docs/adam-candidate-api-requirements.md).
 */
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ ok: false, error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "Missing resume file" }, { status: 400 });
  }

  const validationError = validateResumeFile(file);
  if (validationError) {
    return Response.json({ ok: false, error: validationError }, { status: 400 });
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ ok: false, error: "Invalid email address" }, { status: 400 });
  }

  const consentGiven = formData.get("consent") === "true" || formData.get("consent") === "on";
  if (!consentGiven) {
    return Response.json({ ok: false, error: "Consent is required" }, { status: 400 });
  }

  const jobIdRaw = formData.get("jobId");
  const jobId = typeof jobIdRaw === "string" && jobIdRaw.trim() && !Number.isNaN(Number(jobIdRaw))
    ? Number(jobIdRaw)
    : null;
  const role = String(formData.get("role") ?? "").trim() || null;

  const contentType = file.type || "application/octet-stream";
  const bytes = await file.arrayBuffer();

  let resumeR2Key: string;
  try {
    resumeR2Key = await storeResumeInR2({ bytes, contentType, filename: file.name });
  } catch (error) {
    console.error("Failed to store resume in R2:", error instanceof Error ? error.message : error);
    return Response.json({ ok: false, error: "Could not save the resume file. Please try again." }, { status: 502 });
  }

  let applicationId: string;
  try {
    const { id } = await createCandidateApplication({
      jobId,
      email,
      resumeR2Key,
      resumeFilename: file.name,
      resumeContentType: contentType,
      resumeSizeBytes: file.size,
      consentGiven,
    });
    applicationId = id;
  } catch (error) {
    console.error("Failed to save candidate application:", error instanceof Error ? error.message : error);
    return Response.json({ ok: false, error: "Could not save your application. Please try again." }, { status: 502 });
  }

  // From here on the application is already saved — email failures are
  // logged and recorded, never surfaced to the candidate as a failure.
  try {
    await sendApplicationEmail({ candidateEmail: email, jobId, role, resumeBytes: bytes, resumeFilename: file.name, resumeContentType: contentType });
    await updateNotificationEmailStatus(applicationId, "sent");
  } catch (error) {
    const isNotConfigured = error instanceof ApplicationEmailNotConfiguredError;
    if (!isNotConfigured) {
      console.error("Failed to send application notification email:", error instanceof Error ? error.message : error);
    }
    await updateNotificationEmailStatus(applicationId, isNotConfigured ? "not_configured" : "failed").catch(() => {});
  }

  return Response.json({ ok: true, id: applicationId });
}
