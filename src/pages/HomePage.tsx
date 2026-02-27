import { useCommunities } from "@/hooks/useCommunities";
import { useCommunityPostCounts } from "@/hooks/useCommunityPostCounts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommunityCard } from "@/components/community/CommunityCard";

export function HomePage() {
  const { data: communities, isLoading, isError, error } = useCommunities();
  const { data: postCounts = {} } = useCommunityPostCounts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Communities</h1>
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

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
      <Card>
        <CardHeader>
          <CardTitle>What is Echo Room</CardTitle>
          <CardDescription className="text-sm mt-1 leading-relaxed">
            Echo Room is an anonymous imageboard-style community. Post and
            comment without accounts—your identity is a short fingerprint so
            you stay anonymous but recognizable in a thread. Browse by
            community, vote on posts and comments, and expand replies in
            nested threads. No sign-up required.
          </CardDescription>
        </CardHeader>
      </Card>

      <h1 className="text-2xl font-semibold">Communities</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(communities ?? []).map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            postCount={postCounts[community.id] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
