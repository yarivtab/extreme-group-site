// Intentionally disabled. The career intake flow was simplified back to a
// single step (upload + email + consent, no parse/confirm screen) per
// Yariv's product call — the extra step added friction without enough
// payoff for this audience. The building blocks (lib/resume-text-extract.ts,
// lib/resume-parser.ts) are kept for a possible future, more complete
// system; this route just isn't wired to anything anymore.
//
// Note: this file could not be deleted from the environment used to make
// this change (sandbox restriction) — it was emptied out instead. Safe to
// delete this file (and the now-empty app/api/intake/parse/ directory)
// the next time someone is in a normal editor/terminal, if desired.
export async function POST() {
  return Response.json({ error: "Not found" }, { status: 404 });
}
