import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNewsList } from "@/services/news";
import type { News } from "@/types/news";

export function useNewsList(query: string) {
  const result = useInfiniteQuery({
    queryKey: ["news-list", query],
    queryFn: ({ pageParam }) =>
      fetchNewsList(query, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
  });

  const items: News[] = result.data?.pages.flatMap((p) => p.items) ?? [];

  return {
    ...result,
    items,
    hasNextPage: result.hasNextPage ?? false,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
}
