import { getFingerprintDisplay } from "@/lib/fingerprint";
import { cn } from "@/lib/utils";

interface FingerprintBadgeProps {
  anonFingerprint: string | null;
  className?: string;
}

export function FingerprintBadge({
  anonFingerprint,
  className,
}: FingerprintBadgeProps) {
  const { shortHash, bgColor, textColor } =
    getFingerprintDisplay(anonFingerprint);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono font-medium",
        className
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
      title={anonFingerprint ?? "Anonymous"}
    >
      {shortHash}
    </span>
  );
}
