import { useQuery } from "@tanstack/react-query";
import { fetchCommentById } from "@/services/comments";

export function useComment(commentId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["comment", commentId],
    queryFn: () => fetchCommentById(commentId!),
    enabled: !!commentId && enabled,
  });
}
