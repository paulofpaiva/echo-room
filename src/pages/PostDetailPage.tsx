import { useParams, Navigate } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send } from "lucide-react";
import { ReportButton } from "@/components/ui/report-button";
import { ShareCopyButton } from "@/components/ui/share-copy-button";
import { usePost } from "@/hooks/usePost";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { useReplyCounts } from "@/hooks/useReplyCounts";
import { useCreateComment } from "@/hooks/useCreateComment";
import { CommentList } from "@/components/comment/CommentList";
import { PostDetailSkeleton } from "@/components/skeleton/PostDetailSkeleton";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useCountryCode } from "@/hooks/useCountryCode";
import { getOrCreateAnonFingerprint } from "@/lib/anon-fingerprint";
import { getCountryCodeForSubmit } from "@/services/geo";
import { createCommentSchema, type CreateCommentFormValues } from "@/schemas/createComment";
import { cn } from "@/lib/utils";

const BUCKET = "post-images";

export function PostDetailPage() {
  const { slug, postId } = useParams<{ slug: string; postId: string }>();
  const postUrl = slug && postId ? `/c/${slug}/post/${postId}` : "";

  const { data: post, isLoading, isError, error } = usePost(postId);
  const { data: commentCounts = {}, isLoading: isCommentCountsLoading } = useCommentCounts(post?.id ? [post.id] : []);
  const { data: replyCounts = {} } = useReplyCounts(post?.id ?? "", !!post);
  const commentCount = post ? (commentCounts[post.id] ?? 0) : 0;
  const createComment = useCreateComment(post?.id ?? "");
  const { countryCode } = useCountryCode();

  const {
    register,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCommentFormValues>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
  });

  const onSubmitComment = async (data: CreateCommentFormValues) => {
    if (!post?.id) return;
    const resolvedCountryCode = countryCode ?? (await getCountryCodeForSubmit());
    try {
      await createComment.mutateAsync({
        postId: post.id,
        parentId: null,
        content: data.content,
        anonFingerprint: getOrCreateAnonFingerprint() || null,
        countryCode: resolvedCountryCode,
      });
      reset();
    } catch {
      // mutation error handled by hook
    }
  };

  if (!slug || !postId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <PostDetailSkeleton slug={slug} />;
  }

  if (isError || !post) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Post not found."}
        </p>
        <BackLink variant="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <div>
        <h1 className="text-2xl font-semibold text-foreground">{post.title}</h1>
        <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          <FingerprintBadge anonFingerprint={post.anon_fingerprint} countryCode={post.country_code} />
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
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1" title="Comments">
            <MessageCircle className="h-3 w-3" />
            {isCommentCountsLoading ? (
              <Skeleton className="h-3 w-5 inline-block" />
            ) : (
              <span>{commentCount}</span>
            )}
          </span>
          {postUrl && (
            <span className="flex items-center gap-1">
              <ShareCopyButton path={postUrl} />
              <ReportButton targetType="post" targetId={post.id} />
            </span>
          )}
        </p>
      </div>

      <section className="border-t border-border pt-4 mt-2">
        <h2 className="text-lg font-semibold mb-3">Comments</h2>
        <form onSubmit={rhfHandleSubmit(onSubmitComment)} className="mb-4 space-y-2">
          <div className="flex gap-2 items-center">
            <textarea
              {...register("content")}
              rows={3}
              placeholder="Write a comment..."
              className={cn(
                "flex-1 min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base md:text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                errors.content && "border-destructive focus-visible:ring-destructive"
              )}
            />
            <Button
              type="submit"
              disabled={createComment.isPending}
              size="icon"
              className="shrink-0 rounded-full"
              aria-label="Post comment"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
          {createComment.isError && (
            <p className="text-sm text-destructive">
              {createComment.error instanceof Error
                ? createComment.error.message
                : "Failed to post comment"}
            </p>
          )}
        </form>
        <CommentList postId={post.id} slug={slug} replyCounts={replyCounts} postAuthorFingerprint={post.anon_fingerprint} />
      </section>
    </div>
  );
}
