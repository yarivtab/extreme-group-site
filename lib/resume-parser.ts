import { env } from "cloudflare:workers";

// Extracts structured candidate fields from resume text, the way Mercor's
// profile setup does ("we'll parse key details... to pre-fill your
// profile"). This is what makes the intake form's "we'll ask only what's
// missing" copy actually true, instead of aspirational.
//
// Uses OpenAI's Chat Completions API with JSON-mode output. Model is
// configurable via OPENAI_MODEL (defaults to a low-cost model) since exact
// model names/availability shift over time — see docs/adam-candidate-api-requirements.md
// for the unrelated Adam blocker this does NOT solve (parsing happens on our
// side; forwarding the finished application to Adam is still pending their
// API spec).

const DEFAULT_MODEL = "gpt-5-nano";
const MAX_RESUME_CHARS = 20000;

export const PARSED_RESUME_FIELD_KEYS = [
  "fullName",
  "phone",
  "city",
  "country",
  "experienceSummary",
  "skills",
] as const;

export type ParsedResumeFieldKey = (typeof PARSED_RESUME_FIELD_KEYS)[number];

export type ParsedResumeFields = {
  fullName?: string;
  phone?: string;
  city?: string;
  country?: string;
  experienceSummary?: string;
  skills?: string[];
  /** Fields the parser could not extract with confidence — the confirm step should ask for these. */
  missingFields: ParsedResumeFieldKey[];
};

export class ResumeParserNotConfiguredError extends Error {
  constructor() {
    super("OPENAI_API_KEY is not configured — resume parsing is unavailable.");
    this.name = "ResumeParserNotConfiguredError";
  }
}

const SYSTEM_PROMPT = `You extract structured contact and experience details from a candidate's resume text for a job-application form. Respond with ONLY a JSON object with these keys:
- fullName (string or null)
- phone (string or null)
- city (string or null)
- country (string or null)
- experienceSummary (string or null): 2-3 concise sentences summarizing their most relevant roles and experience
- skills (array of strings, or empty array): 5-12 concrete skills/technologies, no duplicates
- missingFields (array of strings): which of [fullName, phone, city, country, experienceSummary, skills] you could NOT extract with reasonable confidence from the text. Do not include a field in missingFields if you filled it in.

Only use information present in the text. Never invent a phone number, city, or name. If the resume text is empty, garbled, or clearly not a resume, return null/[] for every field and list all six keys in missingFields.`;

function emptyResult(): ParsedResumeFields {
  return { missingFields: [...PARSED_RESUME_FIELD_KEYS] };
}

function normalize(raw: unknown): ParsedResumeFields {
  if (!raw || typeof raw !== "object") return emptyResult();
  const record = raw as Record<string, unknown>;

  const str = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);
  const skills = Array.isArray(record.skills)
    ? record.skills.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 20)
    : undefined;

  const validKeys = new Set<string>(PARSED_RESUME_FIELD_KEYS);
  const missingFields = Array.isArray(record.missingFields)
    ? record.missingFields.filter((item): item is ParsedResumeFieldKey => typeof item === "string" && validKeys.has(item))
    : [];

  return {
    fullName: str(record.fullName),
    phone: str(record.phone),
    city: str(record.city),
    country: str(record.country),
    experienceSummary: str(record.experienceSummary),
    skills: skills?.length ? skills : undefined,
    missingFields,
  };
}

/**
 * Sends extracted resume text to an LLM and returns structured candidate
 * fields. Throws `ResumeParserNotConfiguredError` if no API key is set, and
 * a plain `Error` for any upstream failure — callers must treat either as
 * "fall back to asking the candidate for everything," never as a silent
 * empty success.
 */
export async function parseResumeText(resumeText: string): Promise<ParsedResumeFields> {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const apiKey = (runtimeEnv.OPENAI_API_KEY || process.env.OPENAI_API_KEY)?.trim();
  if (!apiKey) throw new ResumeParserNotConfiguredError();

  const trimmedText = resumeText.trim();
  if (!trimmedText) return emptyResult();

  const model = (runtimeEnv.OPENAI_MODEL || process.env.OPENAI_MODEL || DEFAULT_MODEL).trim();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      // gpt-5-nano (and other reasoning-tier models) reject any temperature
      // other than the default (1) — confirmed via a real 400 from OpenAI
      // when this was set to 0. Do not add it back without checking the
      // model supports it.
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: trimmedText.slice(0, MAX_RESUME_CHARS) },
      ],
    }),
  });

  if (!response.ok) {
    const message = (await response.text()).slice(0, 300);
    throw new Error(`Resume parsing request failed (${response.status}): ${message}`);
  }

  const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = payload.choices?.[0]?.message?.content;
  if (!raw) throw new Error("Resume parsing response did not include any content");

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new Error("Resume parsing response was not valid JSON");
  }

  return normalize(parsedJson);
}
