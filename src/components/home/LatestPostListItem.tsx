import { Link } from "react-router-dom";
import { ChevronRight, FileText, MessageCircle, MessageSquare } from "lucide-react";
import type { Post } from "@/types/post";
import { cn } from "@/lib/utils";

const PREVIEW_LENGTH = 55;

function stripMarkdownPreview(text: string, maxLen: number): string {
  const stripped = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/>\s+/g, "")
    .replace(/\n+/g, " ")
    .trim();
  if (stripped.length <= maxLen) return stripped;
  return stripped.slice(0, maxLen).trim() + "...";
}

interface LatestPostListItemProps {
  post: Post;
  commentCount: number;
  /** "post" = FileText (default), "comment" = MessageSquare for most-commented */
  iconVariant?: "post" | "comment";
  className?: string;
}

export function LatestPostListItem({
  post,
  commentCount,
  iconVariant = "post",
  className,
}: LatestPostListItemProps) {
  const slug = post.community?.slug ?? "";
  const postUrl = `/c/${slug}/post/${post.id}`;
  const dateStr = new Date(post.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const preview = post.content
    ? stripMarkdownPreview(post.content, PREVIEW_LENGTH)
    : "";

  return (
    <li>
      <Link
        to={postUrl}
        className={cn(
          "flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent transition-colors",
          className
        )}
      >
        <div className="flex-shrink-0">
          <span className="relative flex shrink-0 overflow-hidden rounded-full h-7 w-7">
            <span className="h-full w-full rounded-full bg-muted text-muted-foreground flex items-center justify-center">
              {iconVariant === "comment" ? (
                <MessageSquare className="h-3.5 w-3.5" aria-hidden />
              ) : (
                <FileText className="h-3.5 w-3.5" aria-hidden />
              )}
            </span>
          </span>
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium leading-none truncate">
              {post.title}
            </span>
            <span className="inline-flex items-center rounded-full border font-semibold transition-colors bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-px shrink-0">
              /c/{slug}
            </span>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-x-1.5 min-w-0">
            <span className="shrink-0">{dateStr}</span>
            {preview && (
              <>
                <span className="text-muted-foreground/60 shrink-0" aria-hidden>
                  •
                </span>
                <span className="truncate min-w-0">{preview}</span>
              </>
            )}
            <span className="flex items-center gap-0.5 shrink-0">
              <MessageCircle className="h-2.5 w-2.5" />
              {commentCount}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full hover:bg-accent hover:text-accent-foreground">
            <ChevronRight className="h-3 w-3" aria-hidden />
          </span>
        </div>
      </Link>
    </li>
  );
}
