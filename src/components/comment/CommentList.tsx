import { useState } from "react";
import { useComments } from "@/hooks/useComments";
import { CommentCard } from "./CommentCard";
import { Button } from "@/components/ui/button";

interface CommentListProps {
  postId: string;
}

export function CommentList({ postId }: CommentListProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isFetching } = useComments(
    postId,
    null,
    page,
    true
  );

  const comments = data?.comments ?? [];
  const hasMore = data?.hasMore ?? false;

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
        <CommentCard key={comment.id} comment={comment} postId={postId} />
      ))}
      <div className="flex gap-2">
        {page > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
        )}
        {hasMore && (
          <Button
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={() => setPage((p) => p + 1)}
          >
            {isFetching ? "Loading…" : "Next"}
          </Button>
        )}
      </div>
    </div>
  );
}
