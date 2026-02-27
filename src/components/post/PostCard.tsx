import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import type { Post } from "@/types/post";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { ReportButton } from "@/components/ui/report-button";
import { ShareCopyButton } from "@/components/ui/share-copy-button";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const BUCKET = "post-images";

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

  const postUrl = `/c/${slug}/post/${post.id}`;

  return (
    <article
      className={cn(
        "relative rounded-lg border border-border/60 bg-card px-3 py-2.5 transition-colors hover:border-border hover:bg-muted/30",
        className
      )}
    >
      <Link to={postUrl} className="block">
        <h3 className="text-sm font-medium line-clamp-1 text-foreground">
          {post.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          <FingerprintBadge anonFingerprint={post.anon_fingerprint} countryCode={post.country_code} />
          <span>{new Date(post.created_at).toLocaleString()}</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {post.content}
        </p>
        {post.post_images && post.post_images.length > 0 && (() => {
          const n = post.post_images.length;
          const sizeClass = n === 1 ? "h-28 w-28" : n === 2 ? "h-20 w-20" : "h-14 w-14";
          return (
            <div className="mt-2 flex flex-wrap gap-1">
              {[...post.post_images]
                .sort((a, b) => a.display_order - b.display_order)
                .map((img) => (
                  <img
                    key={img.id}
                    src={supabase.storage.from(BUCKET).getPublicUrl(img.storage_path).data.publicUrl}
                    alt=""
                    className={cn(sizeClass, "shrink-0 rounded object-cover border border-border/60")}
                  />
                ))}
            </div>
          );
        })()}
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
      </Link>
      <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
        <ShareCopyButton path={postUrl} />
        <ReportButton targetType="post" targetId={post.id} />
      </div>
    </article>
  );
}
