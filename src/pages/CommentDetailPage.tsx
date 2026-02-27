import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { usePost } from "@/hooks/usePost";
import { useComment } from "@/hooks/useComment";
import { useRepliesInfinite } from "@/hooks/useCommentsInfinite";
import { useReplyCounts } from "@/hooks/useReplyCounts";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { CommentCard } from "@/components/comment/CommentCard";
import { CommentDetailSkeleton } from "@/components/skeleton/CommentDetailSkeleton";
import { Button } from "@/components/ui/button";

export function CommentDetailPage() {
  const { slug, postId, commentId } = useParams<{
    slug: string;
    postId: string;
    commentId: string;
  }>();
  const location = useLocation();
  const returnTo = (location.state as { from?: string } | null)?.from ?? (slug && postId ? `/c/${slug}/post/${postId}` : "/");

  const { data: post, isLoading: postLoading, isError: postError, error: postErrorObj } = usePost(postId);
  const { data: comment, isLoading: commentLoading, isError: commentError, error: commentErrorObj } = useComment(commentId, !!postId);
  const { data: replyCounts = {} } = useReplyCounts(post?.id ?? "", !!post);
  const {
    comments: replies,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useRepliesInfinite(post?.id ?? "", commentId ?? null, !!post && !!commentId);

  const isLoading = postLoading || commentLoading;
  const isError = postError || commentError;
  const error = postErrorObj ?? commentErrorObj;
  const currentCommentUrl = slug && postId && commentId
    ? `/c/${slug}/post/${postId}/comment/${commentId}`
    : "";

  if (!slug || !postId || !commentId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <CommentDetailSkeleton
        slug={slug}
        postId={postId}
        returnTo={returnTo}
      />
    );
  }

  if (isError || !post || !comment) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Comment not found."}
        </p>
        <Link to={returnTo} className="text-primary text-sm underline">
          ← Back to post
        </Link>
      </div>
    );
  }

  const replyCount = replyCounts[comment.id] ?? 0;

  return (
    <div className="space-y-6">
      <Link
        to={returnTo}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to post
      </Link>

      <div>
        <p className="text-xs text-muted-foreground">
          <FingerprintBadge anonFingerprint={comment.anon_fingerprint} />
        </p>
        <p className="mt-2 text-sm text-foreground leading-snug whitespace-pre-wrap">
          {comment.content}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          <span>{new Date(comment.created_at).toLocaleString()}</span>
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground" title="Replies">
          <MessageCircle className="h-3 w-3" />
          <span>{replyCount} repl{replyCount === 1 ? "y" : "ies"}</span>
        </p>
      </div>

      <section className="border-t border-border pt-4 mt-2">
        <h2 className="text-lg font-semibold mb-3">Replies</h2>
        <div className="space-y-0">
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={post.id}
              replyCounts={replyCounts}
              slug={slug}
              returnTo={currentCommentUrl}
            />
          ))}
          {hasNextPage && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? "Loading…" : "Load more"}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
