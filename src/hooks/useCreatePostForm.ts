import { useNavigate } from "react-router-dom";
import { useCreatePost } from "@/hooks/useCreatePost";
import { useCountryCode } from "@/hooks/useCountryCode";
import { getOrCreateAnonFingerprint } from "@/lib/anon-fingerprint";
import { getCountryCodeForSubmit } from "@/services/geo";
import type { CreatePostFormValues } from "@/schemas/createPost";

export function useCreatePostForm(slug: string | undefined) {
  const navigate = useNavigate();
  const createPost = useCreatePost();
  const { countryCode } = useCountryCode();

  const submit = async (data: CreatePostFormValues, imageFiles: File[]) => {
    if (!slug?.trim()) return;
    const resolvedCountryCode = countryCode ?? (await getCountryCodeForSubmit());
    const { id } = await createPost.mutateAsync({
      title: data.title.trim(),
      content: data.content.trim(),
      communitySlug: slug,
      anonFingerprint: getOrCreateAnonFingerprint() || null,
      countryCode: resolvedCountryCode,
      imageFiles,
    });
    navigate(`/c/${slug}/post/${id}`, { replace: true });
  };

  return {
    submit,
    isPending: createPost.isPending,
    isError: createPost.isError,
    error: createPost.error,
  };
}
