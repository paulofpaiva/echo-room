/**
 * Fetches the current client's country code (ISO 3166-1 alpha-2) via a public
 * IP geolocation API. Result is cached in memory for the session.
 */

const CACHE_KEY = "__echo_room_country_code";
const GEO_URL = "https://get.geojs.io/v1/ip/country.json";

let cached: string | null | undefined = undefined;

export async function fetchCountryCode(): Promise<string | null> {
  if (cached !== undefined) return cached;
  try {
    const res = await fetch(GEO_URL, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) {
      cached = null;
      return null;
    }
    const data = (await res.json()) as { country?: string };
    const code = typeof data?.country === "string" ? data.country.trim().toUpperCase() : null;
    cached = /^[A-Z]{2}$/.test(code ?? "") ? code : null;
    return cached;
  } catch {
    cached = null;
    return null;
  } finally {
    if (cached !== undefined && typeof sessionStorage !== "undefined") {
      if (cached) sessionStorage.setItem(CACHE_KEY, cached);
      else sessionStorage.removeItem(CACHE_KEY);
    }
  }
}

export function getCachedCountryCode(): string | null {
  if (cached !== undefined) return cached;
  const stored = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(CACHE_KEY) : null;
  if (stored && /^[A-Z]{2}$/.test(stored)) {
    cached = stored;
    return stored;
  }
  return null;
}

export function setCachedCountryCode(code: string | null): void {
  cached = code;
  if (typeof sessionStorage !== "undefined") {
    if (code) sessionStorage.setItem(CACHE_KEY, code);
    else sessionStorage.removeItem(CACHE_KEY);
  }
}
