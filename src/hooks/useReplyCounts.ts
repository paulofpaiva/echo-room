import { useQuery } from "@tanstack/react-query";
import { fetchReplyCounts } from "@/services/counts";

export function useReplyCounts(postId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["reply-counts", postId],
    queryFn: () => fetchReplyCounts(postId),
    enabled: !!postId && enabled,
  });
}
