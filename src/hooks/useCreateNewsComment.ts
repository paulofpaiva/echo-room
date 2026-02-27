import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewsComment, type CreateNewsCommentParams } from "@/services/createNewsComment";

export function useCreateNewsComment(newsId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateNewsCommentParams) => createNewsComment(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["news-comments-infinite", newsId] });
      queryClient.invalidateQueries({ queryKey: ["news-comment-counts"] });
      if (variables.parentId) {
        queryClient.invalidateQueries({
          queryKey: ["news-replies-infinite", newsId, variables.parentId],
        });
        queryClient.invalidateQueries({ queryKey: ["news-reply-counts", newsId] });
      }
    },
  });
}
