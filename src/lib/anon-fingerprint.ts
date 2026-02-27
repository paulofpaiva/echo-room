const STORAGE_KEY = "echo-room-anon-fingerprint";

function randomHex(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getOrCreateAnonFingerprint(): string {
  if (typeof window === "undefined") return "";
  try {
    let value = localStorage.getItem(STORAGE_KEY);
    if (!value) {
      value = randomHex(16);
      localStorage.setItem(STORAGE_KEY, value);
    }
    return value;
  } catch {
    return randomHex(16);
  }
}
