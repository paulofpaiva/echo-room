import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useLatestPosts } from "@/hooks/useLatestPosts";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { LatestPostListItem } from "./LatestPostListItem";
import { HomePostListSkeleton } from "./HomePostListSkeleton";

const LIMIT = 10;

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
            Recent posts
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
          Recent posts
        </h2>
        <Link
          to="/search"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View more
        </Link>
      </div>
      {isLoading ? (
        <HomePostListSkeleton variant="column" count={10} />
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <ul className="list-none columns-2 gap-x-4 gap-y-0.5">
          {posts.map((post) => (
            <LatestPostListItem
              key={post.id}
              post={post}
              commentCount={commentCounts[post.id] ?? 0}
              variant="column"
            />
          ))}
        </ul>
      )}
    </div>
  );
}
