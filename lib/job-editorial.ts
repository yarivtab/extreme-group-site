import type { PublicAdamJob } from "./adam";

export const EDITORIAL_ENGINE_VERSION = "responsible-publisher-v1";

export type EditorialProjection = {
  publicTitle: string;
  publicSummary: string;
  publicDescription: string;
  publicRequirements: string;
  status: "auto_published" | "published_with_flag";
  confidence: number;
  flags: string[];
  sourceFingerprint: string;
};

function compact(value: string) {
  return value.replace(/[\u200e\u200f]/g, "").replace(/\s+/g, " ").trim();
}

function comparable(value: string) {
  return compact(value).replace(/\s+([?!.,:])/g, "$1").toLocaleLowerCase("he");
}

function escaped(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fingerprint(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `${EDITORIAL_ENGINE_VERSION}-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function cleanTitle(job: PublicAdamJob) {
  let title = compact(job.title)
    .replace(/[\[(]\s*(?:מס(?:פר|['׳])?\s*)?משרה\s*[:#-]?\s*\d+\s*[\])]/gi, " ")
    .replace(/(?:מס(?:פר|['׳])?\s*משרה|משרה\s*מס(?:פר|['׳])?|job\s*(?:id|no\.?|number)?)\s*[:#-]?\s*\d+/gi, " ")
    .replace(/מס\s*["״']?ד\s*[:#-]?\s*\d+/gi, " ")
    .replace(/\(\s*\d{2,7}\s*\)/g, " ")
    .replace(/\s*[-–—]\s*\d{2,7}\s*$/g, "")
    .replace(new RegExp(`(?:^|[\s#(])${job.id}(?=$|[\s)])`, "g"), " ")
    .replace(/^\s*(?:דרוש(?:\/ה|ה|ים|ות)?|מחפשים(?:\/ות)?|מגייסים(?:\/ות)?)\s*[-:–—|]*\s*/i, "")
    .replace(/\s+(?:דרוש(?:\/ה|ה|ים|ות)?)\s*$/i, "")
    // Recruiters enter the gender-inclusive suffix with inconsistent
    // separators across postings ("מנהל/ת", "מנהל.ת", or a stray literal
    // backslash "מנהל\\ת"). Normalize all of them to the slash convention so
    // published titles read consistently site-wide.
    .replace(/([\u0590-\u05ff])\s*[\\./]\s*(ית|אשת|ות|[תה])(?=\s|$)/g, "$1/$2")
    .replace(/\s+,\s*/g, ", ")
    .replace(/\s+לארגון\s+(?:פיננסי|גדול|מוביל|גלובלי)(?:\s+.*)?$/i, "")
    .replace(/\s*[-–—]\s*כללי\s*$/i, "")
    .replace(/^(.*?)\s+כללי\s*[-–—]\s*[\u0590-\u05ff]+(?:\s+[\u0590-\u05ff].?)?$/i, "$1")
    .replace(/\(\s*\)|\[\s*\]/g, " ")
    .replace(/\s*[-–—|,:]\s*$/g, "")
    .replace(/^\s*[-–—|,:]\s*/g, "");

  for (const place of [job.location, ...job.areas].map(compact).filter((item) => item.length >= 3)) {
    title = title.replace(new RegExp(`(?:\\s*[-–—|,]\\s*|\\s+ב)${escaped(place)}$`, "i"), "");
  }

  title = compact(title);
  if (/הזדמנות הבאה|מגוון משרות|עולם ה-?IT/i.test(job.title)) {
    if (/help\s*desk|noc|system administrator|technical support/i.test(job.descriptionText)) title = "משרות תמיכה ותשתיות IT";
    else if (job.subprofession) title = compact(job.subprofession);
    else if (job.profession && job.profession !== "אחר") title = compact(job.profession);
  }
  if (title.length < 3) title = compact(job.subprofession || job.profession || job.title);
  return title.slice(0, 110).replace(/\s*[-–—|,:]\s*$/g, "");
}

function cleanContent(value: string, titles: string[]) {
  const titleSet = new Set(titles.map(comparable).filter(Boolean));
  const seen = new Set<string>();
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .split(/\r?\n/)
    .map((line) => compact(line).replace(/^[^\p{L}\p{N}]+/u, ""))
    .filter((line) => {
      if (!line) return false;
      if (/^(?:0|[-–—]|אין)$/i.test(line)) return false;
      const normalized = comparable(line);
      if (titleSet.has(normalized) || seen.has(normalized)) return false;
      if (/^(?:מס(?:פר|['׳])?\s*משרה|job\s*(?:id|no\.?|number)?)\s*[:#-]?\s*\d+/i.test(line)) return false;
      seen.add(normalized);
      return true;
    })
    .join("\n\n");
}

function summaryFrom(description: string, fallback: string) {
  const blocks = description.split(/\n{2,}/);
  const firstBlock = blocks.find((item) => item.length >= 35 && !/^(?:🚀\s*)?(?:דרוש|מחפשים|אנחנו מגייסים|הזדמנות|לתפקיד)/i.test(item))
    || blocks.find((item) => item.length >= 35)
    || description
    || fallback;
  const sentence = firstBlock.match(/^.{45,260}?[.!?](?:\s|$)/)?.[0] || firstBlock;
  const result = compact(sentence);
  return result.length > 240 ? `${result.slice(0, 237).trim()}…` : result;
}

export function createEditorialProjection(job: PublicAdamJob): EditorialProjection {
  const publicTitle = cleanTitle(job);
  const publicDescription = cleanContent(job.descriptionText, [job.title, publicTitle]);
  const publicRequirements = cleanContent(job.requirementsText, [job.title, publicTitle]);
  const publicSummary = publicTitle === "משרות תמיכה ותשתיות IT"
    ? "מגוון תפקידי תמיכה טכנית, Help Desk, NOC, System, Cloud ותקשורת בפריסה ארצית."
    : summaryFrom(publicDescription, [job.profession, job.subprofession, job.location].filter(Boolean).join(" · "));
  const flags: string[] = [];

  if (/\bדרוש(?:\/ה|ה|ים|ות)?\b|מס(?:פר|['׳])?\s*משרה|job\s*(?:id|no\.?|number)?/i.test(publicTitle)) flags.push("recruitment_language_remaining");
  if (publicTitle.length > 82) flags.push("long_public_title");
  if (publicTitle.length < 3 || /^(?:כללי|אחר|משרה|תפקיד)$/i.test(publicTitle)) flags.push("generic_public_title");
  if (!publicDescription) flags.push("missing_public_description");

  const confidence = Math.max(55, 100 - flags.length * 12 - (publicTitle === compact(job.title) ? 0 : 3));
  return {
    publicTitle,
    publicSummary,
    publicDescription,
    publicRequirements,
    status: flags.length ? "published_with_flag" : "auto_published",
    confidence,
    flags,
    sourceFingerprint: fingerprint(JSON.stringify({
      title: job.title,
      profession: job.profession,
      subprofession: job.subprofession,
      location: job.location,
      areas: job.areas,
      jobScope: job.jobScope,
      descriptionText: job.descriptionText,
      requirementsText: job.requirementsText,
      sourceUpdatedAt: job.sourceUpdatedAt,
    })),
  };
}
