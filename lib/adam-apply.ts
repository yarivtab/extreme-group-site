// Adapter for submitting a candidate application (contact details + resume file)
// to Adam's ATS. This is intentionally NOT wired to the public site yet.
//
// Adam's public Career API base (`ADAM_API_BASE_URL`, see lib/adam.ts) only
// documents job sync (`GetOrdersDetails`). There is no known, confirmed
// endpoint for creating a candidate, attaching a resume file, or applying a
// candidate to a specific order/job. Do NOT invent one.
//
// This module exists so the shape of "submit a candidate to Adam" is defined
// once, in one place, ready to be implemented the moment Adam provides the
// real endpoint/spec (see docs/adam-candidate-api-requirements.md). Until
// then, calling `submitCandidateToAdam` always fails with a clear,
// non-misleading error — callers must not present success to a user based on
// this function resolving.

export type CandidateApplication = {
  /** Adam order/job id the candidate is applying to, if any (general applications may omit this). */
  jobId?: string;
  email: string;
  /** Raw resume file as submitted by the browser. */
  resumeFile: {
    filename: string;
    contentType: string;
    bytes: ArrayBuffer;
  };
  /** Marketing/site consent checkbox the candidate agreed to. */
  consentGiven: boolean;
  /** Where the application originated, for our own records only (not sent to Adam unless the spec asks for it). */
  source: "career-intake";
};

export type CandidateApplicationResult = {
  ok: true;
  /** Adam-side candidate/application identifier, once known. */
  adamCandidateId: string;
  /** Fields Adam's parser could not extract with confidence, if Adam exposes this. */
  missingFields?: string[];
};

export class AdamApplyNotConfiguredError extends Error {
  constructor() {
    super(
      "Adam candidate-submission API is not configured. No endpoint, auth method, or upload " +
        "format has been confirmed with Adam yet. See docs/adam-candidate-api-requirements.md."
    );
    this.name = "AdamApplyNotConfiguredError";
  }
}

/**
 * Submits a candidate application to Adam.
 *
 * NOT IMPLEMENTED. Always throws `AdamApplyNotConfiguredError` until Adam's
 * candidate-submission API spec (endpoint, auth, upload format, response
 * shape) is confirmed and the real implementation replaces this body.
 *
 * Callers (e.g. an /api route backing the intake form) must treat a thrown
 * error here as "do not show the applicant a success state."
 */
export async function submitCandidateToAdam(
  application: CandidateApplication
): Promise<CandidateApplicationResult> {
  // Signature kept stable for the future real implementation.
  void application;
  throw new AdamApplyNotConfiguredError();
}
