import { Link } from "react-router-dom";
import type { News } from "@/types/news";
import { cn } from "@/lib/utils";

interface NewsCardCompactProps {
  news: News;
  className?: string;
}

export function NewsCardCompact({ news, className }: NewsCardCompactProps) {
  return (
    <Link
      to={`/news/${news.id}`}
      state={{ from: "/" }}
      className={cn(
        "block flex-[0_0_85%] sm:flex-[0_0_70%] md:flex-[0_0_45%] min-w-0 rounded-lg border border-border/60 bg-card overflow-hidden transition-colors hover:border-border hover:bg-muted/30",
        className
      )}
    >
      {news.image_url ? (
        <div className="aspect-video w-full bg-muted">
          <img
            src={news.image_url}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-muted" />
      )}
      <div className="p-2">
        <h3 className="text-sm font-medium line-clamp-2 text-foreground">
          {news.title}
        </h3>
      </div>
    </Link>
  );
}
