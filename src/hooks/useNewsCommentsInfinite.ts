import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchNewsComments } from "@/services/newsComments";
import type { NewsComment } from "@/types/news-comment";

export function useNewsCommentsInfinite(
  newsId: string,
  enabled: boolean
) {
  const result = useInfiniteQuery({
    queryKey: ["news-comments-infinite", newsId],
    queryFn: ({ pageParam }) =>
      fetchNewsComments(newsId, null, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: !!newsId && enabled,
  });

  const comments: NewsComment[] =
    result.data?.pages.flatMap((p) => p.comments) ?? [];

  return {
    ...result,
    comments,
    hasNextPage: result.hasNextPage ?? false,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
}

export function useNewsRepliesInfinite(
  newsId: string,
  parentId: string | null,
  enabled: boolean
) {
  const result = useInfiniteQuery({
    queryKey: ["news-replies-infinite", newsId, parentId],
    queryFn: ({ pageParam }) =>
      fetchNewsComments(newsId, parentId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: !!newsId && !!parentId && enabled,
  });

  const comments: NewsComment[] =
    result.data?.pages.flatMap((p) => p.comments) ?? [];

  return {
    ...result,
    comments,
    hasNextPage: result.hasNextPage ?? false,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
}
