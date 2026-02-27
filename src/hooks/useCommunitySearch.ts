import { useQuery } from "@tanstack/react-query";
import { searchCommunities } from "@/services/communities";

export function useCommunitySearch(query: string) {
  const trimmed = (query ?? "").trim();
  return useQuery({
    queryKey: ["communities", "search", trimmed],
    queryFn: () => searchCommunities(trimmed),
    enabled: trimmed.length > 0,
  });
}
