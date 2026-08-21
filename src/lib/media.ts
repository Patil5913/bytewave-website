
export function mediaUrl(value: unknown): string | undefined {
  if (typeof value === "string") return value || undefined;
  if (value && typeof value === "object") {
    const url = (value as { url?: unknown }).url;
    if (typeof url === "string" && url) return url;
  }
  return undefined;
}

export function mediaAlt(value: unknown, fallback: string): string {
  if (value && typeof value === "object") {
    const alt = (value as { alt?: unknown }).alt;
    if (typeof alt === "string" && alt) return alt;
  }
  return fallback;
}
