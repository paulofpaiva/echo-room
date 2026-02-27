import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, MessageCircle, Send } from "lucide-react";
import { useNews } from "@/hooks/useNews";
import { useNewsReplyCounts } from "@/hooks/useNewsReplyCounts";
import { useCreateNewsComment } from "@/hooks/useCreateNewsComment";
import { NewsCommentList } from "@/components/news/NewsCommentList";
import { useCountryCode } from "@/hooks/useCountryCode";
import { getOrCreateAnonFingerprint } from "@/lib/anon-fingerprint";
import { createCommentSchema, type CreateCommentFormValues } from "@/schemas/createComment";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const returnTo = (location.state as { from?: string } | null)?.from ?? "/news";

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

  const onSubmitComment = (data: CreateCommentFormValues) => {
    if (!news?.id) return;
    createComment
      .mutateAsync({
        newsId: news.id,
        parentId: null,
        content: data.content,
        anonFingerprint: getOrCreateAnonFingerprint() || null,
        countryCode: countryCode ?? null,
      })
      .then(() => reset())
      .catch(() => {});
  };

  if (!id) return <Navigate to="/news" replace />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link to={returnTo} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to news
        </Link>
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
        <Link to="/news" className="text-primary text-sm underline">
          ← Back to news
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
        ← Back to news
      </Link>

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

      <section>
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <MessageCircle className="h-5 w-5" />
          Comments
        </h2>
        <form onSubmit={rhfHandleSubmit(onSubmitComment)} className="flex gap-2 mb-4">
          <textarea
            {...register("content")}
            placeholder="Write a comment..."
            className="flex-1 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Button type="submit" size="icon" disabled={createComment.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {errors.content && (
          <p className="text-sm text-destructive mb-2">{errors.content.message}</p>
        )}
        <NewsCommentList
          newsId={news.id}
          returnTo={returnTo}
          replyCounts={replyCounts}
        />
      </section>
    </div>
  );
}
