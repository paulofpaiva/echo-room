import { useQuery } from "@tanstack/react-query";
import { fetchLatestPosts } from "@/services/homePosts";

const DEFAULT_LIMIT = 10;

export function useLatestPosts(limit: number = DEFAULT_LIMIT) {
  return useQuery({
    queryKey: ["home-latest-posts", limit],
    queryFn: () => fetchLatestPosts(limit),
    staleTime: 60 * 1000,
  });
}
