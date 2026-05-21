const SAFE_FILENAME_REGEX = /^[A-Za-z0-9._() -]+$/;

export function sanitizePhotoFilenames(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  const seen = new Set<string>();
  const safe: string[] = [];

  for (const item of input) {
    if (typeof item !== "string") continue;
    const cleaned = item.trim();
    if (!cleaned) continue;
    if (!SAFE_FILENAME_REGEX.test(cleaned)) continue;
    if (seen.has(cleaned)) continue;
    seen.add(cleaned);
    safe.push(cleaned);
  }

  return safe;
}

export function parsePhotoFilenamesFromText(input: string): string[] {
  const chunks = input
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean);
  return sanitizePhotoFilenames(chunks);
}
