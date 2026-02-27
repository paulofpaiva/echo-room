const SHORT_LENGTH = 8;

/**
 * Returns a short hash (first 8 chars) and a stable color derived from the fingerprint
 * so the same author is always shown with the same color.
 */
export function getFingerprintDisplay(
  anonFingerprint: string | null
): { shortHash: string; bgColor: string; textColor: string } {
  if (!anonFingerprint || anonFingerprint.length === 0) {
    return {
      shortHash: "anon",
      bgColor: "hsl(var(--muted))",
      textColor: "hsl(var(--muted-foreground))",
    };
  }
  const shortHash = anonFingerprint.slice(0, SHORT_LENGTH);
  const hue = hashToHue(anonFingerprint);
  const bgColor = `hsl(${hue}, 55%, 35%)`;
  const textColor = "hsl(0, 0%, 100%)";
  return { shortHash, bgColor, textColor };
}

function hashToHue(hex: string): number {
  let n = 0;
  for (let i = 0; i < Math.min(hex.length, 12); i++) {
    n = (n * 31 + hex.charCodeAt(i)) >>> 0;
  }
  return n % 360;
}
