import { MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { cn } from "@/lib/utils";

interface HomePostListSkeletonProps {
  count?: number;
  horizontal?: boolean;
  variant?: "card" | "list" | "column";
}

export function HomePostListSkeleton({
  count = 3,
  horizontal = false,
  variant = "card",
}: HomePostListSkeletonProps) {
  if (variant === "column") {
    const widths = ["w-32", "w-40", "w-28", "w-36", "w-24", "w-40", "w-32", "w-28", "w-36", "w-30"];
    return (
      <ul className="list-none columns-2 gap-x-4 gap-y-0.5">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="break-inside-avoid py-0.5">
            <Skeleton className={cn("h-4 inline-block", widths[i % widths.length])} />
          </li>
        ))}
      </ul>
    );
  }

  if (variant === "list") {
    return (
      <ul className="list-none divide-y divide-border">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="flex items-center gap-2 px-3 py-2">
            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-3 flex-1 max-w-[60%]" />
                <Skeleton className="h-4 w-12 shrink-0 rounded-full" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-3 w-20 shrink-0" />
                <Skeleton className="h-3 flex-1 min-w-0 max-w-[35%]" />
                <MessageCircle className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                <Skeleton className="h-2.5 w-5 shrink-0" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
          </li>
        ))}
      </ul>
    );
  }

  const listClass = horizontal
    ? "grid grid-cols-12 gap-2"
    : "space-y-2";

  return (
    <ul className={listClass}>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className={horizontal ? "min-w-0 col-span-12 sm:col-span-4" : undefined}>
          <div className="rounded-lg border border-border/60 bg-card px-3 py-2.5 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-3 w-20" />
              <span className="flex items-center gap-1 text-muted-foreground">
                <MessageCircle className="h-3 w-3" />
                <Skeleton className="h-3 w-5" />
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
