import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment, type CreateCommentParams } from "@/services/createComment";

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCommentParams) => createComment(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments-infinite", postId] });
      queryClient.invalidateQueries({ queryKey: ["comment-counts"] });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["replies-infinite", postId, variables.parentId],
        });
        queryClient.invalidateQueries({ queryKey: ["reply-counts", postId] });
      }
    },
  });
}
