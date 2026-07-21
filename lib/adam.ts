import { env } from "cloudflare:workers";

const DEFAULT_ADAM_API_BASE_URL = "https://services.adamtotal.co.il/api/Career";

type AdamValue = string | number | null | undefined;

export type AdamOrder = Record<string, AdamValue> & {
  order_id?: number;
  description?: string;
  notes?: string;
  notes_text?: string;
  profession_name?: string;
  tat_profession_name?: string;
  Order_place?: string;
  friend_reward?: number;
};

export type PublicAdamJob = {
  id: number;
  slug: string;
  title: string;
  profession: string;
  subprofession: string;
  location: string;
  areas: string[];
  jobScope: string;
  descriptionText: string;
  requirementsText: string;
  publishedAt: string | null;
  closesAt: string | null;
  sourceUpdatedAt: string | null;
  referralReward: number;
};

function text(value: AdamValue) {
  return String(value ?? "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function unique(values: AdamValue[]) {
  return [...new Set(values.map(text).filter(Boolean))];
}

function adamDate(value: AdamValue) {
  const raw = text(value);
  if (!raw) return null;
  const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  if (Number(year) <= 1900) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

// Adam order titles are entered by recruiters and often carry filler like
// "\u05d3\u05e8\u05d5\u05e9/\u05d4 ..." or "\u05de\u05d7\u05e4\u05e9\u05d9\u05dd ..." ahead of the actual role name. Stripping it
// here keeps job URLs clean (e.g. avoids slugs like
// "\u05d3\u05e8\u05d5\u05e9-\u05d4-\u05de\u05e4\u05ea\u05d7-\u05ea-full-stack-23081") without touching the editorial
// title-cleaning pipeline used for on-page display (lib/job-editorial.ts).
const SLUG_FILLER_PREFIX = /^\s*(?:\u05d3\u05e8\u05d5\u05e9(?:\/\u05d4|\u05d4|\u05d9\u05dd|\u05d5\u05ea)?|\u05de\u05d7\u05e4\u05e9\u05d9\u05dd(?:\/\u05d5\u05ea)?|\u05de\u05d2\u05d9\u05d9\u05e1\u05d9\u05dd(?:\/\u05d5\u05ea)?)\s*[-:\u2013\u2014|]*\s*/i;

function slugify(title: string, id: number) {
  const stripped = title.replace(SLUG_FILLER_PREFIX, "");
  const normalized = (stripped || title)
    .toLowerCase()
    .replace(/[^a-z0-9\u0590-\u05ff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return `${normalized || "job"}-${id}`;
}

export function mapAdamOrder(order: AdamOrder): PublicAdamJob | null {
  const id = Number(order.order_id);
  const title = text(order.description);
  if (!Number.isInteger(id) || id <= 0 || !title) return null;

  const areas = unique([
    order.order_def_area_name1, order.order_def_area_name2, order.order_def_area_name3,
    order.order_def_area_name4, order.order_def_area_name5, order.order_def_area_name6,
    order.living_area1, order.living_area2, order.living_area3,
    order.living_area4, order.living_area5, order.living_area6,
  ]);
  const scopes = unique([
    order.order_def_job_scope1_desc,
    order.order_def_job_scope2_desc,
    order.order_def_job_scope3_desc,
  ]);

  return {
    id,
    slug: slugify(title, id),
    title,
    profession: text(order.profession_name || order.order_def_prof_name1),
    subprofession: text(order.tat_profession_name || order.order_def_sub_prof_name1),
    location: text(order.Order_place || order.work_area || areas.join(" · ")),
    areas,
    jobScope: scopes.join(" · "),
    descriptionText: text(order.notes_text || order.notes),
    requirementsText: unique([order.requirement1, order.requirement2]).join("\n\n"),
    publishedAt: adamDate(order.start_advertising_date || order.orderDate_ddmmyyyy),
    closesAt: adamDate(order.deadline_date || order.end_advertising_date || order.closeDate_ddmmyyy),
    sourceUpdatedAt: adamDate(order.updateDate_ddmmyyyy || order.update_date),
    referralReward: Math.max(0, Number(order.friend_reward) || 0),
  };
}

export async function fetchAdamJobs() {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const token = (runtimeEnv.ADAM_COMPANY_TOKEN || process.env.ADAM_COMPANY_TOKEN)?.trim();
  if (!token) throw new Error("ADAM_COMPANY_TOKEN is not configured");

  const baseUrl = (runtimeEnv.ADAM_API_BASE_URL || process.env.ADAM_API_BASE_URL || DEFAULT_ADAM_API_BASE_URL).replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/GetOrdersDetails`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = (await response.text()).slice(0, 200);
    throw new Error(`Adam returned ${response.status}: ${message}`);
  }

  const payload: unknown = await response.json();
  if (!Array.isArray(payload)) throw new Error("Adam response is not an array");

  return payload
    .map((item) => mapAdamOrder(item as AdamOrder))
    .filter((item): item is PublicAdamJob => item !== null);
}
