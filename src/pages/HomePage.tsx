import { useCommunities } from "@/hooks/useCommunities";
import { useCommunityPostCounts } from "@/hooks/useCommunityPostCounts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommunityList } from "@/components/community/CommunityList";
import { CommunityListSkeleton } from "@/components/skeleton/CommunityListSkeleton";
import { LatestPostsSection } from "@/components/home/LatestPostsSection";
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
      <Card className="border shadow-none overflow-hidden">
        <div className="bg-primary px-3 py-2">
          <CardTitle className="text-sm font-medium text-primary-foreground">
            Welcome to echoroom
          </CardTitle>
        </div>
        <CardHeader className="space-y-0 px-3 py-2">
          <CardDescription className="text-xs leading-snug">
            Pick a community below to browse and join the conversation.
          </CardDescription>
        </CardHeader>
      </Card>

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
    </div>
  );
}
