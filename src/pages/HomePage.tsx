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
        <Card className="border shadow-none overflow-hidden">
          <div className="relative flex items-center justify-between bg-red-600 px-3 py-2 pr-9">
            <CardTitle className="text-sm font-medium text-white">
              What is echoroom
            </CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6 text-white/90 hover:bg-white/20 hover:text-white"
              onClick={handleCloseIntro}
              aria-label="Close"
            >
              ×
            </Button>
          </div>
          <CardHeader className="space-y-0 px-3 py-2">
            <CardDescription className="text-xs leading-snug">
              Anonymous imageboard-style community. Post and comment without
              accounts—your identity is a short fingerprint. Browse by community,
              expand replies. No sign-up required.
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
