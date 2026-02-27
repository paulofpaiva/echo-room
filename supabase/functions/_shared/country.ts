/**
 * Resolve country code (ISO 3166-1 alpha-2) from the request using the client IP.
 * Used when the client does not send a valid country_code (e.g. geo not loaded yet).
 */
const GEO_URL = "https://get.geojs.io/v1/ip/geo";
const TIMEOUT_MS = 2000;

function getClientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (!forwarded) return null;
  const first = forwarded.split(/\s*,\s*/)[0]?.trim();
  return first || null;
}

function normalize(value: unknown): string | null {
  if (value == null || typeof value !== "string") return null;
  const s = value.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(s) ? s : null;
}

export async function getCountryCodeFromRequest(req: Request): Promise<string | null> {
  const ip = getClientIp(req);
  if (!ip) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(`${GEO_URL}/${ip}.json`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const data = (await res.json()) as { country_code?: string };
    const code = data?.country_code;
    return normalize(code) ?? null;
  } catch {
    return null;
  }
}
