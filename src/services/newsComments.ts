import { supabase } from "@/lib/supabase";
import type { NewsComment } from "@/types/news-comment";

const PAGE_SIZE = 10;

export async function fetchNewsComments(
  newsId: string,
  parentId: string | null,
  page: number
): Promise<{ comments: NewsComment[]; hasMore: boolean }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let q = supabase
    .from("news_comments")
    .select("*")
    .eq("news_id", newsId)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (parentId === null) {
    q = q.is("parent_id", null);
  } else {
    q = q.eq("parent_id", parentId);
  }

  const { data, error } = await q;
  if (error) throw error;
  const raw = (data ?? []) as NewsComment[];
  const hasMore = raw.length > PAGE_SIZE;
  const comments = hasMore ? raw.slice(0, PAGE_SIZE) : raw;
  return { comments, hasMore };
}

export async function fetchNewsCommentById(
  commentId: string
): Promise<NewsComment | null> {
  const { data, error } = await supabase
    .from("news_comments")
    .select("*")
    .eq("id", commentId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as NewsComment;
}

