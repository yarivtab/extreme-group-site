import {
  createMicrosoftGraphClient,
  decodeGraphAttachment,
  MicrosoftGraphNotConfiguredError,
  type MicrosoftGraphAttachment,
  type MicrosoftGraphMessage,
} from "./microsoft-graph.ts";
import { validateResumeAttachment } from "./resume-upload.ts";
import { ApplicationEmailNotConfiguredError } from "./application-email-errors.ts";
import type {
  candidateApplicationExistsForMessageId,
  createCandidateApplication,
  storeResumeInR2,
  updateNotificationEmailStatus,
} from "./candidate-applications-db.ts";
import type { sendApplicationEmail } from "./send-application-email.ts";

// candidate-applications-db.ts and send-application-email.ts both import
// "cloudflare:workers" — a virtual module that only resolves inside the
// Workers runtime and fails plain `node --test` at import time regardless of
// which export is used. Everything above this line only imports their
// *types*, which are erased at runtime and never trigger resolution; the
// real implementations are loaded lazily below, only when a caller (i.e.
// the real cron/route, not a test supplying fakes for every dependency)
// actually needs the default behavior.
async function defaultDbDeps() {
  return import("./candidate-applications-db.ts");
}
async function defaultEmailDeps() {
  return import("./send-application-email.ts");
}

// Ingests resumes emailed directly to the recruiting mailbox (see
// MICROSOFT_GRAPH_MAILBOX, default resume@extreme.co.il) — a second intake
// path alongside the website's /intake?track=career form, saving into the
// same candidate_applications table (source: "resume-mailbox") so both
// flows are visible in one place.
//
// A message counts as "processed" once we've looked at it; it's only
// "saved" if a valid resume attachment was found and stored. Either way the
// message gets marked read so it isn't picked up again next run — a human
// can still find it in the mailbox itself, just no longer unread.
//
// Sending a resume to this mailbox is treated as implied consent to process
// it for recruitment purposes (there's no consent checkbox in an email, by
// definition) — consistent with how jobs@extreme.co.il already worked
// before this site existed.

export type ResumeMailboxIngestResult = {
  configured: boolean;
  processed: number;
  saved: number;
  skippedNoAttachment: number;
  skippedInvalidAttachment: number;
  skippedAlreadySaved: number;
  failed: number;
  errors: string[];
};

type Graph = ReturnType<typeof createMicrosoftGraphClient>;

type Deps = {
  graph?: Graph;
  environment?: Record<string, string | undefined>;
  applicationExists?: typeof candidateApplicationExistsForMessageId;
  createApplication?: typeof createCandidateApplication;
  storeResume?: typeof storeResumeInR2;
  sendNotification?: typeof sendApplicationEmail;
  updateEmailStatus?: typeof updateNotificationEmailStatus;
};

function emptyResult(configured: boolean): ResumeMailboxIngestResult {
  return { configured, processed: 0, saved: 0, skippedNoAttachment: 0, skippedInvalidAttachment: 0, skippedAlreadySaved: 0, failed: 0, errors: [] };
}

function pickResumeAttachment(attachments: MicrosoftGraphAttachment[]) {
  for (const attachment of attachments) {
    if (attachment.isInline) continue;
    const decoded = decodeGraphAttachment(attachment);
    if (!decoded) continue;
    const validationError = validateResumeAttachment({ size: decoded.bytes.byteLength, contentType: decoded.contentType, filename: decoded.name });
    if (!validationError) return decoded;
  }
  return null;
}

async function processMessage(graph: Graph, message: MicrosoftGraphMessage, deps: Required<Omit<Deps, "graph" | "environment">>, result: ResumeMailboxIngestResult) {
  if (!message.hasAttachments) {
    result.skippedNoAttachment += 1;
    await graph.markMessageRead(message.id);
    return;
  }

  const messageId = message.internetMessageId ?? message.id;
  if (await deps.applicationExists(messageId)) {
    result.skippedAlreadySaved += 1;
    await graph.markMessageRead(message.id);
    return;
  }

  const attachments = await graph.listMessageAttachments(message.id);
  const resume = pickResumeAttachment(attachments);
  if (!resume) {
    result.skippedInvalidAttachment += 1;
    await graph.markMessageRead(message.id);
    return;
  }

  const candidateEmail = message.from?.emailAddress?.address?.trim() || "";
  const resumeR2Key = await deps.storeResume({ bytes: resume.bytes.buffer as ArrayBuffer, contentType: resume.contentType, filename: resume.name });
  const { id: applicationId } = await deps.createApplication({
    email: candidateEmail,
    resumeR2Key,
    resumeFilename: resume.name,
    resumeContentType: resume.contentType,
    resumeSizeBytes: resume.bytes.byteLength,
    consentGiven: true,
    source: "resume-mailbox",
    sourceMessageId: messageId,
  });
  result.saved += 1;

  // Best-effort only, same rule as the website flow: a notification failure
  // must never lose the application or stop the message from being marked
  // read — the D1/R2 row is already the durable record.
  try {
    await deps.sendNotification({
      candidateEmail,
      role: null,
      jobId: null,
      resumeBytes: resume.bytes.buffer as ArrayBuffer,
      resumeFilename: resume.name,
      resumeContentType: resume.contentType,
    });
    await deps.updateEmailStatus(applicationId, "sent");
  } catch (error) {
    const isNotConfigured = error instanceof ApplicationEmailNotConfiguredError;
    await deps.updateEmailStatus(applicationId, isNotConfigured ? "not_configured" : "failed").catch(() => {});
  }

  await graph.markMessageRead(message.id);
}

export async function ingestResumeMailbox(deps: Deps = {}): Promise<ResumeMailboxIngestResult> {
  let graph: Graph;
  try {
    graph = deps.graph ?? createMicrosoftGraphClient({ environment: deps.environment });
  } catch (error) {
    if (error instanceof MicrosoftGraphNotConfiguredError) return emptyResult(false);
    throw error;
  }

  const needsDb = !deps.applicationExists || !deps.createApplication || !deps.storeResume || !deps.updateEmailStatus;
  const db = needsDb ? await defaultDbDeps() : null;
  const needsEmail = !deps.sendNotification;
  const emailModule = needsEmail ? await defaultEmailDeps() : null;

  const resolvedDeps = {
    applicationExists: deps.applicationExists ?? db!.candidateApplicationExistsForMessageId,
    createApplication: deps.createApplication ?? db!.createCandidateApplication,
    storeResume: deps.storeResume ?? db!.storeResumeInR2,
    sendNotification: deps.sendNotification ?? emailModule!.sendApplicationEmail,
    updateEmailStatus: deps.updateEmailStatus ?? db!.updateNotificationEmailStatus,
  };

  const result = emptyResult(true);
  const messages = await graph.listInboxMessages({ unreadOnly: true, top: 50 });

  for (const message of messages) {
    result.processed += 1;
    try {
      await processMessage(graph, message, resolvedDeps, result);
    } catch (error) {
      result.failed += 1;
      const messageText = error instanceof Error ? error.message : String(error);
      result.errors.push(`${message.id}: ${messageText}`.slice(0, 300));
    }
  }

  return result;
}
