// Shared validation between /api/intake/parse and /api/intake/apply so the
// two routes can't drift out of sync on what counts as an acceptable resume.

export const MAX_RESUME_BYTES = 8 * 1024 * 1024; // 8 MB

const ACCEPTED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

/** Core check shared by the website upload (a `File`) and the resume-mailbox ingester (raw Graph attachment bytes). */
export function validateResumeAttachment(attachment: { size: number; contentType: string; filename: string }): string | null {
  if (attachment.size === 0) return "Resume file is empty";
  if (attachment.size > MAX_RESUME_BYTES) return "Resume file is too large (max 8MB)";
  const contentType = attachment.contentType || "application/octet-stream";
  if (!ACCEPTED_CONTENT_TYPES.has(contentType) && !/\.(pdf|docx?)$/i.test(attachment.filename)) {
    return "Unsupported file type";
  }
  return null;
}

export function validateResumeFile(file: File): string | null {
  return validateResumeAttachment({ size: file.size, contentType: file.type || "application/octet-stream", filename: file.name });
}
