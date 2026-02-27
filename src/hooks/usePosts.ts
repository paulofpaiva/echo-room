import { useQuery } from "@tanstack/react-query";
import { fetchPostsByCommunityPage } from "@/services/posts";

export function usePosts(communitySlug: string, page: number) {
  return useQuery({
    queryKey: ["posts", communitySlug, page],
    queryFn: () => fetchPostsByCommunityPage(communitySlug, page),
    enabled: !!communitySlug,
  });
}
