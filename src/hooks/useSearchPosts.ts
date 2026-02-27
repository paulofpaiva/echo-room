import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSearchPostsPage } from "@/services/search";
import type { SearchOrder } from "@/types/search";

export function useSearchPosts(query: string, order: SearchOrder) {
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: ["search-posts", trimmed, order],
    queryFn: ({ pageParam }) =>
      fetchSearchPostsPage(trimmed, order, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: trimmed.length > 0,
  });
}
