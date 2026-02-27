import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { usePost } from "@/hooks/usePost";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { useReplyCounts } from "@/hooks/useReplyCounts";
import { CommentList } from "@/components/comment/CommentList";
import { PostDetailSkeleton } from "@/components/skeleton/PostDetailSkeleton";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";

export function PostDetailPage() {
  const { slug, postId } = useParams<{ slug: string; postId: string }>();
  const location = useLocation();
  const returnTo = (location.state as { from?: string } | null)?.from ?? `/c/${slug}`;

  const { data: post, isLoading, isError, error } = usePost(postId);
  const { data: commentCounts = {} } = useCommentCounts(post?.id ? [post.id] : []);
  const { data: replyCounts = {} } = useReplyCounts(post?.id ?? "", !!post);
  const commentCount = post ? (commentCounts[post.id] ?? 0) : 0;

  if (!slug || !postId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <PostDetailSkeleton slug={slug} returnTo={returnTo} />;
  }

  if (isError || !post) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Post not found."}
        </p>
        <Link to={`/c/${slug}`} className="text-primary text-sm underline">
          ← Back to /c/{slug}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to={returnTo}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to /c/{slug}
      </Link>

      <div>
        <h2 className="text-sm font-medium text-foreground">{post.title}</h2>
        <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          <FingerprintBadge anonFingerprint={post.anon_fingerprint} />
          <span>{new Date(post.created_at).toLocaleString()}</span>
        </p>
        <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">
          {post.content}
        </p>
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground" title="Comments">
          <MessageCircle className="h-3 w-3" />
          <span>{commentCount} comment{commentCount !== 1 ? "s" : ""}</span>
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        <CommentList postId={post.id} replyCounts={replyCounts} />
      </section>
    </div>
  );
}
