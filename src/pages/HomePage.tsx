import { useCommunities } from "@/hooks/useCommunities";
import { useCommunityPostCounts } from "@/hooks/useCommunityPostCounts";
import { CommunityList } from "@/components/community/CommunityList";
import { CommunityListSkeleton } from "@/components/skeleton/CommunityListSkeleton";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { NewsSection } from "@/components/home/NewsSection";
import { TopCommentedPostsSection } from "@/components/home/TopCommentedPostsSection";

export function HomePage() {
  const { data: communities, isLoading, isError, error } = useCommunities();
  const { data: postCounts = {} } = useCommunityPostCounts();

  if (isError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Communities</h1>
        <p className="text-destructive">
          {error instanceof Error ? error.message : "Failed to load communities."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome to echoroom</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pick a community below to browse and join the conversation.
        </p>
      </div>

      {isLoading ? (
        <CommunityListSkeleton />
      ) : (
        <CommunityList
          communities={communities ?? []}
          postCounts={postCounts}
        />
      )}

      <LatestPostsSection />
      <TopCommentedPostsSection />
      <NewsSection />
    </div>
  );
}
