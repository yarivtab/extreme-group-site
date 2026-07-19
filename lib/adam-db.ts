import { env } from "cloudflare:workers";
import type { PublicAdamJob } from "./adam";
import { createEditorialProjection, EDITORIAL_ENGINE_VERSION } from "./job-editorial";

const createJobsSql = `CREATE TABLE IF NOT EXISTS adam_jobs (
  id INTEGER PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  profession TEXT,
  subprofession TEXT,
  location TEXT,
  areas_json TEXT NOT NULL DEFAULT '[]',
  job_scope TEXT,
  description_text TEXT,
  requirements_text TEXT,
  published_at TEXT,
  closes_at TEXT,
  source_updated_at TEXT,
  referral_reward INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  synced_at TEXT NOT NULL
)`;

const createSyncStateSql = `CREATE TABLE IF NOT EXISTS adam_sync_state (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
)`;

const createPublicationsSql = `CREATE TABLE IF NOT EXISTS adam_job_publications (
  job_id INTEGER PRIMARY KEY REFERENCES adam_jobs(id) ON DELETE CASCADE,
  source_fingerprint TEXT NOT NULL,
  public_title TEXT NOT NULL,
  public_summary TEXT NOT NULL DEFAULT '',
  public_description TEXT NOT NULL DEFAULT '',
  public_requirements TEXT NOT NULL DEFAULT '',
  editorial_status TEXT NOT NULL DEFAULT 'auto_published',
  confidence INTEGER NOT NULL DEFAULT 100,
  flags_json TEXT NOT NULL DEFAULT '[]',
  engine_version TEXT NOT NULL,
  generated_at TEXT NOT NULL
)`;

const createActiveIndexSql = "CREATE INDEX IF NOT EXISTS adam_jobs_active_idx ON adam_jobs(is_active, profession, location)";
const createPublicationsIndexSql = "CREATE INDEX IF NOT EXISTS adam_job_publications_status_idx ON adam_job_publications(editorial_status, confidence)";

export async function ensureAdamSchema() {
  await env.DB.batch([
    env.DB.prepare(createJobsSql),
    env.DB.prepare(createSyncStateSql),
    env.DB.prepare(createPublicationsSql),
    env.DB.prepare(createActiveIndexSql),
    env.DB.prepare(createPublicationsIndexSql),
  ]);
}

export async function replaceAdamJobs(jobs: PublicAdamJob[]) {
  await ensureAdamSchema();
  const syncedAt = new Date().toISOString();
  const statements = [env.DB.prepare("UPDATE adam_jobs SET is_active = 0")];
  const publicationStatements = [];

  for (const job of jobs) {
    statements.push(env.DB.prepare(`INSERT INTO adam_jobs (
      id, slug, title, profession, subprofession, location, areas_json, job_scope,
      description_text, requirements_text, published_at, closes_at, source_updated_at,
      referral_reward, is_active, synced_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      title = excluded.title,
      profession = excluded.profession,
      subprofession = excluded.subprofession,
      location = excluded.location,
      areas_json = excluded.areas_json,
      job_scope = excluded.job_scope,
      description_text = excluded.description_text,
      requirements_text = excluded.requirements_text,
      published_at = excluded.published_at,
      closes_at = excluded.closes_at,
      source_updated_at = excluded.source_updated_at,
      referral_reward = excluded.referral_reward,
      is_active = 1,
      synced_at = excluded.synced_at`).bind(
      job.id, job.slug, job.title, job.profession, job.subprofession, job.location,
      JSON.stringify(job.areas), job.jobScope, job.descriptionText, job.requirementsText,
      job.publishedAt, job.closesAt, job.sourceUpdatedAt, job.referralReward, syncedAt,
    ));

    const editorial = createEditorialProjection(job);
    publicationStatements.push(env.DB.prepare(`INSERT INTO adam_job_publications (
      job_id, source_fingerprint, public_title, public_summary, public_description,
      public_requirements, editorial_status, confidence, flags_json, engine_version, generated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(job_id) DO UPDATE SET
      source_fingerprint = excluded.source_fingerprint,
      public_title = excluded.public_title,
      public_summary = excluded.public_summary,
      public_description = excluded.public_description,
      public_requirements = excluded.public_requirements,
      editorial_status = excluded.editorial_status,
      confidence = excluded.confidence,
      flags_json = excluded.flags_json,
      engine_version = excluded.engine_version,
      generated_at = excluded.generated_at
    WHERE adam_job_publications.editorial_status != 'approved'`).bind(
      job.id, editorial.sourceFingerprint, editorial.publicTitle, editorial.publicSummary,
      editorial.publicDescription, editorial.publicRequirements, editorial.status,
      editorial.confidence, JSON.stringify(editorial.flags), EDITORIAL_ENGINE_VERSION, syncedAt,
    ));
  }

  statements.push(env.DB.prepare(`INSERT INTO adam_sync_state (key, value) VALUES ('last_successful_sync', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value`).bind(syncedAt));
  statements.push(env.DB.prepare(`INSERT INTO adam_sync_state (key, value) VALUES ('active_job_count', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value`).bind(String(jobs.length)));
  await env.DB.batch(statements);
  if (publicationStatements.length) await env.DB.batch(publicationStatements);
  return { count: jobs.length, syncedAt };
}

export type StoredAdamJob = PublicAdamJob & {
  sourceTitle: string;
  sourceDescriptionText: string;
  sourceRequirementsText: string;
  publicSummary: string;
  editorialStatus: string;
  editorialConfidence: number;
  editorialFlags: string[];
  editorialEngineVersion: string;
  syncedAt: string;
};

const publicJobSelect = `SELECT
  j.id, j.slug, j.title AS source_title,
  COALESCE(p.public_title, j.title) AS public_title,
  j.profession, j.subprofession, j.location, j.areas_json, j.job_scope,
  j.description_text AS source_description_text,
  j.requirements_text AS source_requirements_text,
  COALESCE(p.public_summary, '') AS public_summary,
  COALESCE(p.public_description, j.description_text, '') AS public_description,
  COALESCE(p.public_requirements, j.requirements_text, '') AS public_requirements,
  COALESCE(p.editorial_status, 'source_fallback') AS editorial_status,
  COALESCE(p.confidence, 0) AS editorial_confidence,
  COALESCE(p.flags_json, '[]') AS editorial_flags_json,
  COALESCE(p.engine_version, '') AS editorial_engine_version,
  j.published_at, j.closes_at, j.source_updated_at, j.referral_reward, j.synced_at
  FROM adam_jobs j LEFT JOIN adam_job_publications p ON p.job_id = j.id`;

function storedAdamJob(row: Record<string, unknown>): StoredAdamJob {
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.public_title),
    sourceTitle: String(row.source_title),
    profession: String(row.profession || ""),
    subprofession: String(row.subprofession || ""),
    location: String(row.location || ""),
    areas: JSON.parse(String(row.areas_json || "[]")) as string[],
    jobScope: String(row.job_scope || ""),
    descriptionText: String(row.public_description || ""),
    requirementsText: String(row.public_requirements || ""),
    sourceDescriptionText: String(row.source_description_text || ""),
    sourceRequirementsText: String(row.source_requirements_text || ""),
    publicSummary: String(row.public_summary || ""),
    editorialStatus: String(row.editorial_status),
    editorialConfidence: Number(row.editorial_confidence || 0),
    editorialFlags: JSON.parse(String(row.editorial_flags_json || "[]")) as string[],
    editorialEngineVersion: String(row.editorial_engine_version || ""),
    publishedAt: row.published_at ? String(row.published_at) : null,
    closesAt: row.closes_at ? String(row.closes_at) : null,
    sourceUpdatedAt: row.source_updated_at ? String(row.source_updated_at) : null,
    referralReward: Number(row.referral_reward || 0),
    syncedAt: String(row.synced_at),
  };
}

export async function readAdamJobs() {
  await ensureAdamSchema();
  const result = await env.DB.prepare(`${publicJobSelect}
    WHERE j.is_active = 1 ORDER BY j.published_at DESC, j.id DESC`).all();
  return result.results.map((row) => storedAdamJob(row));
}

export async function readAdamJobBySlug(slug: string) {
  await ensureAdamSchema();
  const row = await env.DB.prepare(`${publicJobSelect}
    WHERE j.is_active = 1 AND j.slug = ? LIMIT 1`).bind(slug).first();

  if (!row) return null;
  return storedAdamJob(row);
}
