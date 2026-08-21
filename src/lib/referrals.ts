
export const REFERRAL_COOKIE = "fh_ref";

export const REFERRAL_CODE_RE = /^[A-Z0-9]{4,16}$/;

export function readCookie(
  header: string | null,
  name: string,
): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}
