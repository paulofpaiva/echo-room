import { useQuery } from "@tanstack/react-query";
import { fetchPostById } from "@/services/posts";

export function usePost(postId: string | undefined) {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId!),
    enabled: !!postId,
  });
}
