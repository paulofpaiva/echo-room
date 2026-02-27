import { useQuery } from "@tanstack/react-query";
import { fetchMostCommentedPosts } from "@/services/homePosts";

const DEFAULT_LIMIT = 10;

export function useMostCommentedPosts(limit: number = DEFAULT_LIMIT) {
  return useQuery({
    queryKey: ["home-most-commented-posts", limit],
    queryFn: () => fetchMostCommentedPosts(limit),
    staleTime: 60 * 1000,
  });
}
