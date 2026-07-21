# Career intake UX — pattern reference (Mercor)

Yariv asked us to look at how Mercor (work.mercor.com) structures resume
submission and consider adopting something similar. Researched their public
docs (`talent.docs.mercor.com`) and the live application flow. Notes below,
plus a recommendation for our own intake form.

## What Mercor actually does

Mercor separates two things we currently collapse into one step:

1. **Profile** — a one-time resume upload + contact confirmation, done once
   per candidate account, reused across every application afterward.
2. **Application** — a per-listing checklist (resume [from profile],
   role-specific assessment/interview, work authorization) that references
   the profile instead of re-collecting it.

The part directly relevant to us is step 1, their résumé intake:

1. Candidate uploads a résumé. **PDF only.**
2. Mercor parses it and pre-fills the profile: name, roles, skills,
   education.
3. Candidate is shown a **review screen** with the parsed fields already
   filled in — they confirm or correct name, email, phone, city, country,
   and LinkedIn (or tick "I don't have one"). Docs explicitly say: "Fix
   anything the parser missed."
4. Only after that confirmation does the profile (and by extension any
   application built on it) count as complete.

Explicit résumé requirements from their docs, presumably because these
directly affect parse quality:

- PDF only, OCR-friendly / text-based — not a scanned image.
- 1–2 pages, under 2 MB.
- Simple, standard layout — no images, tables, or complex design.
- Clear section headings: Education, Experience, Skills, Certifications.

Other details worth noting: progress autosaves and is resumable; a résumé
re-upload triggers a re-parse with suggested updates the candidate approves
before saving; there's no way to "just email a resume" — everything routes
through the platform so parsing and matching stay consistent.

## How this compares to our current /intake?track=career flow

Our form already matches the spirit of this (minimal fields, resume-first,
"we'll ask only what's missing" framing) but is missing the one piece that
makes that framing true: **there's no confirm/review step after upload.**
Right now the form is upload + email + consent, submitted in one shot, with
no screen showing what got extracted or asking the candidate to fill gaps.
That step is exactly what turns "we'll extract details from your file" from
a promise into something real — and it's independent of whichever system
ends up doing the parsing (Adam, or something else).

## Recommendation

Adopt a two-step pattern once real parsing exists, without building a full
account/profile system (we don't need one for a public career-intake form):

1. **Step 1 — Upload.** Same as today: file + email. Add explicit résumé
   guidance mirroring Mercor's (PDF preferred, text-based not scanned,
   reasonable size limit) since that's what makes any parser — Adam's or
   ours — actually work.
2. **Step 2 — Confirm.** After the file is parsed, show the candidate what
   was extracted and ask only for what's missing or low-confidence, before
   final submit. This is the "follow-up questions only" behavior already
   promised in the docs at `docs/adam-candidate-api-requirements.md`.

**Not recommended right now:** building the Step 2 UI ahead of real
parsing. A "confirm your details" screen with fabricated/fake parsed data
would be the same kind of misleading demo Yariv already asked us to avoid —
it should only ship once there's a real parser behind it (see the open
questions in `docs/adam-candidate-api-requirements.md`, especially whether
Adam parses resumes at all or whether we need our own parsing step).

## Open question this raises for Adam

If Adam's API turns out not to parse résumés (see question 5 in
`docs/adam-candidate-api-requirements.md`), we may need our own
lightweight parsing step to make Step 2 possible at all — which changes the
scope of "connect the form to real submission" beyond just calling Adam's
endpoint.

## 2026-07-20 update — built it, then cut it

Built the full Mercor-style flow above (upload → OpenAI parse → confirm
screen with pre-filled/editable fields) and tested it end-to-end with a real
résumé. It worked. Yariv's call after seeing it live: cut the confirm step.
His reasoning — the Israeli audience for this form is impatient with forms;
a second screen asking them to review/complete fields is friction most
won't tolerate, even if the fields are pre-filled. Simpler wins: upload the
résumé, done.

Current flow, single step:

1. Candidate uploads a résumé, enters an email, checks consent, submits.
2. Server saves the file to R2 + a row to D1 (durable record — see
   `lib/candidate-applications-db.ts`), then best-effort emails the résumé
   as an attachment to the recruiting inbox (`lib/send-application-email.ts`,
   via Resend) so a human sees it right away. An email failure is logged and
   recorded in `notification_email_status`, but never blocks the
   candidate's success screen — the D1/R2 row is already saved regardless.

What happened to the parsing code: kept, not deleted. `lib/resume-parser.ts`
and `lib/resume-text-extract.ts` still work (verified against a real OpenAI
call and a real PDF) but nothing calls them anymore.
`app/api/intake/parse/route.ts` is a disabled stub. If "a more comprehensive
system" (Yariv's phrase) gets built later — accounts, saved profiles,
reused applications, closer to what Mercor actually does — these are the
pieces to wire back in rather than rebuild.
