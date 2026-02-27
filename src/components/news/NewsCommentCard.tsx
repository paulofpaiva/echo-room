import { Link } from "react-router-dom";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
import type { NewsComment } from "@/types/news-comment";

interface NewsCommentCardProps {
  comment: NewsComment;
  newsId: string;
  replyCount: number;
}

export function NewsCommentCard({
  comment,
  newsId,
  replyCount,
}: NewsCommentCardProps) {
  const commentUrl = `/news/${newsId}/comment/${comment.id}`;

  return (
    <Link
      to={commentUrl}
      className="block py-3 border-b border-border/40 last:border-b-0"
    >
      <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-2">
        <FingerprintBadge
          anonFingerprint={comment.anon_fingerprint}
          countryCode={comment.country_code}
        />
      </p>
      <p className="mt-1 text-sm text-foreground leading-snug">
        {comment.content}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        <span>{new Date(comment.created_at).toLocaleString()}</span>
        <span> · {replyCount} repl{replyCount === 1 ? "y" : "ies"}</span>
      </p>
    </Link>
  );
}
