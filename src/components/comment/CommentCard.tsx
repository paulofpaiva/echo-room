import { Link } from "react-router-dom";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import type { Comment } from "@/types/comment";

interface CommentCardProps {
  comment: Comment;
  postId: string;
  replyCounts?: Record<string, number>;
  slug: string;
  returnTo: string;
}

export function CommentCard({
  comment,
  postId,
  replyCounts = {},
  slug,
  returnTo,
}: CommentCardProps) {
  const replyCount = replyCounts[comment.id] ?? 0;
  const commentUrl = `/c/${slug}/post/${postId}/comment/${comment.id}`;

  return (
    <Link
      to={commentUrl}
      state={{ from: returnTo }}
      className="block py-3 border-b border-border/40 last:border-b-0"
    >
      <p className="text-xs text-muted-foreground">
        <FingerprintBadge anonFingerprint={comment.anon_fingerprint} />
      </p>
      <p className="mt-1 text-sm text-foreground leading-snug">{comment.content}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        <span>{new Date(comment.created_at).toLocaleString()}</span>
        <span> · {replyCount} repl{replyCount === 1 ? "y" : "ies"}</span>
      </p>
    </Link>
  );
}
