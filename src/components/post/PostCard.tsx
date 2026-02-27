import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import type { Post } from "@/types/post";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  communitySlug: string;
  commentCount?: number;
  className?: string;
}

export function PostCard({
  post,
  communitySlug,
  commentCount = 0,
  className,
}: PostCardProps) {
  const slug = post.community?.slug ?? communitySlug;

  return (
    <Link to={`/c/${slug}/post/${post.id}`}>
      <article
        className={cn(
          "rounded-lg border border-border/60 bg-card px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/30",
          className
        )}
      >
        <h3 className="text-sm font-medium line-clamp-1 text-foreground">
          {post.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {post.content}
        </p>
        <div className="mt-2 flex items-center text-muted-foreground">
          <span className="flex items-center gap-1 text-xs" title="Comments">
            <MessageCircle className="h-3 w-3" />
            <span>{commentCount}</span>
          </span>
        </div>
      </article>
    </Link>
  );
}
