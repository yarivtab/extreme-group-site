import { env } from "cloudflare:workers";
import type { PublicAdamJob } from "./adam";

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

const createActiveIndexSql = "CREATE INDEX IF NOT EXISTS adam_jobs_active_idx ON adam_jobs(is_active, profession, location)";

export async function ensureAdamSchema() {
  await env.DB.batch([
    env.DB.prepare(createJobsSql),
    env.DB.prepare(createSyncStateSql),
    env.DB.prepare(createActiveIndexSql),
  ]);
}

export async function replaceAdamJobs(jobs: PublicAdamJob[]) {
  await ensureAdamSchema();
  const syncedAt = new Date().toISOString();
  const statements = [env.DB.prepare("UPDATE adam_jobs SET is_active = 0")];

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
  }

  statements.push(env.DB.prepare(`INSERT INTO adam_sync_state (key, value) VALUES ('last_successful_sync', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value`).bind(syncedAt));
  statements.push(env.DB.prepare(`INSERT INTO adam_sync_state (key, value) VALUES ('active_job_count', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value`).bind(String(jobs.length)));
  await env.DB.batch(statements);
  return { count: jobs.length, syncedAt };
}

export type StoredAdamJob = PublicAdamJob & { syncedAt: string };

export async function readAdamJobs() {
  await ensureAdamSchema();
  const result = await env.DB.prepare(`SELECT
    id, slug, title, profession, subprofession, location, areas_json, job_scope,
    description_text, requirements_text, published_at, closes_at, source_updated_at,
    referral_reward, synced_at
    FROM adam_jobs WHERE is_active = 1 ORDER BY published_at DESC, id DESC`).all();

  return result.results.map((row) => ({
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    profession: String(row.profession || ""),
    subprofession: String(row.subprofession || ""),
    location: String(row.location || ""),
    areas: JSON.parse(String(row.areas_json || "[]")) as string[],
    jobScope: String(row.job_scope || ""),
    descriptionText: String(row.description_text || ""),
    requirementsText: String(row.requirements_text || ""),
    publishedAt: row.published_at ? String(row.published_at) : null,
    closesAt: row.closes_at ? String(row.closes_at) : null,
    sourceUpdatedAt: row.source_updated_at ? String(row.source_updated_at) : null,
    referralReward: Number(row.referral_reward || 0),
    syncedAt: String(row.synced_at),
  } satisfies StoredAdamJob));
}

export async function readAdamJobBySlug(slug: string) {
  await ensureAdamSchema();
  const row = await env.DB.prepare(`SELECT
    id, slug, title, profession, subprofession, location, areas_json, job_scope,
    description_text, requirements_text, published_at, closes_at, source_updated_at,
    referral_reward, synced_at
    FROM adam_jobs WHERE is_active = 1 AND slug = ? LIMIT 1`).bind(slug).first();

  if (!row) return null;
  return {
    id: Number(row.id),
    slug: String(row.slug),
    title: String(row.title),
    profession: String(row.profession || ""),
    subprofession: String(row.subprofession || ""),
    location: String(row.location || ""),
    areas: JSON.parse(String(row.areas_json || "[]")) as string[],
    jobScope: String(row.job_scope || ""),
    descriptionText: String(row.description_text || ""),
    requirementsText: String(row.requirements_text || ""),
    publishedAt: row.published_at ? String(row.published_at) : null,
    closesAt: row.closes_at ? String(row.closes_at) : null,
    sourceUpdatedAt: row.source_updated_at ? String(row.source_updated_at) : null,
    referralReward: Number(row.referral_reward || 0),
    syncedAt: String(row.synced_at),
  } satisfies StoredAdamJob;
}
