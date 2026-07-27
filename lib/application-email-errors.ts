// Split out from send-application-email.ts so this error class can be
// imported (for `instanceof` checks) from code and tests that must NOT pull
// in "cloudflare:workers" — a virtual module that only resolves inside the
// Workers runtime and fails plain `node --test` at import time, even if the
// specific named export used never touches `env`.

export class ApplicationEmailNotConfiguredError extends Error {
  constructor() {
    super("RESEND_API_KEY is not configured — application emails cannot be sent.");
    this.name = "ApplicationEmailNotConfiguredError";
  }
}
