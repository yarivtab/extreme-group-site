import { env } from "cloudflare:workers";
import { fetchAdamJobs } from "../../../../lib/adam";
import { replaceAdamJobs } from "../../../../lib/adam-db";

export async function POST(request: Request) {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const expected = runtimeEnv.ADAM_SYNC_SECRET || process.env.ADAM_SYNC_SECRET;
  const received = request.headers.get("x-adam-sync-secret");
  if (!expected || !received || received !== expected) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const jobs = await fetchAdamJobs();
    const result = await replaceAdamJobs(jobs);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown sync error";
    return Response.json({ ok: false, error: message }, { status: 502 });
  }
}
