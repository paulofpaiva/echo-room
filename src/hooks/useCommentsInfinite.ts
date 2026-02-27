import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchComments } from "@/services/comments";
import type { Comment } from "@/types/comment";

export function useCommentsInfinite(postId: string, enabled: boolean) {
  const result = useInfiniteQuery({
    queryKey: ["comments-infinite", postId],
    queryFn: ({ pageParam }) =>
      fetchComments(postId, null, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: !!postId && enabled,
  });

  const comments: Comment[] =
    result.data?.pages.flatMap((p) => p.comments) ?? [];

  return {
    ...result,
    comments,
    hasNextPage: result.hasNextPage ?? false,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
}

export function useRepliesInfinite(
  postId: string,
  parentId: string | null,
  enabled: boolean
) {
  const result = useInfiniteQuery({
    queryKey: ["replies-infinite", postId, parentId],
    queryFn: ({ pageParam }) =>
      fetchComments(postId, parentId, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    enabled: !!postId && !!parentId && enabled,
  });

  const comments: Comment[] =
    result.data?.pages.flatMap((p) => p.comments) ?? [];

  return {
    ...result,
    comments,
    hasNextPage: result.hasNextPage ?? false,
    fetchNextPage: result.fetchNextPage,
    isFetchingNextPage: result.isFetchingNextPage,
  };
}
