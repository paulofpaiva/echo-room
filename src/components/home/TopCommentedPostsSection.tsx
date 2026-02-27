import { TrendingUp } from "lucide-react";
import { useMostCommentedPosts } from "@/hooks/useMostCommentedPosts";
import { LatestPostListItem } from "./LatestPostListItem";
import { HomePostListSkeleton } from "./HomePostListSkeleton";

const LIMIT = 10;

export function TopCommentedPostsSection() {
  const { data, isLoading, isError, error } = useMostCommentedPosts(LIMIT);
  const posts = data?.posts ?? [];
  const commentCounts = data?.commentCounts ?? {};

  if (isError) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-1.5">
          <TrendingUp className="h-5 w-5 text-primary shrink-0" aria-hidden />
          Most commented
        </h2>
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load posts."}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-1.5">
        <TrendingUp className="h-5 w-5 text-primary shrink-0" aria-hidden />
        Most commented
      </h2>
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
              iconVariant="comment"
              variant="column"
            />
          ))}
        </ul>
      )}
    </div>
  );
}
