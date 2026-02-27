import { useQuery } from "@tanstack/react-query";
import { fetchNewsCommentCounts } from "@/services/counts";

export function useNewsCommentCounts(
  newsIds: string[],
  enabled: boolean
) {
  return useQuery({
    queryKey: ["news-comment-counts", newsIds],
    queryFn: () => fetchNewsCommentCounts(newsIds),
    enabled: newsIds.length > 0 && enabled,
  });
}
