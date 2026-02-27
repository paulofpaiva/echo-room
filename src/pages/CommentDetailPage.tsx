import { Link, useParams, Navigate } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send } from "lucide-react";
import { usePost } from "@/hooks/usePost";
import { useComment } from "@/hooks/useComment";
import { useRepliesInfinite } from "@/hooks/useCommentsInfinite";
import { useReplyCounts } from "@/hooks/useReplyCounts";
import { useCreateComment } from "@/hooks/useCreateComment";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { CommentCard } from "@/components/comment/CommentCard";
import { CommentDetailSkeleton } from "@/components/skeleton/CommentDetailSkeleton";
import { Button } from "@/components/ui/button";
import { useCountryCode } from "@/hooks/useCountryCode";
import { getOrCreateAnonFingerprint } from "@/lib/anon-fingerprint";
import { getCountryCodeForSubmit } from "@/services/geo";
import { createCommentSchema, type CreateCommentFormValues } from "@/schemas/createComment";
import { cn } from "@/lib/utils";

export function CommentDetailPage() {
  const { slug, postId, commentId } = useParams<{
    slug: string;
    postId: string;
    commentId: string;
  }>();
  const { data: post, isLoading: postLoading, isError: postError, error: postErrorObj } = usePost(postId);
  const { data: comment, isLoading: commentLoading, isError: commentError, error: commentErrorObj } = useComment(commentId, !!postId);
  const { data: replyCounts = {} } = useReplyCounts(post?.id ?? "", !!post);
  const {
    comments: replies,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useRepliesInfinite(post?.id ?? "", commentId ?? null, !!post && !!commentId);

  const createReply = useCreateComment(post?.id ?? "");
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

  const onSubmitReply = async (data: CreateCommentFormValues) => {
    if (!post?.id || !comment?.id) return;
    const resolvedCountryCode = countryCode ?? (await getCountryCodeForSubmit());
    try {
      await createReply.mutateAsync({
        postId: post.id,
        parentId: comment.id,
        content: data.content,
        anonFingerprint: getOrCreateAnonFingerprint() || null,
        countryCode: resolvedCountryCode,
      });
      reset();
    } catch {
      // mutation error handled by hook
    }
  };

  const isLoading = postLoading || commentLoading;
  const isError = postError || commentError;
  const error = postErrorObj ?? commentErrorObj;
  if (!slug || !postId || !commentId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <CommentDetailSkeleton slug={slug} postId={postId} />;
  }

  if (isError || !post || !comment) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Comment not found."}
        </p>
        <BackLink variant="primary" />
      </div>
    );
  }

  const replyCount = replyCounts[comment.id] ?? 0;

  return (
    <div className="space-y-6">
      <BackLink />

      <div>
        <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          <FingerprintBadge anonFingerprint={comment.anon_fingerprint} countryCode={comment.country_code} />
          {post.anon_fingerprint != null &&
            comment.anon_fingerprint != null &&
            post.anon_fingerprint === comment.anon_fingerprint && (
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                  "bg-primary/15 text-primary"
                )}
              >
                Author
              </span>
            )}
        </p>
        <p className="mt-2 text-sm text-foreground leading-snug whitespace-pre-wrap">
          {comment.content}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          <span>{new Date(comment.created_at).toLocaleString()}</span>
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground" title="Replies">
          <MessageCircle className="h-3 w-3" />
          <span>{replyCount}</span>
        </p>
      </div>

      <section className="border-t border-border pt-4 mt-2">
        <h2 className="text-lg font-semibold mb-3">Replies</h2>
        <form onSubmit={rhfHandleSubmit(onSubmitReply)} className="mb-4 space-y-2">
          <div className="flex gap-2 items-center">
            <textarea
              {...register("content")}
              rows={3}
              placeholder="Write a reply..."
              className={cn(
                "flex-1 min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                errors.content && "border-destructive focus-visible:ring-destructive"
              )}
            />
            <Button
              type="submit"
              disabled={createReply.isPending}
              size="icon"
              className="shrink-0 rounded-full"
              aria-label="Post reply"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
          {createReply.isError && (
            <p className="text-sm text-destructive">
              {createReply.error instanceof Error
                ? createReply.error.message
                : "Failed to post reply"}
            </p>
          )}
        </form>
        <div className="space-y-0">
          {replies.length === 0 ? (
            <p className="text-muted-foreground text-sm">No replies yet.</p>
          ) : (
            <>
              {replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  postId={post.id}
                  replyCounts={replyCounts}
                  slug={slug}
                  postAuthorFingerprint={post.anon_fingerprint}
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
            </>
          )}
        </div>
      </section>
    </div>
  );
}
