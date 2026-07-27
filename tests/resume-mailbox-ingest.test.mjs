import assert from "node:assert/strict";
import test from "node:test";
import { ingestResumeMailbox } from "../lib/resume-mailbox-ingest.ts";
import { ApplicationEmailNotConfiguredError } from "../lib/application-email-errors.ts";

function fakeGraph(messages, attachmentsByMessageId = {}) {
  const readMessageIds = [];
  return {
    graph: {
      async listInboxMessages() {
        return messages;
      },
      async listMessageAttachments(messageId) {
        return attachmentsByMessageId[messageId] ?? [];
      },
      async markMessageRead(messageId) {
        readMessageIds.push(messageId);
      },
    },
    readMessageIds,
  };
}

// candidate-applications-db.ts and send-application-email.ts both import
// "cloudflare:workers", which plain `node --test` cannot resolve at all
// (dynamic or static) — ingestResumeMailbox() only reaches for its real
// implementations when a given dependency isn't supplied, so every test
// must supply a stub for each one it doesn't care about, not just the one
// it's actually exercising.
function noopDbDeps() {
  return {
    applicationExists: async () => false,
    createApplication: async () => ({ id: "unused", createdAt: "now" }),
    storeResume: async () => "resumes/unused",
    sendNotification: async () => ({ id: "unused" }),
    updateEmailStatus: async () => {},
  };
}

function pdfAttachment(name = "resume.pdf") {
  return {
    id: "attachment-1",
    "@odata.type": "#microsoft.graph.fileAttachment",
    name,
    contentType: "application/pdf",
    contentBytes: Buffer.from("%PDF-1.4 fake resume").toString("base64"),
  };
}

test("returns configured:false without touching any dependency when Graph env vars are missing", async () => {
  let called = false;
  const result = await ingestResumeMailbox({
    environment: {},
    applicationExists: async () => { called = true; return false; },
  });
  assert.equal(result.configured, false);
  assert.equal(result.processed, 0);
  assert.equal(called, false);
});

test("a message with no attachments is marked read and skipped, no save attempted", async () => {
  const { graph, readMessageIds } = fakeGraph([
    { id: "msg-1", internetMessageId: "<msg-1>", hasAttachments: false, from: { emailAddress: { address: "a@b.com" } } },
  ]);
  let createCalled = false;
  const result = await ingestResumeMailbox({
    graph,
    ...noopDbDeps(),
    createApplication: async () => { createCalled = true; return { id: "x", createdAt: "now" }; },
  });
  assert.equal(result.processed, 1);
  assert.equal(result.skippedNoAttachment, 1);
  assert.equal(result.saved, 0);
  assert.equal(createCalled, false);
  assert.deepEqual(readMessageIds, ["msg-1"]);
});

test("a message already saved for this internetMessageId is skipped without re-saving", async () => {
  const { graph, readMessageIds } = fakeGraph([
    { id: "msg-1", internetMessageId: "<msg-1>", hasAttachments: true, from: { emailAddress: { address: "a@b.com" } } },
  ]);
  let createCalled = false;
  const result = await ingestResumeMailbox({
    graph,
    ...noopDbDeps(),
    applicationExists: async (messageId) => messageId === "<msg-1>",
    createApplication: async () => { createCalled = true; return { id: "x", createdAt: "now" }; },
  });
  assert.equal(result.skippedAlreadySaved, 1);
  assert.equal(createCalled, false);
  assert.deepEqual(readMessageIds, ["msg-1"]);
});

test("a message whose only attachment fails validation (wrong type) is marked read and skipped", async () => {
  const { graph, readMessageIds } = fakeGraph(
    [{ id: "msg-1", internetMessageId: "<msg-1>", hasAttachments: true, from: { emailAddress: { address: "a@b.com" } } }],
    { "msg-1": [{ id: "att-1", "@odata.type": "#microsoft.graph.fileAttachment", name: "logo.png", contentType: "image/png", contentBytes: Buffer.from("x").toString("base64") }] },
  );
  const result = await ingestResumeMailbox({ graph, ...noopDbDeps() });
  assert.equal(result.skippedInvalidAttachment, 1);
  assert.equal(result.saved, 0);
  assert.deepEqual(readMessageIds, ["msg-1"]);
});

test("a valid resume attachment is stored, saved with source resume-mailbox, notified, and the message marked read", async () => {
  const { graph, readMessageIds } = fakeGraph(
    [{ id: "msg-1", internetMessageId: "<msg-1>", hasAttachments: true, subject: "CV", from: { emailAddress: { address: "candidate@example.com" } } }],
    { "msg-1": [pdfAttachment()] },
  );

  const storeCalls = [];
  const createCalls = [];
  const notifyCalls = [];
  const emailStatusCalls = [];

  const result = await ingestResumeMailbox({
    graph,
    applicationExists: async () => false,
    storeResume: async (params) => { storeCalls.push(params); return "resumes/2026/fake-key"; },
    createApplication: async (input) => { createCalls.push(input); return { id: "app-1", createdAt: "now" }; },
    sendNotification: async (input) => { notifyCalls.push(input); return { id: "email-1" }; },
    updateEmailStatus: async (id, status) => { emailStatusCalls.push({ id, status }); },
  });

  assert.equal(result.saved, 1);
  assert.equal(storeCalls[0].filename, "resume.pdf");
  assert.equal(storeCalls[0].contentType, "application/pdf");

  assert.equal(createCalls[0].email, "candidate@example.com");
  assert.equal(createCalls[0].resumeR2Key, "resumes/2026/fake-key");
  assert.equal(createCalls[0].source, "resume-mailbox");
  assert.equal(createCalls[0].sourceMessageId, "<msg-1>");
  assert.equal(createCalls[0].consentGiven, true);

  assert.equal(notifyCalls[0].candidateEmail, "candidate@example.com");
  assert.deepEqual(emailStatusCalls, [{ id: "app-1", status: "sent" }]);
  assert.deepEqual(readMessageIds, ["msg-1"]);
});

test("a notification failure still counts the application as saved and still marks the message read", async () => {
  const { graph, readMessageIds } = fakeGraph(
    [{ id: "msg-1", internetMessageId: "<msg-1>", hasAttachments: true, from: { emailAddress: { address: "candidate@example.com" } } }],
    { "msg-1": [pdfAttachment()] },
  );

  const emailStatusCalls = [];
  const result = await ingestResumeMailbox({
    graph,
    applicationExists: async () => false,
    storeResume: async () => "resumes/2026/fake-key",
    createApplication: async () => ({ id: "app-1", createdAt: "now" }),
    sendNotification: async () => { throw new ApplicationEmailNotConfiguredError(); },
    updateEmailStatus: async (id, status) => { emailStatusCalls.push({ id, status }); },
  });

  assert.equal(result.saved, 1);
  assert.deepEqual(emailStatusCalls, [{ id: "app-1", status: "not_configured" }]);
  assert.deepEqual(readMessageIds, ["msg-1"]);
});

test("an unexpected error on one message is recorded without stopping the batch", async () => {
  const { graph, readMessageIds } = fakeGraph(
    [
      { id: "msg-1", internetMessageId: "<msg-1>", hasAttachments: true, from: { emailAddress: { address: "a@example.com" } } },
      { id: "msg-2", internetMessageId: "<msg-2>", hasAttachments: true, from: { emailAddress: { address: "b@example.com" } } },
    ],
    { "msg-1": [pdfAttachment()], "msg-2": [pdfAttachment()] },
  );

  let call = 0;
  const result = await ingestResumeMailbox({
    graph,
    applicationExists: async () => false,
    storeResume: async () => { call += 1; if (call === 1) throw new Error("boom"); return "resumes/2026/fake-key"; },
    createApplication: async () => ({ id: "app-2", createdAt: "now" }),
    sendNotification: async () => ({ id: "email-1" }),
    updateEmailStatus: async () => {},
  });

  assert.equal(result.processed, 2);
  assert.equal(result.failed, 1);
  assert.equal(result.saved, 1);
  assert.match(result.errors[0], /boom/);
  // The failing message is never marked read (so it's retried next run); the
  // succeeding one is.
  assert.deepEqual(readMessageIds, ["msg-2"]);
});
