/** ISO 3166-1 alpha-2 (e.g. "BR", "US") to flag emoji (e.g. 🇧🇷 🇺🇸). */
export function countryCodeToFlagEmoji(code: string | null | undefined): string {
  if (!code || code.length !== 2) return "";
  const a = code.toUpperCase().charCodeAt(0);
  const b = code.toUpperCase().charCodeAt(1);
  if (a < 65 || a > 90 || b < 65 || b > 90) return "";
  return String.fromCodePoint(0x1f1e6 - 65 + a, 0x1f1e6 - 65 + b);
}
