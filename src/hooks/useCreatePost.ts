import { useMutation } from "@tanstack/react-query";
import { createPost, type CreatePostParams } from "@/services/createPost";

export function useCreatePost() {
  return useMutation({
    mutationFn: (params: CreatePostParams) => createPost(params),
  });
}
