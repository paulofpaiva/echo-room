import { supabase } from "@/lib/supabase";
import type { Comment } from "@/types/comment";

const PAGE_SIZE = 10;

export async function fetchComments(
  postId: string,
  parentId: string | null,
  page: number
): Promise<{ comments: Comment[]; hasMore: boolean }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE; // request PAGE_SIZE + 1 to know if there are more

  let query = supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .range(from, to);

  if (parentId === null) {
    query = query.is("parent_id", null);
  } else {
    query = query.eq("parent_id", parentId);
  }

  const { data, error } = await query;
  if (error) throw error;
  const raw = (data ?? []) as Comment[];
  const hasMore = raw.length > PAGE_SIZE;
  const comments = hasMore ? raw.slice(0, PAGE_SIZE) : raw;
  return { comments, hasMore };
}
