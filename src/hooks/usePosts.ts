import { useQuery } from "@tanstack/react-query";
import { fetchPostsByCommunity } from "@/services/posts";

export function usePosts(communitySlug: string, page: number) {
  return useQuery({
    queryKey: ["posts", communitySlug, page],
    queryFn: () => fetchPostsByCommunity(communitySlug, page),
    enabled: !!communitySlug,
  });
}
