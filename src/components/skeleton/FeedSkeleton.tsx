import { Link } from "react-router-dom";
import { Skeleton } from "./Skeleton";

const PLACEHOLDER_POSTS = 4;

interface FeedSkeletonProps {
  communitySlug: string;
  returnTo?: string;
  backLabel?: string;
}

export function FeedSkeleton({
  communitySlug,
  returnTo = "/",
  backLabel = "Back to home",
}: FeedSkeletonProps) {
  return (
    <div className="space-y-6">
      <Link
        to={returnTo}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← {backLabel}
      </Link>
      <h1 className="text-2xl font-semibold">/c/{communitySlug}</h1>
      <div className="space-y-4">
        {Array.from({ length: PLACEHOLDER_POSTS }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-border/60 bg-card px-3 py-2.5"
          >
            <Skeleton className="h-4 w-3/4 max-w-xs" />
            <Skeleton className="mt-1 h-3 w-full" />
            <Skeleton className="mt-0.5 h-3 w-2/3" />
            <div className="mt-2">
              <Skeleton className="h-3 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
