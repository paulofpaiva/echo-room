import { MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/skeleton/Skeleton";

interface HomePostListSkeletonProps {
  count?: number;
  horizontal?: boolean;
  variant?: "card" | "list";
}

export function HomePostListSkeleton({
  count = 3,
  horizontal = false,
  variant = "card",
}: HomePostListSkeletonProps) {
  if (variant === "list") {
    return (
      <ul className="list-none border rounded-md divide-y divide-border">
        {Array.from({ length: count }).map((_, i) => (
          <li key={i} className="px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 flex-1 max-w-[70%]" />
              <div className="flex items-center gap-1.5 shrink-0">
                <Skeleton className="h-3 w-12" />
                <MessageCircle className="h-3 w-3 text-muted-foreground" />
                <Skeleton className="h-3 w-5" />
              </div>
            </div>
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
