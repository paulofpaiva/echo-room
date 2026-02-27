import { useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useComments } from "@/hooks/useComments";
import type { Comment } from "@/types/comment";
import { cn } from "@/lib/utils";

interface CommentCardProps {
  comment: Comment;
  postId: string;
  depth?: number;
}

export function CommentCard({ comment, postId, depth = 0 }: CommentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [repliesPage, setRepliesPage] = useState(1);

  const { data, isLoading, isFetching } = useComments(
    postId,
    comment.id,
    repliesPage,
    expanded
  );

  const replies = data?.comments ?? [];
  const hasMore = data?.hasMore ?? false;

  return (
    <div className={cn("flex flex-col gap-2", depth > 0 && "ml-4 border-l-2 border-muted pl-3")}>
      <Card
        className={cn(
          "cursor-pointer transition-colors hover:bg-muted/50",
          expanded && "ring-1 ring-primary/20"
        )}
        onClick={() => setExpanded((e) => !e)}
      >
        <CardHeader className="py-3 px-4">
          <p className="text-sm font-medium leading-snug">{comment.content}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleString()} · ↑ {comment.upvotes} ↓ {comment.downvotes}
            {expanded ? " · Click to collapse" : " · Click to see replies"}
          </p>
        </CardHeader>
      </Card>

      {expanded && (
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-xs text-muted-foreground pl-2">Loading replies…</p>
          ) : (
            <>
              {replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  depth={depth + 1}
                />
              ))}
              {hasMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                  disabled={isFetching}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRepliesPage((p) => p + 1);
                  }}
                >
                  {isFetching ? "Loading…" : "More replies"}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
