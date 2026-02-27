import { useQuery } from "@tanstack/react-query";
import { fetchNewsById } from "@/services/news";

export function useNews(id: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["news", id],
    queryFn: () => fetchNewsById(id!),
    enabled: !!id && enabled,
  });
}
