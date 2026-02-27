import { Link, useParams, Navigate } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Send } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { useNewsReplyCounts } from "@/hooks/useNewsReplyCounts";
import { useCreateNewsComment } from "@/hooks/useCreateNewsComment";
import { NewsCommentList } from "@/components/news/NewsCommentList";
import { useCountryCode } from "@/hooks/useCountryCode";
import { getOrCreateAnonFingerprint } from "@/lib/anon-fingerprint";
import { getCountryCodeForSubmit } from "@/services/geo";
import { createCommentSchema, type CreateCommentFormValues } from "@/schemas/createComment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: news, isLoading, isError, error } = useNews(id, true);
  const { data: replyCounts = {} } = useNewsReplyCounts(news?.id ?? "", !!news);
  const createComment = useCreateNewsComment(news?.id ?? "");
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
    if (!news?.id) return;
    const resolvedCountryCode = countryCode ?? (await getCountryCodeForSubmit());
    try {
      await createComment.mutateAsync({
        newsId: news.id,
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

  if (!id) return <Navigate to="/news" replace />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <div className="animate-pulse space-y-4">
          <div className="aspect-video w-full max-w-2xl rounded-lg bg-muted" />
          <div className="h-8 w-3/4 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (isError || !news) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">
          {error instanceof Error ? error.message : "News not found."}
        </p>
        <BackLink variant="primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <article className="rounded-lg border border-border/60 bg-card overflow-hidden">
        {news.image_url && (
          <div className="aspect-video w-full bg-muted max-h-[360px]">
            <img
              src={news.image_url}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-foreground">
            {news.title}
          </h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {news.source && <span>{news.source}</span>}
            {news.published_at && (
              <span>{new Date(news.published_at).toLocaleString()}</span>
            )}
          </p>
          {news.description && (
            <p className="mt-2 text-sm text-foreground">
              {news.description}
            </p>
          )}
          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            )}
          >
            Read full article
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </article>

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
        <NewsCommentList newsId={news.id} replyCounts={replyCounts} />
      </section>
    </div>
  );
}
