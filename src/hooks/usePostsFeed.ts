import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPostsByCommunityPage } from "@/services/posts";
import type { Post } from "@/types/post";

export function usePostsFeed(communitySlug: string) {
  const result = useInfiniteQuery({
    queryKey: ["posts-feed", communitySlug],
    queryFn: ({ pageParam }) =>
      fetchPostsByCommunityPage(communitySlug, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: !!communitySlug,
  });

  const posts: Post[] = result.data?.pages.flatMap((p) => p.posts) ?? [];

  return {
    ...result,
    posts,
    hasNextPage: result.hasNextPage ?? false,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
}
