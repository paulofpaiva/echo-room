import { MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/skeleton/Skeleton";

interface HomePostListSkeletonProps {
  count?: number;
  horizontal?: boolean;
}

export function HomePostListSkeleton({
  count = 3,
  horizontal = false,
}: HomePostListSkeletonProps) {
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
