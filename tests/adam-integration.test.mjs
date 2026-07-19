import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("keeps Adam credentials server-side and protects synchronization", async () => {
  const [adapter, route, example, gitignore] = await Promise.all([
    read("../lib/adam.ts"),
    read("../app/api/adam/sync/route.ts"),
    read("../.env.example"),
    read("../.gitignore"),
  ]);

  assert.match(adapter, /ADAM_COMPANY_TOKEN/);
  assert.match(adapter, /GetOrdersDetails/);
  assert.match(route, /x-adam-sync-secret/);
  assert.match(route, /status: 401/);
  assert.match(example, /ADAM_COMPANY_TOKEN=\n/);
  assert.match(example, /ADAM_SYNC_SECRET=\n/);
  assert.match(gitignore, /\.env\*/);
  assert.doesNotMatch(`${adapter}\n${route}\n${example}`, /railcareer/i);
  assert.doesNotMatch(`${adapter}\n${route}\n${example}`, /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
});

test("publishes only the approved public job projection", async () => {
  const [adapter, database, qaPage] = await Promise.all([
    read("../lib/adam.ts"),
    read("../lib/adam-db.ts"),
    read("../app/qa/adam/page.tsx"),
  ]);

  assert.match(adapter, /descriptionText/);
  assert.match(adapter, /profession_name/);
  assert.match(adapter, /order_def_area_name1/);
  assert.doesNotMatch(database, /email_rakaz|email_snif|telefon|perot_tafked/);
  assert.match(qaPage, /index: false, follow: false/);
  assert.match(qaPage, /readAdamJobs/);
});
