import { Link } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import { useLatestPosts } from "@/hooks/useLatestPosts";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { HomePostListSkeleton } from "./HomePostListSkeleton";

const LIMIT = 8;

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
                  <span className="shrink-0 flex items-center gap-1.5 text-muted-foreground">
                    <span>/c/{slug}</span>
                    <span className="flex items-center gap-1">
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
