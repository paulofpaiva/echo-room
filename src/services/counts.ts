import { supabase } from "@/lib/supabase";

export async function fetchCommentCounts(
  postIds: string[]
): Promise<Record<string, number>> {
  if (postIds.length === 0) return {};
  const { data, error } = await supabase.rpc("get_comment_counts", {
    p_post_ids: postIds,
  });
  if (error) throw error;
  const rows = (data ?? []) as { post_id: string; comment_count: number }[];
  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.post_id] = Number(row.comment_count);
  }
  return map;
}

export async function fetchReplyCounts(
  postId: string
): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc("get_reply_counts", {
    p_post_id: postId,
  });
  if (error) throw error;
  const rows = (data ?? []) as { comment_id: string; reply_count: number }[];
  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.comment_id] = Number(row.reply_count);
  }
  return map;
}

export async function fetchCommunityPostCounts(): Promise<
  Record<string, number>
> {
  const { data, error } = await supabase.rpc("get_community_post_counts");
  if (error) throw error;
  const rows = (data ?? []) as {
    community_id: string;
    post_count: number;
  }[];
  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.community_id] = Number(row.post_count);
  }
  return map;
}

export async function fetchNewsCommentCounts(
  newsIds: string[]
): Promise<Record<string, number>> {
  if (newsIds.length === 0) return {};
  const { data, error } = await supabase.rpc("get_news_comment_counts", {
    p_news_ids: newsIds,
  });
  if (error) throw error;
  const rows = (data ?? []) as { news_id: string; comment_count: number }[];
  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.news_id] = Number(row.comment_count);
  }
  return map;
}

export async function fetchNewsReplyCounts(
  newsId: string
): Promise<Record<string, number>> {
  const { data, error } = await supabase.rpc("get_news_reply_counts", {
    p_news_id: newsId,
  });
  if (error) throw error;
  const rows = (data ?? []) as { comment_id: string; reply_count: number }[];
  const map: Record<string, number> = {};
  for (const row of rows) {
    map[row.comment_id] = Number(row.reply_count);
  }
  return map;
}
