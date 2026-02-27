import { useState } from "react";
import { useCommunities } from "@/hooks/useCommunities";
import { useCommunityPostCounts } from "@/hooks/useCommunityPostCounts";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CommunityList } from "@/components/community/CommunityList";
import { CommunityListSkeleton } from "@/components/skeleton/CommunityListSkeleton";
import {
  getBooleanCookie,
  setBooleanCookie,
} from "@/lib/cookie";

const INTRO_CLOSED_COOKIE = "echo-room-intro-closed";

export function HomePage() {
  const [isIntroClosed, setIsIntroClosed] = useState(() =>
    getBooleanCookie(INTRO_CLOSED_COOKIE)
  );
  const { data: communities, isLoading, isError, error } = useCommunities();
  const { data: postCounts = {} } = useCommunityPostCounts();

  const handleCloseIntro = () => {
    setBooleanCookie(INTRO_CLOSED_COOKIE, true);
    setIsIntroClosed(true);
  };

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
      {!isIntroClosed && (
        <Card>
          <CardHeader className="relative pr-12">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={handleCloseIntro}
              aria-label="Close"
            >
              ×
            </Button>
            <CardTitle>What is echoroom</CardTitle>
            <CardDescription className="text-sm mt-1 leading-relaxed">
               is an anonymous imageboard-style community. Post and
              comment without accounts—your identity is a short fingerprint so
              you stay anonymous but recognizable in a thread. Browse by
              community, vote on posts and comments, and expand replies in
              nested threads. No sign-up required.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {isLoading ? (
        <CommunityListSkeleton />
      ) : (
        <CommunityList
          communities={communities ?? []}
          postCounts={postCounts}
        />
      )}
    </div>
  );
}
