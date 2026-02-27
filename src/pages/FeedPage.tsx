import { useEffect } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import { usePostsFeed } from "@/hooks/usePostsFeed";
import { useCommunities } from "@/hooks/useCommunities";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { PostCard } from "@/components/post/PostCard";
import { FeedSkeleton } from "@/components/skeleton/FeedSkeleton";
import { Button } from "@/components/ui/button";

export function FeedPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = Math.max(1, Number(searchParams.get("page")) || 1);
  const communitySlug = slug ?? "";

  const { data: communitiesData } = useCommunities();
  const {
    posts,
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePostsFeed(communitySlug);
  const postIds = posts.map((p) => p.id);
  const { data: commentCounts = {} } = useCommentCounts(postIds);

  const pageCount = data?.pages.length ?? 0;

  // Sync URL when we have more pages (e.g. after Load more)
  useEffect(() => {
    if (pageCount >= 1 && pageCount !== pageFromUrl) {
      setSearchParams({ page: String(pageCount) }, { replace: true });
    }
  }, [pageCount, pageFromUrl, setSearchParams]);

  // On mount with ?page=N > 1, catch up by fetching more pages
  useEffect(() => {
    if (pageCount >= pageFromUrl || !hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [pageFromUrl, pageCount, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const communityExists =
    communitiesData?.some((c) => c.slug === communitySlug) ?? false;
  if (communitiesData && !communityExists) {
    return <Navigate to="/" replace />;
  }

  const isInitialLoading = isLoading && posts.length === 0;
  if (isInitialLoading) {
    return <FeedSkeleton communitySlug={communitySlug} />;
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

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back to communities
      </Link>
      <h1 className="text-2xl font-semibold">/c/{communitySlug}</h1>
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id}>
              <PostCard
                post={post}
                communitySlug={communitySlug}
                commentCount={commentCounts[post.id] ?? 0}
              />
            </div>
          ))
        )}
        {isFetchingNextPage && (
          <p className="py-2 text-center text-sm text-muted-foreground">
            Loading more…
          </p>
        )}
      </div>
      {hasNextPage && !isFetchingNextPage && (
        <Button variant="outline" className="w-full" onClick={() => void fetchNextPage()}>
          Load more
        </Button>
      )}
    </div>
  );
}
