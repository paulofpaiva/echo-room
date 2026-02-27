import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { PostCardCompact } from "@/components/post/PostCardCompact";
import { useLatestPosts } from "@/hooks/useLatestPosts";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { HomePostListSkeleton } from "./HomePostListSkeleton";

const LIMIT = 3;

export function LatestPostsSection() {
  const { data: posts = [], isLoading, isError, error } = useLatestPosts(LIMIT);
  const postIds = posts.map((p) => p.id);
  const { data: commentCounts = {} } = useCommentCounts(postIds);

  if (isError) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-primary shrink-0" aria-hidden />
            Latest posts
          </h2>
          <Link
            to="/search"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View more
          </Link>
        </div>
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load posts."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold flex items-center gap-1.5">
          <Sparkles className="h-5 w-5 text-primary shrink-0" aria-hidden />
          Latest posts
        </h2>
        <Link
          to="/search"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View more
        </Link>
      </div>
      {isLoading ? (
        <HomePostListSkeleton count={2} horizontal />
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <ul className="grid grid-cols-12 gap-2 items-stretch grid-rows-1">
          {posts.map((post) => (
            <li key={post.id} className="flex min-h-0 min-w-0 col-span-12 sm:col-span-4">
              <PostCardCompact
                post={post}
                communitySlug={post.community?.slug ?? ""}
                commentCount={commentCounts[post.id] ?? 0}
                showNewIcon
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
