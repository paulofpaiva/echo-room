import { Link } from "react-router-dom";
import { MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import type { Post } from "@/types/post";
import { ReportButton } from "@/components/ui/report-button";
import { ShareCopyButton } from "@/components/ui/share-copy-button";
import { cn } from "@/lib/utils";

interface PostCardCompactProps {
  post: Post;
  communitySlug: string;
  commentCount: number;
  showNewIcon?: boolean;
  showHotIcon?: boolean;
  className?: string;
}

export function PostCardCompact({
  post,
  communitySlug,
  commentCount,
  showNewIcon = false,
  showHotIcon = false,
  className,
}: PostCardCompactProps) {
  const slug = post.community?.slug ?? communitySlug;
  const postUrl = `/c/${slug}/post/${post.id}`;

  return (
    <div
      className={cn(
        "relative flex min-h-0 w-full min-w-0 flex-1 flex-col rounded-lg border border-border/60 bg-card px-3 py-2 transition-colors hover:border-border hover:bg-muted/30",
        className
      )}
    >
      <Link to={postUrl} className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-start gap-1.5">
          {showNewIcon && (
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-green-500 mt-0.5" aria-label="New" />
          )}
          {showHotIcon && (
            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-orange-500 mt-0.5" aria-label="Hot" />
          )}
          <h3 className="text-sm font-medium line-clamp-2 text-foreground flex-1 min-w-0">
            {post.title}
          </h3>
        </div>
        <div className="mt-auto pt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{new Date(post.created_at).toLocaleString()}</span>
          <span className="flex items-center gap-1 shrink-0">
            <MessageCircle className="h-3 w-3" />
            {commentCount}
          </span>
        </div>
      </Link>
      <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5">
        <ShareCopyButton path={postUrl} />
        <ReportButton targetType="post" targetId={post.id} />
      </div>
    </div>
  );
}
