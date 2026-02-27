import { useNewsCommentsInfinite } from "@/hooks/useNewsCommentsInfinite";
import { useNewsReplyCounts } from "@/hooks/useNewsReplyCounts";
import { NewsCommentCard } from "./NewsCommentCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/skeleton/Skeleton";

interface NewsCommentListProps {
  newsId: string;
  returnTo: string;
  replyCounts?: Record<string, number>;
}

export function NewsCommentList({
  newsId,
  returnTo,
  replyCounts = {},
}: NewsCommentListProps) {
  const {
    comments,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNewsCommentsInfinite(newsId, true);

  if (isLoading) {
    return (
      <div className="space-y-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="py-3 border-b border-border/40">
            <Skeleton className="h-3 w-16 rounded-full" />
            <Skeleton className="mt-1 h-4 w-full" />
            <Skeleton className="mt-1 h-3 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">
        {error instanceof Error ? error.message : "Failed to load comments."}
      </p>
    );
  }

  if (comments.length === 0) {
    return <p className="text-muted-foreground text-sm">No comments yet.</p>;
  }

  return (
    <div className="space-y-0">
      {comments.map((comment) => (
        <NewsCommentCard
          key={comment.id}
          comment={comment}
          newsId={newsId}
          replyCount={replyCounts[comment.id] ?? 0}
          returnTo={returnTo}
        />
      ))}
      {hasNextPage && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}
