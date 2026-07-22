#!/usr/bin/env bash
# Push the current branch to GitHub, build for production, and deploy to
# Cloudflare Workers. Run this from the project root after committing your
# changes:
#
#   ./deploy.sh
#
# Stops immediately if any step fails (git push, build, or deploy).

set -euo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "==> Pushing '$BRANCH' to github..."
git push github "$BRANCH"

echo "==> Building for production..."
CLOUDFLARE_DEPLOY=true \
D1_DATABASE_ID=be033c2c-36df-4a0b-a99f-dcf352f02d27 \
D1_DATABASE_NAME=extreme-group-site-db \
R2_BUCKET_NAME=extreme-group-site-resumes \
pnpm run build

echo "==> Deploying to Cloudflare Workers..."
npx wrangler deploy

echo "==> Done. Live at https://extreme-group-site.extreme-group.workers.dev"
