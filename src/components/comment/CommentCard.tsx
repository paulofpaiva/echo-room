import { Link } from "react-router-dom";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import { ShareCopyButton } from "@/components/ui/share-copy-button";
import type { Comment } from "@/types/comment";
import { cn } from "@/lib/utils";

interface CommentCardProps {
  comment: Comment;
  postId: string;
  replyCounts?: Record<string, number>;
  slug: string;
  postAuthorFingerprint?: string | null;
}

export function CommentCard({
  comment,
  postId,
  replyCounts = {},
  slug,
  postAuthorFingerprint,
}: CommentCardProps) {
  const replyCount = replyCounts[comment.id] ?? 0;
  const commentUrl = `/c/${slug}/post/${postId}/comment/${comment.id}`;
  const isPostAuthor =
    postAuthorFingerprint != null &&
    comment.anon_fingerprint != null &&
    postAuthorFingerprint === comment.anon_fingerprint;

  return (
    <div className="relative py-3 border-b border-border/40 last:border-b-0">
      <Link to={commentUrl} className="block pr-8">
        <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
          <FingerprintBadge anonFingerprint={comment.anon_fingerprint} countryCode={comment.country_code} />
          {isPostAuthor && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                "bg-primary/15 text-primary"
              )}
            >
              Author
            </span>
          )}
        </p>
        <p className="mt-1 text-sm text-foreground leading-snug">{comment.content}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span>{new Date(comment.created_at).toLocaleString()}</span>
          <span> · {replyCount} repl{replyCount === 1 ? "y" : "ies"}</span>
        </p>
      </Link>
      <ShareCopyButton path={commentUrl} className="absolute top-3 right-0" />
    </div>
  );
}
