import { useQuery } from "@tanstack/react-query";
import { fetchCommunities } from "@/services/communities";

export function useCommunities() {
  return useQuery({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });
}
