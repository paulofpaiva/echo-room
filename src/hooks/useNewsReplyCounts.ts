import { useQuery } from "@tanstack/react-query";
import { fetchNewsReplyCounts } from "@/services/counts";

export function useNewsReplyCounts(newsId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["news-reply-counts", newsId],
    queryFn: () => fetchNewsReplyCounts(newsId),
    enabled: !!newsId && enabled,
  });
}
