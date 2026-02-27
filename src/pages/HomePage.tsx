import { useCommunities } from "@/hooks/useCommunities";
import { useCommunityPostCounts } from "@/hooks/useCommunityPostCounts";
import { useLatestPostImages } from "@/hooks/useLatestPostImages";
import { CommunityList } from "@/components/community/CommunityList";
import { CommunityListSkeleton } from "@/components/skeleton/CommunityListSkeleton";
import { LatestImagesSection } from "@/components/home/LatestImagesSection";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
import { NewsSection } from "@/components/home/NewsSection";
import { TopCommentedPostsSection } from "@/components/home/TopCommentedPostsSection";

export function HomePage() {
  const { data: communities, isLoading, isError, error } = useCommunities(5);
  const { data: postCounts = {} } = useCommunityPostCounts();
  const { data: images = [] } = useLatestPostImages(4);
  const hasImages = images.length > 0;

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
      <div className="pb-4 border-b border-dashed border-border">
        <h1 className="text-2xl font-semibold">Welcome to echoroom</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pick a community below to browse and join the conversation.
        </p>
      </div>

      <section className="pb-4 border-b border-dashed border-border">
        {isLoading ? (
          <CommunityListSkeleton />
        ) : (
          <CommunityList
            communities={communities ?? []}
            postCounts={postCounts}
          />
        )}
      </section>

      <section className={hasImages ? "pb-4 border-b border-dashed border-border grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6" : "pb-4 border-b border-dashed border-border"}>
        <div className={hasImages ? "md:col-span-8" : undefined}>
          <LatestPostsSection />
        </div>
        {hasImages && (
          <div className="md:col-span-4 min-w-0">
            <LatestImagesSection />
          </div>
        )}
      </section>

      <section className="pb-4 border-b border-dashed border-border">
        <TopCommentedPostsSection />
      </section>

      <section className="pb-4 border-b border-dashed border-border">
        <NewsSection />
      </section>
    </div>
  );
}
