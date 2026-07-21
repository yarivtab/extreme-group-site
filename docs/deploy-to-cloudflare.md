# Deploying directly to Cloudflare Workers

This replaces the OpenAI ChatGPT Sites hosting flow. The app is a normal
`@cloudflare/vite-plugin` project — `vite build` generates an output Worker
config (`dist/server/wrangler.json`) and `wrangler deploy` reads it
automatically via `.wrangler/deploy/config.json`. No root `wrangler.jsonc` is
needed or used; `vite.config.ts` supplies the config programmatically.

## One-time Cloudflare resources

- D1 database: `extreme-group-site-db` (id `be033c2c-36df-4a0b-a99f-dcf352f02d27`)
- R2 bucket: `extreme-group-site-resumes` (created once R2 is enabled on the account)

## Production build env vars

Local dev (`pnpm run dev`) needs none of these — it keeps using the
placeholder D1 id and default bucket name, which Miniflare simulates locally.
A **production build** must set:

```
CLOUDFLARE_DEPLOY=true
D1_DATABASE_ID=be033c2c-36df-4a0b-a99f-dcf352f02d27
D1_DATABASE_NAME=extreme-group-site-db
R2_BUCKET_NAME=extreme-group-site-resumes
```

`CLOUDFLARE_DEPLOY=true` is what tells `vite.config.ts` to leave
`ADAM_COMPANY_TOKEN`, `ADAM_SYNC_SECRET`, `OPENAI_API_KEY`, `RESEND_API_KEY`,
and `RESEND_FROM_EMAIL` out of the generated Worker config entirely, so they
never get baked in as plaintext `vars` and never overwrite the real values
set via `wrangler secret put` below. Forgetting this flag on a real deploy
will make Wrangler warn that your local `.env` values "conflict with
existing remote secrets" and offer to overwrite them — always say no if you
see that warning unexpectedly, then rebuild with the flag set.

## Deploy

```
CLOUDFLARE_DEPLOY=true \
D1_DATABASE_ID=be033c2c-36df-4a0b-a99f-dcf352f02d27 \
D1_DATABASE_NAME=extreme-group-site-db \
R2_BUCKET_NAME=extreme-group-site-resumes \
pnpm run build

wrangler deploy
```

## Secrets

Never set these as build-time `vars` for production — set them directly on
the deployed Worker so they never touch a file that could be committed:

```
wrangler secret put ADAM_COMPANY_TOKEN
wrangler secret put ADAM_SYNC_SECRET
wrangler secret put RESEND_API_KEY
wrangler secret put RESEND_FROM_EMAIL
wrangler secret put OPENAI_API_KEY   # only if the parse/confirm step gets revived
```

`ADAM_API_BASE_URL` and `JOBS_INBOX_EMAIL` have safe non-secret defaults
baked into `vite.config.ts` and don't need to be set as secrets unless
overriding them.
