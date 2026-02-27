import { useEffect } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import { BackLink } from "@/components/navigation/BackLink";
import { usePostsFeed } from "@/hooks/usePostsFeed";
import { useCommunities } from "@/hooks/useCommunities";
import { useCommentCounts } from "@/hooks/useCommentCounts";
import { PostCard } from "@/components/post/PostCard";
import { FeedSkeleton } from "@/components/skeleton/FeedSkeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

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
  const { data: commentCounts = {}, isLoading: isCommentCountsLoading } = useCommentCounts(postIds);

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

  const community = communitiesData?.find((c) => c.slug === communitySlug);
  const communityExists = community != null;
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
      <BackLink />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">/c/{communitySlug}</h1>
          {community?.created_at && (
            <p className="mt-1 text-sm text-muted-foreground">
              Created {new Date(community.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {community?.description && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {community.description}
            </p>
          )}
        </div>
        <Link
          to={`/c/${communitySlug}/post/new`}
          className="flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <PlusCircle className="h-4 w-4" />
          Create post
        </Link>
      </div>
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
                commentCountLoading={isCommentCountsLoading}
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
