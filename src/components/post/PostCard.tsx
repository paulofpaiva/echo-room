import { Link } from "react-router-dom";
import type { Post } from "@/types/post";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  communitySlug: string;
  commentCount?: number;
  className?: string;
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
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
            <CommentIcon className="h-3 w-3" />
            <span>{commentCount}</span>
          </span>
        </div>
      </article>
    </Link>
  );
}
