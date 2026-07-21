// Extracts plain text from an uploaded resume so it can be sent to the
// resume parser (see lib/resume-parser.ts). Supports PDF and DOCX, which
// cover the vast majority of resumes and are the only formats that can be
// parsed reliably with pure-JS libraries in a Cloudflare Worker.
//
// Legacy .doc (binary, pre-2007 Word format) has no reliable pure-JS parser
// available for a Workers runtime — we deliberately don't attempt it and
// instead fall back to asking the candidate to fill in every field by hand.

export type ResumeExtractionStatus = "ok" | "empty" | "unsupported" | "failed";

export type ResumeExtractionResult = {
  text: string;
  status: ResumeExtractionStatus;
};

function detectKind(filename: string, contentType: string): "pdf" | "docx" | "doc" | "unknown" {
  const lowerName = filename.toLowerCase();
  if (contentType === "application/pdf" || lowerName.endsWith(".pdf")) return "pdf";
  if (
    contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    return "docx";
  }
  if (contentType === "application/msword" || lowerName.endsWith(".doc")) return "doc";
  return "unknown";
}

export async function extractResumeText(params: {
  bytes: ArrayBuffer;
  filename: string;
  contentType: string;
}): Promise<ResumeExtractionResult> {
  const kind = detectKind(params.filename, params.contentType);

  if (kind === "pdf") {
    try {
      const { extractText } = await import("unpdf");
      const { text } = await extractText(new Uint8Array(params.bytes), { mergePages: true });
      const trimmed = text.trim();
      return { text: trimmed, status: trimmed ? "ok" : "empty" };
    } catch {
      // Likely a scanned/image-only PDF (no embedded text layer) or a corrupt file.
      return { text: "", status: "failed" };
    }
  }

  if (kind === "docx") {
    try {
      const mammoth = await import("mammoth");
      // mammoth's Node entry point only recognizes `{ path }` or `{ buffer }`
      // (its `{ arrayBuffer }` input type is for the separate browser bundle) —
      // verified directly, since the type declarations are misleading here.
      const { value } = await mammoth.extractRawText({ buffer: Buffer.from(params.bytes) });
      const trimmed = value.trim();
      return { text: trimmed, status: trimmed ? "ok" : "empty" };
    } catch {
      return { text: "", status: "failed" };
    }
  }

  // .doc or anything else we don't recognize.
  return { text: "", status: "unsupported" };
}
