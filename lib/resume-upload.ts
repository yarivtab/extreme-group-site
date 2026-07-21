// Shared validation between /api/intake/parse and /api/intake/apply so the
// two routes can't drift out of sync on what counts as an acceptable resume.

export const MAX_RESUME_BYTES = 8 * 1024 * 1024; // 8 MB

const ACCEPTED_CONTENT_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

export function validateResumeFile(file: File): string | null {
  if (file.size === 0) return "Resume file is empty";
  if (file.size > MAX_RESUME_BYTES) return "Resume file is too large (max 8MB)";
  const contentType = file.type || "application/octet-stream";
  if (!ACCEPTED_CONTENT_TYPES.has(contentType) && !/\.(pdf|docx?)$/i.test(file.name)) {
    return "Unsupported file type";
  }
  return null;
}
