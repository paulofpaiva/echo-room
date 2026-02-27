import { Link } from "react-router-dom";
import { Skeleton } from "./Skeleton";

interface PostDetailSkeletonProps {
  slug: string;
  returnTo?: string;
}

export function PostDetailSkeleton({ slug, returnTo = `/c/${slug}` }: PostDetailSkeletonProps) {
  return (
    <div className="space-y-6">
      <Link
        to={returnTo}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to /c/{slug}
      </Link>

      <div>
        <Skeleton className="h-4 w-3/4 max-w-xs" />
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-36" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
        <div className="mt-2">
          <Skeleton className="h-3 w-24" />
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-full rounded-lg" />
          <Skeleton className="h-14 w-4/5 rounded-lg" />
        </div>
      </section>
    </div>
  );
}
