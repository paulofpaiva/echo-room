import { useCommentsInfinite } from "@/hooks/useCommentsInfinite";
import { CommentCard } from "./CommentCard";
import { Button } from "@/components/ui/button";

interface CommentListProps {
  postId: string;
  replyCounts?: Record<string, number>;
}

export function CommentList({ postId, replyCounts = {} }: CommentListProps) {
  const {
    comments,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useCommentsInfinite(postId, true);

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading comments…</p>;
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
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          postId={postId}
          replyCounts={replyCounts}
        />
      ))}
      {hasNextPage && (
        <Button
          variant="outline"
          size="sm"
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      )}
    </div>
  );
}
