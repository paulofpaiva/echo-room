import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Post } from "@/types/post";
import { FingerprintBadge } from "@/components/ui/fingerprint-badge";
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
      <Card
        className={cn(
          "transition-colors hover:bg-muted/50 cursor-pointer",
          className
        )}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg line-clamp-1">{post.title}</CardTitle>
          <CardDescription className="text-xs flex flex-wrap items-center gap-2">
            <FingerprintBadge anonFingerprint={post.anon_fingerprint} />
            <span>
              {new Date(post.created_at).toLocaleString()} · ↑ {post.upvotes} ↓{" "}
              {post.downvotes} · {commentCount} comment{commentCount !== 1 ? "s" : ""}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.content}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
