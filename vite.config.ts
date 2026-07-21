import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

// Set CLOUDFLARE_DEPLOY=true only for a real production build+deploy
// (see docs/deploy-to-cloudflare.md). When true, secret-backed values are
// deliberately left out of the generated Worker config entirely, so
// `wrangler deploy` never bakes them in as plaintext `vars` and never
// overwrites the real values already set via `wrangler secret put`. Local
// dev (this flag unset) keeps reading them from `.env` as plaintext vars,
// which is fine since that only ever runs on your own machine.
const isProductionDeployBuild = process.env.CLOUDFLARE_DEPLOY === "true";

const secretBackedVars = isProductionDeployBuild
  ? {}
  : {
      ADAM_COMPANY_TOKEN: process.env.ADAM_COMPANY_TOKEN ?? "",
      ADAM_SYNC_SECRET: process.env.ADAM_SYNC_SECRET ?? "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
      RESEND_API_KEY: process.env.RESEND_API_KEY ?? "",
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ?? "",
    };

const localBindingConfig = {
  name: "extreme-group-site",
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  vars: {
    ...secretBackedVars,
    ADAM_API_BASE_URL: process.env.ADAM_API_BASE_URL ?? "https://services.adamtotal.co.il/api/Career",
    JOBS_INBOX_EMAIL: process.env.JOBS_INBOX_EMAIL ?? "jobs@extreme.co.il",
    // Only declared when explicitly set, so its absence falls through to
    // app/seo.ts's `?? previewSiteUrl` default rather than becoming a
    // defined-but-empty string (which `??` would NOT fall back from).
    ...(process.env.SITE_URL ? { SITE_URL: process.env.SITE_URL } : {}),
  },
  d1_databases: d1
    ? [
        {
          binding: d1,
          // Real values are supplied via env vars at production build time
          // (see docs/deploy-to-cloudflare.md); local dev keeps using the
          // placeholder id, which Miniflare simulates locally either way.
          database_name: process.env.D1_DATABASE_NAME ?? "site-creator-d1",
          database_id: process.env.D1_DATABASE_ID ?? SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: process.env.R2_BUCKET_NAME ?? "site-creator-r2",
        },
      ]
    : [],
  // Keeps Adam job listings fresh automatically (worker/index.ts's
  // `scheduled` handler). Only added for real production deploy builds —
  // local dev shouldn't repeatedly hit the real Adam API on a schedule.
  // Every 6 hours, offset from the hour so it doesn't pile up with other
  // providers' on-the-hour crons.
  ...(isProductionDeployBuild ? { triggers: { crons: ["15 */6 * * *"] } } : {}),
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
