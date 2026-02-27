export interface CreateNewsCommentParams {
  newsId: string;
  parentId: string | null;
  content: string;
  anonFingerprint: string | null;
  countryCode: string | null;
}

export async function createNewsComment(
  params: CreateNewsCommentParams
): Promise<{ id: string }> {
  const { newsId, parentId, content, anonFingerprint, countryCode } = params;
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!baseUrl || !anonKey) throw new Error("Missing Supabase env");

  const url = `${baseUrl}/functions/v1/create-news-comment`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${anonKey}`,
    },
    body: JSON.stringify({
      news_id: newsId.trim(),
      parent_id: parentId,
      content: content.trim(),
      anon_fingerprint: anonFingerprint || null,
      country_code: countryCode || null,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? res.statusText);
  }

  const data = (await res.json()) as { id: string };
  return { id: data.id };
}
