const COOKIE_OPTIONS = "path=/; max-age=31536000; samesite=lax";

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${encodeURIComponent(name)}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setCookie(name: string, value: string): void {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ${COOKIE_OPTIONS}`;
}

export function getBooleanCookie(name: string): boolean {
  const raw = getCookie(name);
  return raw === "true";
}

export function setBooleanCookie(name: string, value: boolean): void {
  setCookie(name, value ? "true" : "false");
}
