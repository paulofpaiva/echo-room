import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import type { News } from "@/types/news";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  news: News;
  commentCount?: number;
  commentCountLoading?: boolean;
  returnTo?: string;
  className?: string;
}

export function NewsCard({
  news,
  commentCount = 0,
  commentCountLoading = false,
  returnTo = "/news",
  className,
}: NewsCardProps) {
  return (
    <Link
      to={`/news/${news.id}`}
      state={{ from: returnTo }}
      className={cn(
        "block rounded-lg border border-border/60 bg-card overflow-hidden transition-colors hover:border-border hover:bg-muted/30",
        className
      )}
    >
      {news.image_url && (
        <div className="aspect-video w-full bg-muted">
          <img
            src={news.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="p-3">
        <h3 className="text-sm font-medium line-clamp-2 text-foreground">
          {news.title}
        </h3>
        {news.source && (
          <p className="mt-1 text-xs text-muted-foreground">{news.source}</p>
        )}
        <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          {news.published_at && (
            <span>{new Date(news.published_at).toLocaleString()}</span>
          )}
          <span className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {commentCountLoading ? (
              <Skeleton className="h-3 w-5 inline-block" />
            ) : (
              <span>{commentCount}</span>
            )}
          </span>
        </p>
      </div>
    </Link>
  );
}
