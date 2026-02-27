import { useQuery } from "@tanstack/react-query";
import { fetchNewsCommentById } from "@/services/newsComments";

export function useNewsComment(commentId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["news-comment", commentId],
    queryFn: () => fetchNewsCommentById(commentId!),
    enabled: !!commentId && enabled,
  });
}
