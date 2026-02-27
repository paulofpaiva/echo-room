import { Link } from "react-router-dom";
import { MessageCircle, TrendingUp } from "lucide-react";
import { useMostCommentedPosts } from "@/hooks/useMostCommentedPosts";
import { HomePostListSkeleton } from "./HomePostListSkeleton";

const LIMIT = 8;

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
        <HomePostListSkeleton variant="list" count={5} />
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <ul className="list-none border rounded-md divide-y divide-border">
          {posts.map((post) => {
            const slug = post.community?.slug ?? "";
            return (
              <li key={post.id}>
                <Link
                  to={`/c/${slug}/post/${post.id}`}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                >
                  <span className="min-w-0 truncate text-foreground">
                    {post.title}
                  </span>
                  <span className="shrink-0 flex items-center gap-1.5">
                    <span className="text-muted-foreground">/c/{slug}</span>
                    <span className="flex items-center gap-1 font-medium text-orange-600 dark:text-orange-400">
                      <MessageCircle className="h-3 w-3" />
                      {commentCounts[post.id] ?? 0}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
