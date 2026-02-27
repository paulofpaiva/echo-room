import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { usePost } from "@/hooks/usePost";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { useReplyCounts } from "@/hooks/useReplyCounts";
import { CommentList } from "@/components/comment/CommentList";
import { PostDetailSkeleton } from "@/components/skeleton/PostDetailSkeleton";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const BUCKET = "post-images";

export function PostDetailPage() {
  const { slug, postId } = useParams<{ slug: string; postId: string }>();
  const location = useLocation();
  const returnTo = (location.state as { from?: string } | null)?.from ?? `/c/${slug}`;
  const postPageUrl = `/c/${slug}/post/${postId}`;

  const { data: post, isLoading, isError, error } = usePost(postId);
  const { data: commentCounts = {}, isLoading: isCommentCountsLoading } = useCommentCounts(post?.id ? [post.id] : []);
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
        {post.post_images && post.post_images.length > 0 && (() => {
          const n = post.post_images.length;
          const sizeClass = n === 1 ? "h-72 w-72 max-w-full" : n === 2 ? "h-56 w-56" : "h-40 w-40";
          return (
            <div className="mt-3 flex flex-wrap gap-2">
              {[...post.post_images]
                .sort((a, b) => a.display_order - b.display_order)
                .map((img) => (
                  <img
                    key={img.id}
                    src={supabase.storage.from(BUCKET).getPublicUrl(img.storage_path).data.publicUrl}
                    alt=""
                    className={cn(sizeClass, "shrink-0 rounded-lg object-cover border border-border")}
                  />
                ))}
            </div>
          );
        })()}
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground" title="Comments">
          <MessageCircle className="h-3 w-3" />
          {isCommentCountsLoading ? (
            <Skeleton className="h-3 w-5 inline-block" />
          ) : (
            <span>{commentCount}</span>
          )}
        </p>
      </div>

      <section className="border-t border-border pt-4 mt-2">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        <CommentList postId={post.id} slug={slug} returnTo={postPageUrl} replyCounts={replyCounts} />
      </section>
    </div>
  );
}
