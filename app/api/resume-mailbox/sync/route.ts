import { env } from "cloudflare:workers";
import { ingestResumeMailbox } from "../../../../lib/resume-mailbox-ingest";

export async function POST(request: Request) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const expected = runtimeEnv.RESUME_MAILBOX_SYNC_SECRET || process.env.RESUME_MAILBOX_SYNC_SECRET;
  const received = request.headers.get("x-resume-mailbox-sync-secret");
  if (!expected || !received || received !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await ingestResumeMailbox();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown resume mailbox sync error";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
