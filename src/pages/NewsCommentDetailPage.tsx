import { useParams, Navigate } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send } from "lucide-react";
import { useNewsComment } from "@/hooks/useNewsComment";
import { useNewsRepliesInfinite } from "@/hooks/useNewsCommentsInfinite";
import { useNewsReplyCounts } from "@/hooks/useNewsReplyCounts";
import { useCreateNewsComment } from "@/hooks/useCreateNewsComment";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { NewsCommentCard } from "@/components/news/NewsCommentCard";
import { Button } from "@/components/ui/button";
import { useCountryCode } from "@/hooks/useCountryCode";
import { getOrCreateAnonFingerprint } from "@/lib/anon-fingerprint";
import { getCountryCodeForSubmit } from "@/services/geo";
import { createCommentSchema, type CreateCommentFormValues } from "@/schemas/createComment";

export function NewsCommentDetailPage() {
  const { newsId, commentId } = useParams<{ newsId: string; commentId: string }>();

  const { data: comment, isLoading: commentLoading, isError: commentError, error: commentErrorObj } = useNewsComment(commentId, !!commentId);
  const { data: replyCounts = {} } = useNewsReplyCounts(newsId ?? "", !!newsId);
  const {
    comments: replies,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNewsRepliesInfinite(newsId ?? "", commentId ?? null, !!newsId && !!commentId);

  const createReply = useCreateNewsComment(newsId ?? "");
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
    if (!newsId || !comment?.id) return;
    const resolvedCountryCode = countryCode ?? (await getCountryCodeForSubmit());
    try {
      await createReply.mutateAsync({
        newsId,
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

  const isLoading = commentLoading;
  const isError = commentError;
  const error = commentErrorObj;

  if (!newsId || !commentId) return <Navigate to="/news" replace />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="animate-pulse space-y-2">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (isError || !comment) {
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
          <FingerprintBadge
            anonFingerprint={comment.anon_fingerprint}
            countryCode={comment.country_code}
          />
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
              className="flex-1 min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-base md:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
        </form>
        <div className="space-y-0">
          {replies.length === 0 ? (
            <p className="text-muted-foreground text-sm">No replies yet.</p>
          ) : (
            <>
              {replies.map((reply) => (
                <NewsCommentCard
                  key={reply.id}
                  comment={reply}
                  newsId={newsId}
                  replyCount={replyCounts[reply.id] ?? 0}
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
