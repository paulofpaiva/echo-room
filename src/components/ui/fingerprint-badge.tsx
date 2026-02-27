import { getFingerprintDisplay } from "@/lib/fingerprint";
import { countryCodeToFlagEmoji } from "@/lib/country-flag";
import { cn } from "@/lib/utils";

interface FingerprintBadgeProps {
  anonFingerprint: string | null;
  countryCode?: string | null;
  className?: string;
}

export function FingerprintBadge({
  anonFingerprint,
  countryCode,
  className,
}: FingerprintBadgeProps) {
  const { shortHash, bgColor, textColor } =
    getFingerprintDisplay(anonFingerprint);
  const flag = countryCodeToFlagEmoji(countryCode);

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {flag ? (
        <span
          className="inline-block text-sm leading-none"
          role="img"
          aria-label={countryCode ? `Country: ${countryCode}` : undefined}
        >
          {flag}
        </span>
      ) : null}
      <span
        className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono font-medium"
        style={{ backgroundColor: bgColor, color: textColor }}
        title={anonFingerprint ?? "Anonymous"}
      >
        {shortHash}
      </span>
    </span>
  );
}
