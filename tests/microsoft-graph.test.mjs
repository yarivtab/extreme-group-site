import assert from "node:assert/strict";
import test from "node:test";
import {
  createMicrosoftGraphClient,
  decodeGraphAttachment,
  microsoftGraphConfigFromEnv,
  MicrosoftGraphNotConfiguredError,
  MicrosoftGraphRequestError,
} from "../lib/microsoft-graph.ts";

const config = {
  tenantId: "tenant-id",
  clientId: "client-id",
  clientSecret: "client-secret",
  mailbox: "resume@extreme.co.il",
};

function jsonResponse(payload, init = {}) {
  return new Response(JSON.stringify(payload), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json" },
  });
}

test("configuration requires every Graph environment variable", () => {
  assert.throws(
    () => microsoftGraphConfigFromEnv({ MICROSOFT_GRAPH_CLIENT_ID: "client-id" }),
    (error) => {
      assert.ok(error instanceof MicrosoftGraphNotConfiguredError);
      assert.match(error.message, /MICROSOFT_GRAPH_CLIENT_SECRET/);
      assert.doesNotMatch(error.message, /client-id/);
      return true;
    },
  );
});

test("client obtains and reuses an app-only token while listing unread messages", async () => {
  const calls = [];
  const fetcher = async (input, init) => {
    calls.push({ url: String(input), init });
    if (String(input).includes("/oauth2/v2.0/token")) {
      return jsonResponse({ access_token: "access-token", expires_in: 3600 });
    }
    return jsonResponse({
      value: [{ id: "message-1", subject: "CV", hasAttachments: true, isRead: false }],
    });
  };
  const graph = createMicrosoftGraphClient({ config, fetch: fetcher });

  const first = await graph.listInboxMessages({ top: 10 });
  const second = await graph.listInboxMessages({ top: 10 });

  assert.equal(first[0]?.id, "message-1");
  assert.equal(second[0]?.id, "message-1");
  assert.equal(calls.filter((call) => call.url.includes("/oauth2/v2.0/token")).length, 1);

  const tokenBody = calls[0].init.body;
  assert.ok(tokenBody instanceof URLSearchParams);
  assert.equal(tokenBody.get("grant_type"), "client_credentials");
  assert.equal(tokenBody.get("scope"), "https://graph.microsoft.com/.default");

  const graphCall = calls[1];
  assert.match(graphCall.url, /\/users\/resume%40extreme\.co\.il\/mailFolders\/inbox\/messages/);
  assert.match(graphCall.url, /%24filter=isRead\+eq\+false/);
  assert.equal(new Headers(graphCall.init.headers).get("authorization"), "Bearer access-token");
});

test("client lists attachments and marks a message as read", async () => {
  const calls = [];
  const fetcher = async (input, init) => {
    calls.push({ url: String(input), init });
    if (String(input).includes("/oauth2/v2.0/token")) {
      return jsonResponse({ access_token: "access-token", expires_in: 3600 });
    }
    if (String(input).endsWith("/attachments")) {
      return jsonResponse({
        value: [{
          id: "attachment-1",
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: "resume.pdf",
          contentType: "application/pdf",
          contentBytes: Buffer.from("resume").toString("base64"),
        }],
      });
    }
    return new Response(null, { status: 204 });
  };
  const graph = createMicrosoftGraphClient({ config, fetch: fetcher });

  const attachments = await graph.listMessageAttachments("message/1");
  const decoded = decodeGraphAttachment(attachments[0]);
  assert.equal(decoded?.name, "resume.pdf");
  assert.equal(Buffer.from(decoded?.bytes ?? []).toString(), "resume");

  await graph.markMessageRead("message/1");
  const patchCall = calls.at(-1);
  assert.equal(patchCall.init.method, "PATCH");
  assert.equal(patchCall.init.body, JSON.stringify({ isRead: true }));
  assert.match(patchCall.url, /messages\/message%2F1$/);
});

test("Graph errors expose status and provider message without credentials", async () => {
  const fetcher = async (input) => {
    if (String(input).includes("/oauth2/v2.0/token")) {
      return jsonResponse({ access_token: "access-token", expires_in: 3600 });
    }
    return jsonResponse(
      { error: { code: "Authorization_RequestDenied", message: "Insufficient privileges" } },
      { status: 403 },
    );
  };
  const graph = createMicrosoftGraphClient({ config, fetch: fetcher });

  await assert.rejects(
    () => graph.listInboxMessages(),
    (error) => {
      assert.ok(error instanceof MicrosoftGraphRequestError);
      assert.equal(error.status, 403);
      assert.match(error.message, /Insufficient privileges/);
      assert.doesNotMatch(error.message, /client-secret|access-token/);
      return true;
    },
  );
});
