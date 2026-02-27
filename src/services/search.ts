import { supabase } from "@/lib/supabase";
import type { SearchPostResult, SearchOrder } from "@/types/search";

const PAGE_SIZE = 10;

export async function fetchSearchPostsPage(
  query: string,
  order: SearchOrder,
  page: number
): Promise<{ results: SearchPostResult[]; hasMore: boolean }> {
  const offset = (page - 1) * PAGE_SIZE;

  const { data, error } = await supabase.rpc("search_posts", {
    p_query: query,
    p_order: order,
    p_limit: PAGE_SIZE + 1,
    p_offset: offset,
  });

  if (error) throw error;
  const raw = (data ?? []) as SearchPostResult[];
  const hasMore = raw.length > PAGE_SIZE;
  const results = hasMore ? raw.slice(0, PAGE_SIZE) : raw;
  return {
    results: results.map((r) => ({
      ...r,
      comment_count: Number(r.comment_count),
    })),
    hasMore,
  };
}
