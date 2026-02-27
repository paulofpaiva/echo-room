import { useQuery } from "@tanstack/react-query";
import { fetchComments } from "@/services/comments";

export function useComments(
  postId: string,
  parentId: string | null,
  page: number,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["comments", postId, parentId, page],
    queryFn: () => fetchComments(postId, parentId, page),
    enabled: !!postId && enabled,
  });
}
