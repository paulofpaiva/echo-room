import { useQuery } from "@tanstack/react-query";
import { fetchCommentCounts } from "@/services/counts";

export function useCommentCounts(postIds: string[]) {
  return useQuery({
    queryKey: ["comment-counts", [...postIds].sort().join(",")],
    queryFn: () => fetchCommentCounts(postIds),
    enabled: postIds.length > 0,
  });
}
