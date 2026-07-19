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
