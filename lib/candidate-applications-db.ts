import { env } from "cloudflare:workers";
import type { ParsedResumeFields } from "./resume-parser";

// Candidate applications submitted through /intake?track=career.
//
// The resume file itself is stored in R2 (`RESUMES` binding) — D1 only ever
// holds the R2 object key plus small text/JSON fields. Cloudflare's own
// guidance is to never store files in D1 rows (1 MiB row limit; D1 backups
// balloon with binary data), so this deliberately follows the same
// self-healing "ensure schema" pattern as lib/adam-db.ts rather than relying
// on a separate migration step against the live database.
//
// `status` tracks the (still pending) handoff to Adam. Nothing here is
// forwarded to Adam automatically — that integration doesn't exist yet, see
// docs/adam-candidate-api-requirements.md. Submissions sit as
// `received_pending_adam_sync` until that's built.

const createCandidateApplicationsSql = `CREATE TABLE IF NOT EXISTS candidate_applications (
  id TEXT PRIMARY KEY,
  job_id INTEGER,
  job_slug TEXT,
  email TEXT NOT NULL,
  resume_r2_key TEXT NOT NULL,
  resume_filename TEXT NOT NULL,
  resume_content_type TEXT NOT NULL,
  resume_size_bytes INTEGER NOT NULL,
  parsed_fields_json TEXT NOT NULL DEFAULT '{}',
  confirmed_fields_json TEXT NOT NULL DEFAULT '{}',
  consent_given INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'received_pending_adam_sync',
  notification_email_status TEXT NOT NULL DEFAULT 'not_configured',
  source TEXT NOT NULL DEFAULT 'career-intake',
  source_message_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`;

const createStatusIndexSql =
  "CREATE INDEX IF NOT EXISTS candidate_applications_status_idx ON candidate_applications(status, created_at)";

// Dedup key for mailbox-ingested applications (Microsoft Graph's
// internetMessageId) — lets the resume-mailbox ingester skip a message it
// already saved, even if marking it "read" on the Graph side ever fails
// after a successful D1/R2 write.
const createSourceMessageIndexSql =
  "CREATE UNIQUE INDEX IF NOT EXISTS candidate_applications_source_message_idx ON candidate_applications(source_message_id) WHERE source_message_id IS NOT NULL";

// `source_message_id` was added after the table already existed in
// production, so existing databases need an ALTER — D1/SQLite has no
// "ADD COLUMN IF NOT EXISTS", so this just swallows the one expected error
// (column already exists) on every subsequent boot.
async function ensureSourceMessageIdColumn() {
  try {
    await env.DB.prepare("ALTER TABLE candidate_applications ADD COLUMN source_message_id TEXT").run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!/duplicate column name/i.test(message)) throw error;
  }
}

export async function ensureCandidateApplicationsSchema() {
  await env.DB.prepare(createCandidateApplicationsSql).run();
  await ensureSourceMessageIdColumn();
  await env.DB.batch([env.DB.prepare(createStatusIndexSql), env.DB.prepare(createSourceMessageIndexSql)]);
}

export type NewCandidateApplication = {
  jobId?: number | null;
  jobSlug?: string | null;
  email: string;
  resumeR2Key: string;
  resumeFilename: string;
  resumeContentType: string;
  resumeSizeBytes: number;
  /** Only populated if/when the parsing step (lib/resume-parser.ts) is wired back in — currently unused. */
  parsedFields?: ParsedResumeFields;
  confirmedFields?: Record<string, unknown>;
  consentGiven: boolean;
  /** e.g. "career-intake" (default) or "resume-mailbox". */
  source?: string;
  /** Microsoft Graph internetMessageId, for mailbox-sourced applications only. */
  sourceMessageId?: string | null;
};

function newId() {
  return crypto.randomUUID();
}

export async function createCandidateApplication(input: NewCandidateApplication) {
  await ensureCandidateApplicationsSchema();
  const id = newId();
  const now = new Date().toISOString();

  await env.DB.prepare(`INSERT INTO candidate_applications (
    id, job_id, job_slug, email, resume_r2_key, resume_filename, resume_content_type,
    resume_size_bytes, parsed_fields_json, confirmed_fields_json,
    consent_given, status, notification_email_status, source, source_message_id, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'received_pending_adam_sync', 'not_configured', ?, ?, ?, ?)`).bind(
    id,
    input.jobId ?? null,
    input.jobSlug ?? null,
    input.email,
    input.resumeR2Key,
    input.resumeFilename,
    input.resumeContentType,
    input.resumeSizeBytes,
    JSON.stringify(input.parsedFields ?? {}),
    JSON.stringify(input.confirmedFields ?? {}),
    input.consentGiven ? 1 : 0,
    input.source ?? "career-intake",
    input.sourceMessageId ?? null,
    now,
    now,
  ).run();

  return { id, createdAt: now };
}

/** True if a mailbox message with this internetMessageId has already been saved — lets the ingester skip re-processing it. */
export async function candidateApplicationExistsForMessageId(sourceMessageId: string) {
  await ensureCandidateApplicationsSchema();
  const row = await env.DB.prepare(
    "SELECT id FROM candidate_applications WHERE source_message_id = ? LIMIT 1"
  ).bind(sourceMessageId).first<{ id: string }>();
  return Boolean(row);
}

/** Records whether the best-effort notification email to the recruiting inbox went out. */
export async function updateNotificationEmailStatus(id: string, status: "sent" | "failed" | "not_configured") {
  await ensureCandidateApplicationsSchema();
  await env.DB.prepare(
    "UPDATE candidate_applications SET notification_email_status = ?, updated_at = ? WHERE id = ?"
  ).bind(status, new Date().toISOString(), id).run();
}

/** Stores the raw resume bytes in R2 and returns the object key to save alongside the D1 row. */
export async function storeResumeInR2(params: { bytes: ArrayBuffer; contentType: string; filename: string }) {
  const safeName = params.filename.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(-120) || "resume";
  const key = `resumes/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeName}`;
  await env.RESUMES.put(key, params.bytes, { httpMetadata: { contentType: params.contentType } });
  return key;
}
