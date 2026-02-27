import { useQuery } from "@tanstack/react-query";
import { fetchCommunities } from "@/services/communities";

export function useCommunities(limit?: number) {
  return useQuery({
    queryKey: ["communities", limit],
    queryFn: () => fetchCommunities(limit),
  });
}
