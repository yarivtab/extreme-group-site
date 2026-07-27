/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { fetchAdamJobs } from "../lib/adam";
import { replaceAdamJobs } from "../lib/adam-db";
import { getWpRedirectTarget } from "../lib/wp-redirects";
import { ingestResumeMailbox } from "../lib/resume-mailbox-ingest";
import { RESUME_MAILBOX_CRON } from "../lib/cron-schedules";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  RESUMES: R2Bucket;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Redirect old WordPress post URLs (extreme.co.il) to their new-site
    // equivalents. Must run before vinext delegation so old permalinks never
    // 404 once the real domain points at this Worker.
    const wpRedirectTarget = getWpRedirectTarget(url.pathname);
    if (wpRedirectTarget) {
      return Response.redirect(new URL(wpRedirectTarget, request.url).toString(), 301);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },

  // Two independent schedules share this one handler (see wrangler's
  // `triggers.crons` in vite.config.ts) — `event.cron` tells them apart.
  // Both the Adam sync and the resume-mailbox ingest also have their own
  // manual HTTP trigger (/api/adam/sync, /api/resume-mailbox/sync) for
  // on-demand runs. Errors are logged, never thrown, so a bad upstream
  // response never crashes the cron.
  async scheduled(event: { cron?: string }, _env: Env, ctx: ExecutionContext): Promise<void> {
    const isResumeMailboxCron = event?.cron === RESUME_MAILBOX_CRON;

    ctx.waitUntil(
      (async () => {
        if (isResumeMailboxCron) {
          try {
            const result = await ingestResumeMailbox();
            console.log("Scheduled resume-mailbox ingest complete:", result);
          } catch (error) {
            console.error("Scheduled resume-mailbox ingest failed:", error instanceof Error ? error.message : error);
          }
          return;
        }

        try {
          const jobs = await fetchAdamJobs();
          const result = await replaceAdamJobs(jobs);
          console.log("Scheduled Adam sync complete:", result);
        } catch (error) {
          console.error("Scheduled Adam sync failed:", error instanceof Error ? error.message : error);
        }
      })(),
    );
  },
};

export default worker;
