import { Link, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import type { Post } from "@/types/post";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  communitySlug: string;
  commentCount?: number;
  commentCountLoading?: boolean;
  className?: string;
}

export function PostCard({
  post,
  communitySlug,
  commentCount = 0,
  commentCountLoading = false,
  className,
}: PostCardProps) {
  const slug = post.community?.slug ?? communitySlug;
  const location = useLocation();
  const returnTo = location.pathname + location.search;

  return (
    <Link to={`/c/${slug}/post/${post.id}`} state={{ from: returnTo }}>
      <article
        className={cn(
          "rounded-lg border border-border/60 bg-card px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/30",
          className
        )}
      >
        <h3 className="text-sm font-medium line-clamp-1 text-foreground">
          {post.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          <FingerprintBadge anonFingerprint={post.anon_fingerprint} />
          <span>{new Date(post.created_at).toLocaleString()}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {post.content}
        </p>
        <div className="mt-2 flex items-center text-muted-foreground">
          <span className="flex items-center gap-1 text-xs" title="Comments">
            <MessageCircle className="h-3 w-3" />
            {commentCountLoading ? (
              <Skeleton className="h-3 w-5 inline-block" />
            ) : (
              <span>{commentCount}</span>
            )}
          </span>
        </div>
      </article>
    </Link>
  );
}
