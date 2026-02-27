import { supabase } from "@/lib/supabase";
import type { News } from "@/types/news";

const PAGE_SIZE = 20;

export async function fetchNewsList(
  query: string,
  page: number
): Promise<{ items: News[]; hasMore: boolean }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let q = supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  const term = query.trim();
  if (term) {
    q = q.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, error } = await q;
  if (error) throw error;
  const items = (data ?? []) as News[];
  const hasMore = items.length === PAGE_SIZE;
  return { items, hasMore };
}

const HOME_CAROUSEL_SIZE = 5;

export async function fetchNewsForHome(limit: number = HOME_CAROUSEL_SIZE): Promise<News[]> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as News[];
}

export async function fetchNewsById(id: string): Promise<News | null> {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data as News;
}
