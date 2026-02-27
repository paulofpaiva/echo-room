import { useQuery } from "@tanstack/react-query";
import { fetchCommunityPostCounts } from "@/services/counts";

export function useCommunityPostCounts() {
  return useQuery({
    queryKey: ["community-post-counts"],
    queryFn: fetchCommunityPostCounts,
  });
}