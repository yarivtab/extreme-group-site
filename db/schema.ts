import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const adamJobs = sqliteTable("adam_jobs", {
  id: integer("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  profession: text("profession"),
  subprofession: text("subprofession"),
  location: text("location"),
  areasJson: text("areas_json").notNull().default("[]"),
  jobScope: text("job_scope"),
  descriptionText: text("description_text"),
  requirementsText: text("requirements_text"),
  publishedAt: text("published_at"),
  closesAt: text("closes_at"),
  sourceUpdatedAt: text("source_updated_at"),
  referralReward: integer("referral_reward").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  syncedAt: text("synced_at").notNull(),
}, (table) => [index("adam_jobs_active_idx").on(table.isActive, table.profession, table.location)]);

export const adamSyncState = sqliteTable("adam_sync_state", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const adamJobPublications = sqliteTable("adam_job_publications", {
  jobId: integer("job_id").primaryKey().references(() => adamJobs.id, { onDelete: "cascade" }),
  sourceFingerprint: text("source_fingerprint").notNull(),
  publicTitle: text("public_title").notNull(),
  publicSummary: text("public_summary").notNull().default(""),
  publicDescription: text("public_description").notNull().default(""),
  publicRequirements: text("public_requirements").notNull().default(""),
  editorialStatus: text("editorial_status").notNull().default("auto_published"),
  confidence: integer("confidence").notNull().default(100),
  flagsJson: text("flags_json").notNull().default("[]"),
  engineVersion: text("engine_version").notNull(),
  generatedAt: text("generated_at").notNull(),
}, (table) => [index("adam_job_publications_status_idx").on(table.editorialStatus, table.confidence)]);

// Candidate applications submitted through /intake?track=career. The resume
// file itself lives in R2 (see the `RESUMES` binding) — D1 stores only the
// object key plus small text/JSON fields, per Cloudflare's guidance against
// storing files in D1 rows. `status` tracks the (still pending) handoff to
// Adam: nothing here is forwarded to Adam automatically until that
// integration exists (see docs/adam-candidate-api-requirements.md).
export const candidateApplications = sqliteTable("candidate_applications", {
  id: text("id").primaryKey(),
  jobId: integer("job_id"),
  jobSlug: text("job_slug"),
  email: text("email").notNull(),
  resumeR2Key: text("resume_r2_key").notNull(),
  resumeFilename: text("resume_filename").notNull(),
  resumeContentType: text("resume_content_type").notNull(),
  resumeSizeBytes: integer("resume_size_bytes").notNull(),
  parsedFieldsJson: text("parsed_fields_json").notNull().default("{}"),
  confirmedFieldsJson: text("confirmed_fields_json").notNull().default("{}"),
  consentGiven: integer("consent_given", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("received_pending_adam_sync"),
  // Whether the best-effort notification email to the recruiting inbox went
  // out: 'sent', 'failed', or 'not_configured' (no RESEND_API_KEY set). This
  // is a convenience channel only — the row itself is the durable record,
  // so a failed email here never means the application was lost.
  notificationEmailStatus: text("notification_email_status").notNull().default("not_configured"),
  source: text("source").notNull().default("career-intake"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [index("candidate_applications_status_idx").on(table.status, table.createdAt)]);
