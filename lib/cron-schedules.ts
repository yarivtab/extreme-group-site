// Single source of truth for the Worker's cron trigger expressions, so
// vite.config.ts (which declares them to wrangler) and worker/index.ts
// (which branches on `event.cron` inside the `scheduled` handler) can never
// drift out of sync with each other.

/** Adam job listings sync — every 6 hours, offset from the hour. */
export const ADAM_SYNC_CRON = "15 */6 * * *";

/** Resume mailbox ingest — every 10 minutes; candidates emailing a resume shouldn't wait hours for it to be picked up. */
export const RESUME_MAILBOX_CRON = "*/10 * * * *";
