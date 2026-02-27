import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { useCommunities } from "@/hooks/useCommunities";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";

export function FeedPage() {
  const { slug } = useParams<{ slug: string }>();
  const communitySlug = slug ?? "";
  const [page, setPage] = useState(1);

  const { data: communitiesData } = useCommunities();
  const { data, isLoading, isError, error } = usePosts(communitySlug, page);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const communityExists =
    communitiesData?.some((c) => c.slug === communitySlug) ?? false;
  if (communitiesData && !communityExists) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Feed</h1>
        <p className="text-muted-foreground">Loading posts…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Feed</h1>
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Failed to load posts."}
        </p>
      </div>
    );
  }

  const { posts, hasMore } = data ?? { posts: [], hasMore: false };
  const postIds = posts.map((p) => p.id);
  const { data: commentCounts = {} } = useCommentCounts(postIds);

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to communities
      </Link>
      <h1 className="text-2xl font-semibold">/c/{communitySlug}</h1>
      <div className="space-y-3">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              communitySlug={communitySlug}
              commentCount={commentCounts[post.id] ?? 0}
            />
          ))
        )}
      </div>
      <div className="flex gap-2">
        {page > 1 && (
          <Button variant="outline" onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
        )}
        {hasMore && (
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
