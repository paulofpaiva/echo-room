import { useState, useRef, useEffect } from "react";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareCopyButtonProps {
  path: string;
  className?: string;
  iconClassName?: string;
}

export function ShareCopyButton({ path, className, iconClassName }: ShareCopyButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setOpen(false);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setOpen(false);
    }
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
        aria-label="Share"
        aria-expanded={open}
      >
        {copied ? (
          <Check className={cn("h-3.5 w-3.5 text-green-600", iconClassName)} />
        ) : (
          <Share2 className={cn("h-3.5 w-3.5", iconClassName)} />
        )}
      </button>
      {open && (
        <div
          className="absolute right-0 top-full z-10 mt-1 min-w-[120px] rounded-md border border-border bg-card px-2 py-1.5 text-sm shadow-md"
          role="tooltip"
        >
          <button
            type="button"
            onClick={handleCopy}
            className="w-full rounded px-2 py-1 text-left hover:bg-muted"
          >
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}
