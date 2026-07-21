# Adam candidate-submission API — what we need before going live

## Status

Blocked. The site currently syncs **jobs from Adam** (`GetOrdersDetails`, see
`lib/adam.ts` and `app/api/adam/sync/route.ts`), but there is no confirmed
endpoint for the reverse direction: submitting a **candidate + resume file**
into Adam. The `/intake?track=career` form stays in explicit demo mode
(nothing is sent or stored) until this is resolved.

Do not guess at an endpoint or response shape. `lib/adam-apply.ts` defines the
adapter interface our side will call once the real integration exists; it
throws `AdamApplyNotConfiguredError` until then.

### 2026-07-20 update — reviewed Adam's "פרסום משרה" guide + a company token

Yariv shared Adam's job-publishing guide (coordinator + developer sections)
and a company token. Findings:

- The guide only documents the **read side**: `GetOrdersList` and
  `GetOrdersDetails` under `/api/Career` (Swagger:
  `https://services.adamtotal.co.il/swagger/ui/index#!/Career/...`). No
  candidate/application/resume-upload endpoint is mentioned anywhere in it.
- Adam authenticates `GetOrdersDetails` calls by **allowlisted server IP**,
  not just the token — per the guide: "after you provide the IP of the
  servers you'll call from, we'll configure it and give back a company
  token." So even a valid token will reject calls from an unlisted IP.
- The token from `token.txt` looks like a real `ADAM_COMPANY_TOKEN`. It has
  been saved to a local, gitignored `.env` (not committed, not sent
  anywhere) so the existing job-sync feature can be tested locally. **It has
  not been used to call Adam** — that should wait for a deliberate test from
  an IP Adam has allowlisted (this sandbox's IP almost certainly is not).
- The guide's Swagger login (password only, no username) covers **all** of
  Adam's API, not just `Career` — if we can get in, it would show whether a
  candidate/application controller exists at all. We don't have a username
  yet; added to the question list below.
- **Conclusion: this did not unblock candidate submission.** Everything in
  "What we need from Adam" below is still open.

## What we need from Adam, before writing any integration code

1. **Endpoint URL** — the equivalent of `GetOrdersDetails` but for creating a
   candidate and/or an application. Likely under the same
   `https://services.adamtotal.co.il/api/Career` base, but needs confirming.
2. **Authentication** — is it the same `ADAM_COMPANY_TOKEN` model as the job
   sync call (token in JSON body), or a separate credential/scope for write
   access?
3. **Candidate + application creation format** — exact request shape:
   - Which fields are required vs. optional (name, email, phone, etc.)?
   - Is a candidate created separately from an "apply to job" action, or is
     it one call?
   - What is the required job identifier — is it the same `order_id` used in
     `GetOrdersDetails`/`adam_jobs.id`?
   - Is a "general application" (no specific job) supported, or does every
     submission need an `order_id`?
4. **Resume file upload** — how is the file itself transmitted?
   - Multipart form upload, base64-encoded field in JSON, or a separate
     upload endpoint that returns a file reference to attach afterward?
   - Accepted MIME types / extensions (we currently accept
     `.pdf`, `.doc`, `.docx` client-side — need this confirmed server-side).
   - Maximum file size.
5. **Response shape** — on success, what does Adam return (candidate id,
   application id, confirmation status)? On failure, what does an error
   response look like (status codes, error body format)? We need this to
   know when it's safe to show the applicant a success state.
6. **Parsing behavior** — the intake form's copy currently says "we'll
   extract contact/experience details from the file; we'll only ask for
   what's missing." That claim depends entirely on Adam (or us) doing resume
   parsing:
   - Does Adam's API parse the uploaded file and return extracted fields
     (name, phone, experience, etc.) synchronously, asynchronously via
     webhook, or not at all?
   - If parsing is async, how do we poll or get notified of the result?
   - What does Adam return when parsing fails or a field can't be extracted
     confidently — a list of missing/low-confidence fields we can prompt the
     candidate for, or nothing usable?
   - If Adam does not parse resumes at all, we need a fallback plan (e.g. our
     own parsing step, or falling back to asking for the missing fields
     directly on our form) — this changes the intake UX materially.
7. **Rate limits / idempotency** — can the same candidate submit twice
   without creating duplicates? Is there a dedupe key we should send?
8. **Sandbox / test environment** — a non-production token or base URL we
   can point staging at, so we can run a real end-to-end submission before
   touching the live site (see the E2E test requirement below).

## Organized question list to send to the Adam contact

1. Is there an API endpoint for creating a candidate and/or submitting an
   application (as opposed to `GetOrdersDetails`, which only reads job
   orders)? What is the URL?
2. What authentication does that endpoint expect — the same company token we
   use for job sync, or something else?
3. Can you share the request/response schema (ideally a Swagger/OpenAPI doc
   or sample payloads) for creating a candidate and attaching them to a
   specific `order_id`?
4. How do we upload the resume file — multipart, base64 field, or a separate
   upload call? What file types and max size are supported?
5. Does the API parse the resume and return extracted fields (name, phone,
   email, experience)? Is that synchronous or asynchronous? What do you
   return when a field can't be extracted?
6. What does a successful response look like, and what does a failure
   response look like (status codes + error body)?
7. Is there a sandbox/test environment and a test token we can use from a
   staging deployment before going live?
8. Are duplicate submissions from the same candidate/email handled
   automatically, or do we need to prevent/dedupe them on our side?
9. Are there rate limits on this endpoint we should design around?
10. Can we get a username for the full Swagger UI (not just the `Career`
    section) so we can check whether a candidate/application controller
    already exists elsewhere in the API?
11. Which server IP(s) should be allowlisted for our Staging and Production
    environments to call `/api/Career` (and any future candidate endpoint)?

## Definition of done for this integration

- [ ] Answers to all questions above received from Adam.
- [ ] `lib/adam-apply.ts` implemented against the real endpoint (replacing
      the `AdamApplyNotConfiguredError` stub).
- [ ] Intake form only shows a success state after the server confirms the
      submission was saved/accepted — never optimistically.
- [ ] Parsing failures and missing fields are handled with follow-up
      questions only (no free-text/manual fields reintroduced up front).
- [ ] `ADAM_COMPANY_TOKEN`, `ADAM_SYNC_SECRET`, and `SITE_URL` set in the
      Staging environment.
- [ ] A real end-to-end candidate submission (real file, real email)
      succeeds against Staging.
- [ ] End-to-end test added covering the real submission path.
- [ ] Only after all of the above: deploy to production.
