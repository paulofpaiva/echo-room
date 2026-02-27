import { useQuery } from "@tanstack/react-query";
import { fetchLatestPostImages } from "@/services/homePosts";

const DEFAULT_LIMIT = 12;

export function useLatestPostImages(limit: number = DEFAULT_LIMIT) {
  return useQuery({
    queryKey: ["home-latest-post-images", limit],
    queryFn: () => fetchLatestPostImages(limit),
    staleTime: 60 * 1000,
  });
}
