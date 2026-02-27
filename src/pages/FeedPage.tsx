import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { usePosts } from "@/hooks/usePosts";
import { useCommunities } from "@/hooks/useCommunities";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";

const DEFAULT_COMMUNITY = "general";

export function FeedPage() {
  const { slug } = useParams<{ slug: string }>();
  const communitySlug = slug ?? DEFAULT_COMMUNITY;
  const [page, setPage] = useState(1);

  const { data: communitiesData } = useCommunities();
  const { data, isLoading, isError, error } = usePosts(communitySlug, page);

  if (!slug) {
    return <Navigate to={`/c/${DEFAULT_COMMUNITY}`} replace />;
  }

  const communityExists =
    communitiesData?.some((c) => c.slug === communitySlug) ?? false;
  if (communitiesData && !communityExists && slug !== DEFAULT_COMMUNITY) {
    return <Navigate to={`/c/${DEFAULT_COMMUNITY}`} replace />;
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

  return (
    <div className="space-y-6">
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
