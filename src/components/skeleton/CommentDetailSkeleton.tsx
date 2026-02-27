import { BackLink } from "@/components/navigation/BackLink";
import { Skeleton } from "./Skeleton";

interface CommentDetailSkeletonProps {
  slug: string;
  postId: string;
}

export function CommentDetailSkeleton(_props: CommentDetailSkeletonProps) {
  return (
    <div className="space-y-6">
      <BackLink />

      <div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-2/3" />
        <div className="mt-2 flex gap-2">
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="mt-1">
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <section className="border-t border-border pt-4 mt-2">
        <h2 className="text-lg font-semibold mb-3">Replies</h2>
        <div className="space-y-0">
          <div className="py-3 border-b border-border/40">
            <Skeleton className="h-3 w-14 rounded-full" />
            <Skeleton className="mt-1 h-4 w-full" />
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
          <div className="py-3 border-b border-border/40">
            <Skeleton className="h-3 w-14 rounded-full" />
            <Skeleton className="mt-1 h-4 w-4/5" />
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
        </div>
      </section>
    </div>
  );
}
