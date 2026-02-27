import { useState, useRef, useEffect } from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { useCreateReport } from "@/hooks/useCreateReport";
import { getOrCreateAnonFingerprint } from "@/lib/anon-fingerprint";
import { cn } from "@/lib/utils";

const REPORT_REASONS: { value: string; label: string }[] = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate", label: "Inappropriate" },
  { value: "other", label: "Other" },
];

export function ReportButton({
  targetType,
  targetId,
  className,
  iconClassName,
}: {
  targetType: "post" | "comment" | "news_comment";
  targetId: string;
  className?: string;
  iconClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const createReport = useCreateReport();

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleReport = (reason: string) => {
    setOpen(false);
    const promise = createReport.mutateAsync({
      targetType,
      targetId,
      reason,
      anonFingerprint: getOrCreateAnonFingerprint() || null,
    });
    toast.promise(promise, {
      loading: "Reporting...",
      success: "Report submitted. Thank you for helping keep the community safe.",
      error: "Failed to submit report. Please try again.",
    });
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        onClick={handleTriggerClick}
        className="flex items-center justify-center rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Report"
        aria-expanded={open}
      >
        <Flag className={cn("h-3.5 w-3.5", iconClassName)} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-md border border-border bg-card py-1 text-sm shadow-md"
          role="menu"
        >
          <p className="px-2 py-1 text-xs text-muted-foreground">
            Report as
          </p>
          {REPORT_REASONS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleReport(r.value);
              }}
              disabled={createReport.isPending}
              className="w-full px-2 py-1.5 text-left hover:bg-muted"
            >
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
