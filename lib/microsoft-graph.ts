const GRAPH_BASE_URL = "https://graph.microsoft.com/v1.0";
const TOKEN_EXPIRY_SKEW_MS = 60_000;

export type MicrosoftGraphConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  mailbox: string;
};

export type MicrosoftGraphMessage = {
  id: string;
  subject?: string | null;
  receivedDateTime?: string | null;
  hasAttachments?: boolean;
  isRead?: boolean;
  internetMessageId?: string | null;
  from?: {
    emailAddress?: {
      name?: string | null;
      address?: string | null;
    };
  } | null;
};

export type MicrosoftGraphAttachment = {
  id: string;
  "@odata.type"?: string;
  name?: string | null;
  contentType?: string | null;
  size?: number;
  isInline?: boolean;
  contentBytes?: string;
};

type FetchLike = typeof fetch;

type AccessTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

type GraphCollection<T> = {
  value?: T[];
  "@odata.nextLink"?: string;
};

export class MicrosoftGraphNotConfiguredError extends Error {
  constructor(missingVariables: string[]) {
    super(`Microsoft Graph is not configured (missing: ${missingVariables.join(", ")})`);
    this.name = "MicrosoftGraphNotConfiguredError";
  }
}

export class MicrosoftGraphRequestError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(`Microsoft Graph request failed (${status}): ${message}`);
    this.name = "MicrosoftGraphRequestError";
    this.status = status;
  }
}

function requiredEnv(name: string, environment: Record<string, string | undefined>) {
  return environment[name]?.trim() ?? "";
}

export function microsoftGraphConfigFromEnv(
  environment: Record<string, string | undefined> = process.env,
): MicrosoftGraphConfig {
  const config: MicrosoftGraphConfig = {
    tenantId: requiredEnv("MICROSOFT_GRAPH_TENANT_ID", environment),
    clientId: requiredEnv("MICROSOFT_GRAPH_CLIENT_ID", environment),
    clientSecret: requiredEnv("MICROSOFT_GRAPH_CLIENT_SECRET", environment),
    mailbox: requiredEnv("MICROSOFT_GRAPH_MAILBOX", environment),
  };

  const missingVariables = Object.entries({
    MICROSOFT_GRAPH_TENANT_ID: config.tenantId,
    MICROSOFT_GRAPH_CLIENT_ID: config.clientId,
    MICROSOFT_GRAPH_CLIENT_SECRET: config.clientSecret,
    MICROSOFT_GRAPH_MAILBOX: config.mailbox,
  })
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missingVariables.length) throw new MicrosoftGraphNotConfiguredError(missingVariables);
  return config;
}

function safeGraphPath(path: string) {
  if (!path.startsWith("/")) throw new Error("Microsoft Graph path must start with '/'");
  return `${GRAPH_BASE_URL}${path}`;
}

async function responseMessage(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const payload = await response.json().catch(() => null) as {
      error?: { code?: string; message?: string };
    } | null;
    const code = payload?.error?.code?.trim();
    const message = payload?.error?.message?.trim();
    return [code, message].filter(Boolean).join(": ").slice(0, 500) || response.statusText;
  }

  return (await response.text()).trim().slice(0, 500) || response.statusText;
}

export function createMicrosoftGraphClient(options: {
  config?: MicrosoftGraphConfig;
  environment?: Record<string, string | undefined>;
  fetch?: FetchLike;
} = {}) {
  const config = options.config ?? microsoftGraphConfigFromEnv(options.environment);
  const fetcher = options.fetch ?? fetch;
  let cachedToken: { value: string; expiresAt: number } | null = null;

  async function accessToken() {
    if (cachedToken && cachedToken.expiresAt - TOKEN_EXPIRY_SKEW_MS > Date.now()) {
      return cachedToken.value;
    }

    const body = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    });
    const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/token`;
    const response = await fetcher(tokenUrl, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!response.ok) {
      throw new MicrosoftGraphRequestError(response.status, await responseMessage(response));
    }

    const payload = await response.json() as AccessTokenResponse;
    if (!payload.access_token) {
      throw new MicrosoftGraphRequestError(response.status, "token endpoint returned no access token");
    }

    cachedToken = {
      value: payload.access_token,
      expiresAt: Date.now() + Math.max(1, payload.expires_in ?? 3600) * 1000,
    };
    return cachedToken.value;
  }

  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await accessToken();
    const headers = new Headers(init.headers);
    headers.set("authorization", `Bearer ${token}`);
    if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");

    const response = await fetcher(safeGraphPath(path), { ...init, headers });
    if (!response.ok) {
      throw new MicrosoftGraphRequestError(response.status, await responseMessage(response));
    }

    if (response.status === 204) return undefined as T;
    return await response.json() as T;
  }

  const mailboxPath = `/users/${encodeURIComponent(config.mailbox)}`;

  return {
    request,

    async listInboxMessages(options: { unreadOnly?: boolean; top?: number } = {}) {
      const top = Math.min(100, Math.max(1, Math.trunc(options.top ?? 25)));
      const query = new URLSearchParams({
        "$select": "id,subject,receivedDateTime,from,hasAttachments,isRead,internetMessageId",
        "$orderby": "receivedDateTime asc",
        "$top": String(top),
      });
      if (options.unreadOnly !== false) query.set("$filter", "isRead eq false");

      const result = await request<GraphCollection<MicrosoftGraphMessage>>(
        `${mailboxPath}/mailFolders/inbox/messages?${query}`,
      );
      return result.value ?? [];
    },

    async listMessageAttachments(messageId: string) {
      const result = await request<GraphCollection<MicrosoftGraphAttachment>>(
        `${mailboxPath}/messages/${encodeURIComponent(messageId)}/attachments`,
      );
      return result.value ?? [];
    },

    async markMessageRead(messageId: string) {
      await request<void>(`${mailboxPath}/messages/${encodeURIComponent(messageId)}`, {
        method: "PATCH",
        body: JSON.stringify({ isRead: true }),
      });
    },
  };
}

export function decodeGraphAttachment(attachment: MicrosoftGraphAttachment) {
  if (attachment["@odata.type"] !== "#microsoft.graph.fileAttachment" || !attachment.contentBytes) {
    return null;
  }

  return {
    id: attachment.id,
    name: attachment.name?.trim() || "attachment",
    contentType: attachment.contentType?.trim() || "application/octet-stream",
    bytes: Uint8Array.from(Buffer.from(attachment.contentBytes, "base64")),
  };
}
