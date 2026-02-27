import { useQuery } from "@tanstack/react-query";
import { fetchNewsCommentCounts } from "@/services/counts";

export function useNewsCommentCounts(
  newsIds: string[],
  enabled: boolean
) {
  const stableKey = newsIds.length > 0 ? [...newsIds].sort().join(",") : "";
  return useQuery({
    queryKey: ["news-comment-counts", stableKey],
    queryFn: () => fetchNewsCommentCounts(newsIds),
    enabled: newsIds.length > 0 && enabled,
  });
}
